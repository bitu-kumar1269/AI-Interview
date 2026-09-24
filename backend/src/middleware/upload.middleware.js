const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

/**
 * Memory storage — files are kept as an in-memory Buffer (req.file.buffer)
 * rather than written to disk. Required for serverless platforms like
 * Vercel, where the filesystem is read-only outside /tmp and nothing
 * written to disk survives between invocations anyway. Works identically
 * in local dev too.
 *
 * Files are then streamed straight to Cloudinary from the buffer —
 * see resume.controller.js / user.controller.js.
 */

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
  ];
  const allowedExts = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF and Word documents are allowed.', 400), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const avatarFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (JPG, PNG, WebP, GIF) are allowed for profile photo.', 400), false);
  }
};

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: avatarFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
module.exports.upload = upload;
module.exports.resumeUpload = upload;
module.exports.avatarUpload = avatarUpload;
