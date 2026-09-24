/**
 * app.js — Pure Express application (no server.listen here)
 *
 * Separation of concerns:
 *  - app.js  → Express app, middleware, routes (testable in isolation)
 *  - server.js → HTTP server bootstrap, process event handlers
 */

require('express-async-errors');

const path       = require('path');
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const compression = require('compression');

const connectDB      = require('./config/db');
const errorHandler   = require('./middleware/errorHandler');

// Route Imports
const authRoutes      = require('./routes/auth.routes');
const userRoutes      = require('./routes/user.routes');
const resumeRoutes    = require('./routes/resume.routes');
const interviewRoutes = require('./routes/interview.routes');
const sessionRoutes   = require('./routes/session.routes');
const jobsRoutes      = require('./routes/jobs.routes');
const adminRoutes     = require('./routes/admin.routes');
const oauthRoutes     = require('./routes/oauth.routes');

const app = express();

// ─── Database ──────────────────────────────────────────────────────
connectDB();

// ─── Security Headers ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to be loaded cross-origin
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'], // allow images from any origin
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// ─── Gzip Compression ─────────────────────────────────────────────
// Compresses all JSON/text responses above the threshold.
// Skips already-encoded content (images, pre-gzipped assets).
app.use(compression({
  // Only compress responses larger than this (bytes). Default 1KB.
  threshold: parseInt(process.env.COMPRESSION_THRESHOLD_BYTES, 10) || 1024,
  // zlib compression level: 1 (fast) – 9 (best). 6 = balanced default.
  level: parseInt(process.env.COMPRESSION_LEVEL, 10) || 6,
  filter(req, res) {
    // Honour the caller's opt-out header
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

// ─── CORS ─────────────────────────────────────────────────────────
const getAllowedOrigins = () => {
  const rawAllowed = process.env.CLIENT_URL || 'http://localhost:5173';
  return rawAllowed
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, server-to-server, curl)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');
    const allowedOrigins = getAllowedOrigins();

    // Check exact configured origins
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow localhost/127.0.0.1 for development
    if (
      process.env.NODE_ENV !== 'production' ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)
    ) {
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
        return callback(null, true);
      }
    }

    // Seamlessly allow Render frontend services (*.onrender.com)
    if (/^https:\/\/[a-zA-Z0-9-]+\.onrender\.com$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`[CORS] Rejected origin: ${origin} (Configured: ${allowedOrigins.join(', ')})`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
}));


// ─── Rate Limiting ─────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX)        || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

// ─── Body Parsers ──────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── HTTP Request Logger ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Static Assets (Uploaded Resumes / Avatars) ───────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.status(200).json({ success: true, message: 'OK', timestamp: new Date().toISOString() })
);

// ─── API Routes ────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/resumes',    resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/sessions',   sessionRoutes);
app.use('/api/jobs',       jobsRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/auth',       oauthRoutes);

// ─── 404 Catch-all ────────────────────────────────────────────────
app.use('*', (req, res) =>
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` })
);

// ─── Global Error Handler (must be last) ──────────────────────────
app.use(errorHandler);

module.exports = app;
