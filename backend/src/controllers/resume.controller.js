const fs = require('fs');
const path = require('path');
const pdfParseModule = require('pdf-parse');
const Resume = require('../models/Resume.model');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');
const { parseResumeAndJD } = require('../services/ai.service');
const { chunkDocument, chunkResumeAndJD, estimateTokens } = require('../services/chunking.service');
const { normalizeText } = require('../utils/normalizer');

/**
 * Robust text extractor supporting both pdf-parse v1 (function)
 * and pdf-parse v2+ ({ PDFParse } class)
 */
async function extractTextFromPdfBuffer(buffer) {
  if (typeof pdfParseModule === 'function') {
    const res = await pdfParseModule(buffer);
    return res.text;
  }
  if (pdfParseModule.PDFParse) {
    const parser = new pdfParseModule.PDFParse({ data: buffer });
    const res = await parser.getText();
    if (typeof parser.destroy === 'function') {
      await parser.destroy();
    }
    return res.text;
  }
  if (pdfParseModule.default && typeof pdfParseModule.default === 'function') {
    const res = await pdfParseModule.default(buffer);
    return res.text;
  }
  throw new Error('Unsupported pdf-parse export');
}

// ─── POST /api/resumes/upload ─────────────────────────────────────
exports.uploadResume = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file.', 400));
  }

  const { originalname, buffer, size, mimetype } = req.file;

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return next(new AppError('File storage is not configured on the server (missing Cloudinary credentials).', 500));
  }

  let fileUrl;
  let publicId;

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'ai-interview/resumes', resource_type: 'auto', public_id: `resume-${Date.now()}` },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(buffer);
    });
    fileUrl = uploadResult.secure_url;
    publicId = uploadResult.public_id;
  } catch (cloudErr) {
    return next(new AppError(`File upload failed: ${cloudErr.message}`, 500));
  }

  // Extract text from PDF for AI context
  let extractedText = null;
  let parseStatus = 'pending';

  try {
    if (mimetype === 'application/pdf' || (originalname && originalname.toLowerCase().endsWith('.pdf'))) {
      const rawText = await extractTextFromPdfBuffer(buffer);
      extractedText = rawText?.slice(0, 8000) ?? null; // Limit to 8k chars
      parseStatus = extractedText ? 'parsed' : 'failed';
    }
  } catch (err) {
    console.warn('[ResumeUpload] PDF text extraction error:', err.message);
    parseStatus = 'failed';
  }

  // AI-powered structured extraction (resume-only, no JD needed)
  let parsedData = null;
  let isParsed = false;
  if (extractedText) {
    try {
      parsedData = await parseResumeAndJD(extractedText, '');
      isParsed = true;
    } catch (err) {
      console.warn('[ResumeUpload] AI parsing failed:', err.message);
    }
  }

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: publicId,
    originalName: originalname,
    fileUrl,
    publicId,
    fileSize: size,
    mimeType: mimetype,
    extractedText,
    parseStatus,
    parsedData,
    isParsed,
    isDefault: false,
  });

  // Auto-set as default if first resume
  const count = await Resume.countDocuments({ userId: req.user._id });
  if (count === 1) {
    resume.isDefault = true;
    await resume.save();
  }

  res.status(201).json({ success: true, resume });
};

// ─── GET /api/resumes ─────────────────────────────────────────────
exports.getMyResumes = async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, count: resumes.length, resumes });
};

// ─── DELETE /api/resumes/:id ──────────────────────────────────────
exports.deleteResume = async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) return next(new AppError('Resume not found.', 404));

  // Delete from Cloudinary if remote
  try {
    if (resume.publicId) {
      await cloudinary.uploader.destroy(resume.publicId, { resource_type: 'auto' });
    }
  } catch {
    // Non-fatal
  }

  await resume.deleteOne();
  res.status(200).json({ success: true, message: 'Resume deleted successfully.' });
};

// ─── PATCH /api/resumes/:id/default ──────────────────────────────
exports.setDefaultResume = async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) return next(new AppError('Resume not found.', 404));

  resume.isDefault = true;
  await resume.save(); // pre-save hook clears old defaults

  res.status(200).json({ success: true, message: 'Default resume updated.', resume });
};

// ─── POST /api/resumes/:id/parse ──────────────────────────────────
// Re-parse resume with an optional job description for richer context
exports.parseResume = async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) return next(new AppError('Resume not found.', 404));

  if (!resume.extractedText) {
    return next(new AppError('No text extracted from this resume. Upload a valid PDF.', 400));
  }

  const jdText = req.body.jobDescription || '';

  try {
    const parsedData = await parseResumeAndJD(resume.extractedText, jdText);
    resume.parsedData = parsedData;
    resume.isParsed = true;
    resume.parseStatus = 'parsed';
    await resume.save();

    res.status(200).json({ success: true, parsedData });
  } catch (err) {
    return next(new AppError(`AI parsing failed: ${err.message}`, 500));
  }
};

// ─── POST /api/resumes/chunk-preview ──────────────────────────────
// Debug endpoint: run semantic chunker on raw text, view metadata-tagged output
exports.chunkPreview = async (req, res, next) => {
  const { resumeText = '', jobDescription = '' } = req.body;

  if (!resumeText && !jobDescription) {
    return next(new AppError('Provide at least one of resumeText or jobDescription.', 400));
  }

  const chunks = chunkResumeAndJD(resumeText, jobDescription);

  const enriched = chunks.map((chunk, i) => ({
    index:             i,
    content:           chunk.content,
    normalizedContent: normalizeText(chunk.content),
    metadata:          chunk.metadata,
    estimatedTokens:   estimateTokens(chunk.content),
    charCount:         chunk.content.length,
  }));

  const summary = {
    totalChunks:       enriched.length,
    resumeChunks:      enriched.filter((c) => c.metadata.type === 'resume').length,
    jdChunks:          enriched.filter((c) => c.metadata.type === 'job_description').length,
    sectionsFound:     [...new Set(enriched.map((c) => c.metadata.section))],
    avgTokensPerChunk: Math.round(enriched.reduce((s, c) => s + c.estimatedTokens, 0) / (enriched.length || 1)),
    maxTokensInChunk:  Math.max(...enriched.map((c) => c.estimatedTokens)),
  };

  res.status(200).json({ success: true, summary, chunks: enriched });
};

