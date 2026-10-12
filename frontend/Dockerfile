# syntax=docker/dockerfile:1

# ── Frontend Dockerfile — Vite build served by Nginx ────────────────
# Stage 1: build the static bundle
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# VITE_API_URL / VITE_APP_NAME are baked in at build time.
# Pass them via --build-arg in CI, or docker-compose build args.
ARG VITE_API_URL=/api
ARG VITE_APP_NAME="AI Interview Prep"
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}
RUN npm run build

# Stage 2: serve with Nginx, also reverse-proxying API + Socket.IO
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
