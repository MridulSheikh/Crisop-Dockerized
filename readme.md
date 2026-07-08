# Crisop Docker Monorepo

## Overview

This repository contains a full-stack e-commerce application with a Next.js frontend and a TypeScript + Express backend, orchestrated by Docker Compose. The project includes inventory management, product catalog, order flow, user authentication, admin/dashboard features, and a chat/AI integration.

## Services

- `web` (frontend)
  - Built from `./frontend/Dockerfile`
  - Exposed on `http://localhost:3000`
- `api` (backend)
  - Built from `./api/Dockerfile`
  - Exposed on `http://localhost:5000`

## Tech Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express, TypeScript, Mongoose
- Database: MongoDB (expected via environment configuration)
- Integrations: Cloudinary, Stripe, Google/Facebook OAuth, Redis, Nodemailer
- AI / Chat: backend AI chatbot module and integration with frontend chat UI

## Directory Structure

- `compose.yml` - Docker Compose service configuration
- `api/` - backend service
  - `Dockerfile` - backend container build
  - `src/` - server source, routes, modules, middlewares, helpers, and utils
  - `package.json` - backend scripts and dependencies
  - `README.md` - API-specific setup and endpoint details
- `frontend/` - frontend service
  - `Dockerfile` - frontend container build
  - `src/` - Next.js app routes, components, Redux store, pages and utilities
  - `package.json` - frontend scripts and dependencies
  - `README.md` - frontend-specific setup and development notes
- `uploads/` - temporary upload files used by the backend

## Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

To stop and remove containers:

```bash
docker compose down
```

## Local Development

### Backend

```bash
cd api
npm install
cp .env.example .env   # create or update .env file manually
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # create or update .env.local manually
npm run dev
```

## Environment Variables

### Backend (`api/.env`)

Common environment variables include:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASS`, `SMTP_SERVICE`
- `SALT_ROUNDS`
- `JWT_SECRET`, `JWT_EXPIREIN`
- `JWT_REFRESH_TOKEN_SECRET`, `JWT_REFRESH_EXPIREIN`
- `JWT_RESETPASSWORD_TOKEN_SECRET`, `JWT_RESETPASSWORD_TOKEN_EXPIREIN`
- `CLIENT_URL`
- `GOOGLE_CLIENT_ID`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `REDIS_CONNECTION`
- `GEMINI_API_KEY`, `GROQ_API_KEY`

### Frontend (`frontend/.env.local`)

Common environment variables include:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_FACEBOOK_APP_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SENDGRID_API`

## Notes

- The backend API is mounted under `/api/v1` and provides authentication, product management, order handling, inventory management, and contact endpoints.
- The frontend uses a modern Next.js architecture with app routes, reusable components, protected routes, and admin views.
- The repo includes separate README files under `api/` and `frontend/` for deeper service-specific details.

## Useful Commands

### Backend

- `npm run start:dev` - Run backend in development mode
- `npm run build` - Compile TypeScript
- `npm run start:prod` - Run production build

### Frontend

- `npm run dev` - Start Next.js development server
- `npm run build` - Build frontend for production
- `npm run start` - Start frontend production server

## Author

Mridul Sheikh

## Contact

- LinkedIn: https://www.linkedin.com/in/mridul-sheikh/
- Email: mridul.sheikh.90@gamil.com
- WhatsApp: 01883992408
