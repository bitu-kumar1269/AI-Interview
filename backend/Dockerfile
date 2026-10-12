# syntax=docker/dockerfile:1

# ── Backend Dockerfile — Node.js + Express + Socket.IO ──────────────
# Multi-stage build: install deps in a build stage, copy only what's
# needed into a slim runtime image.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app

# Run as non-root for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeapp -u 1001

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# Writable dirs the app expects (logs; uploads is a legacy dir,
# actual file storage is Cloudinary — kept only so nothing throws
# if any path still references it)
RUN mkdir -p logs uploads/resumes uploads/avatars && \
    chown -R nodeapp:nodejs /app

USER nodeapp

EXPOSE 5000

# Matches your existing /api/health route
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 5000) + '/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
