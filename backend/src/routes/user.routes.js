const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  getDashboard,
} = require('../controllers/user.controller');
const { avatarUpload } = require('../middleware/upload.middleware');

router.use(protect); // all user routes are protected

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/avatar', avatarUpload.single('avatar'), uploadAvatar);
router.delete('/avatar', deleteAvatar);
router.put('/change-password', changePassword);
router.get('/dashboard', getDashboard);

module.exports = router;
