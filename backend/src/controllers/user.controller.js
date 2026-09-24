const fs = require('fs');
const path = require('path');
const User = require('../models/User.model');
const Session = require('../models/Session.model');
const AppError = require('../utils/AppError');
const cloudinary = require('../config/cloudinary');

// ─── GET /api/users/profile ───────────────────────────────────────
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({ path: 'resumes', select: 'fileName originalName isDefault parseStatus createdAt' });

  res.status(200).json({ success: true, user });
};

// ─── PUT /api/users/profile ───────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  const { name, avatar, bio, summary, linkedin, github, leetcode } = req.body;

  const allowedFields = {};
  if (name !== undefined) allowedFields.name = name.trim();
  if (avatar !== undefined) allowedFields.avatar = avatar;
  if (bio !== undefined) allowedFields.bio = bio;
  if (summary !== undefined) {
    allowedFields.summary = summary;
    if (bio === undefined) allowedFields.bio = summary;
  } else if (bio !== undefined && summary === undefined) {
    allowedFields.summary = bio;
  }
  if (linkedin !== undefined) allowedFields.linkedin = linkedin.trim();
  if (github !== undefined) allowedFields.github = github.trim();
  if (leetcode !== undefined) allowedFields.leetcode = leetcode.trim();

  const user = await User.findByIdAndUpdate(req.user._id, allowedFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
};

// ─── POST /api/users/avatar ───────────────────────────────────────
exports.uploadAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select an image to upload.', 400));
  }

  const { buffer } = req.file;

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return next(new AppError('File storage is not configured on the server (missing Cloudinary credentials).', 500));
  }

  let avatarUrl;

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'ai-interview/avatars',
          resource_type: 'image',
          transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
          public_id: `avatar-${req.user._id}-${Date.now()}`,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(buffer);
    });
    avatarUrl = result.secure_url;
  } catch (cloudErr) {
    return next(new AppError(`Avatar upload failed: ${cloudErr.message}`, 500));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile photo updated successfully.',
    avatarUrl,
    user,
  });
};

// ─── DELETE /api/users/avatar ─────────────────────────────────────
exports.deleteAvatar = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError('User not found.', 404));

  user.avatar = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile photo removed successfully.',
    user,
  });
};

// ─── PUT /api/users/change-password ───────────────────────────────
exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully.' });
};

// ─── GET /api/users/dashboard ─────────────────────────────────────
exports.getDashboard = async (req, res) => {
  const userId = req.user._id;

  const [totalSessions, completedSessions, recentSessions] = await Promise.all([
    Session.countDocuments({ userId }),
    Session.countDocuments({ userId, status: 'completed' }),
    Session.find({ userId, status: 'completed' })
      .sort('-createdAt')
      .limit(5)
      .populate({ path: 'interviewId', select: 'jobTitle company experienceLevel' }),
  ]);

  const scoreAgg = await Session.aggregate([
    { $match: { userId, status: 'completed', overallScore: { $ne: null } } },
    { $group: { _id: null, avgScore: { $avg: '$overallScore' }, maxScore: { $max: '$overallScore' } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalSessions,
      completedSessions,
      averageScore: scoreAgg[0]?.avgScore?.toFixed(1) ?? 0,
      bestScore: scoreAgg[0]?.maxScore ?? 0,
      recentSessions,
    },
  });
};
