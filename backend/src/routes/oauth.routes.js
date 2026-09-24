const express = require('express');
const router = express.Router();
const oauth = require('../controllers/oauth.controller');

// Google
router.get('/google', oauth.google.redirect);
router.get('/google/callback', oauth.google.callback);

// GitHub
router.get('/github', oauth.github.redirect);
router.get('/github/callback', oauth.github.callback);

// LinkedIn
router.get('/linkedin', oauth.linkedin.redirect);
router.get('/linkedin/callback', oauth.linkedin.callback);

module.exports = router;
