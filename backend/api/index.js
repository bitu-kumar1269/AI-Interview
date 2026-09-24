/**
 * api/index.js — Vercel serverless entry point
 *
 * IMPORTANT: This is intentionally NOT server.js.
 *
 * server.js starts Socket.IO (for real-time AI interview sessions) and
 * background interval schedulers (job sync / cleanup). Neither works on
 * Vercel's serverless functions — there's no persistent process for
 * WebSockets to live on, and setInterval-based schedulers stop firing
 * between invocations.
 *
 * This file exports the plain Express app (from src/app.js), which
 * Vercel's Node.js runtime can invoke directly as a request handler.
 * Real-time interview features and the job sync/cleanup schedulers are
 * NOT available when running this way — see DEPLOYMENT.md.
 */

require('dotenv').config({ override: true });

const app = require('../src/app');

module.exports = app;
