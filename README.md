# AI Interview App

A full-stack AI interview platform for job seekers and recruiters. Candidates can create profiles, upload resumes, browse job listings, and complete AI-powered mock interviews. Admin users can manage jobs, templates, prompts, analytics, and platform settings from a dedicated admin interface.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Real-time communication: Socket.IO
- AI: Groq SDK
- Storage: Cloudinary
- Caching: Redis (optional but supported)
- Auth: JWT + OAuth (Google/GitHub-style flow)

## Features

- User registration and login
- JWT-based protected routes
- Resume upload and parsing
- AI-generated interview questions
- Real-time interview session flow
- Candidate answer evaluation with AI feedback
- Job search and recommendations
- Admin dashboard for analytics, user management, and settings
- Role-based access control for admin workflows
- File/image upload support via Cloudinary
- OAuth-ready authentication integration

## Project Structure

```text
ai-interview/
├── backend/             # Express API and business logic
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── .env
├── frontend/            # React frontend app
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── devops/              # Deployment configuration and infrastructure
├── package.json         # Root scripts for running both apps
├── SECURITY.md
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm or yarn
- MongoDB instance
- Redis (optional for caching/job syncing)
- Cloudinary account
- Groq API key
- Adzuna API credentials (for job search features)

## Quick Start

1. Install the root dependencies:

```bash
npm install
```

2. Install backend and frontend dependencies:

```bash
npm run install:all
```

3. Create environment files:

Create a `.env` file in the `backend` folder with the following values:

```env
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/ai-interview
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Groq
GROQ_API_KEY=your_groq_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (optional)
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379

# Adzuna (optional, required for job scraping/search)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# Optional OAuth providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5001/api/auth/github/callback
```

> Note: The frontend dev server is configured to proxy API requests to `http://localhost:5001`, so using `PORT=5001` keeps the app aligned with the current Vite proxy configuration.

4. Start the apps:

```bash
npm run dev
```

This runs both the backend and frontend concurrently.

## Development Commands

From the project root:

```bash
npm run dev            # Run frontend and backend together
npm run dev:backend    # Start backend only
npm run dev:frontend   # Start frontend only
npm start              # Start backend in production mode
```

From the backend folder:

```bash
cd backend
npm run dev
npm start
npm test
```

From the frontend folder:

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

## Application URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- Health check: http://localhost:5001/api/health

## API Overview

The backend exposes REST APIs for:

- Authentication and user management
- Resume upload and parsing
- Jobs and recommendations
- Interview session lifecycle
- Admin tools and analytics
- OAuth login flows

## Deployment Notes

This project includes infrastructure and deployment resources under the `devops` folder, including Ansible, Terraform, and Puppet assets for environment setup and deployment automation.

## Security

Please review the security policy in [SECURITY.md](SECURITY.md) before deploying the application to production.

## License

This project is currently intended for internal or project-specific use. Add an explicit license if you plan to distribute or open-source the codebase.
