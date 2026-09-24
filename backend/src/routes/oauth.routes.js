const express = require('express');
const router = express.Router();
const oauth = require('../controllers/oauth.controller');

// Google
router.get('/google', oauth.google.redirect);
router.get('/google/callback', oauth.google.callback);

module.exports = router;

