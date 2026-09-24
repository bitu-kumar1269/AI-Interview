const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const {
  uploadResume,
  getMyResumes,
  deleteResume,
  setDefaultResume,
  parseResume,
  chunkPreview,
} = require('../controllers/resume.controller');

const multer = require('multer');
const AppError = require('../utils/AppError');

const handleResumeUpload = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(new AppError(`File upload error: ${err.message}`, 400));
      }
      return next(new AppError(err.message || 'File upload failed', 400));
    }
    next();
  });
};

router.use(protect);

router.post('/upload', handleResumeUpload, uploadResume);
router.post('/chunk-preview', chunkPreview);      // ← debug: test chunker output
router.get('/', getMyResumes);
router.delete('/:id', deleteResume);
router.patch('/:id/default', setDefaultResume);
router.post('/:id/parse', parseResume);

module.exports = router;
