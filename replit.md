# AI Career Mentor & Job Application Automation Platform

## Project Overview

A full-stack MERN application that helps students manage job applications, build resumes, prepare for interviews, and get AI-powered career guidance.

## Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS v4 (`client/`)
- **Backend**: Node.js + Express (`server/`)
- **Database**: MongoDB (connection in `server/config/db.js`)
- **AI**: OpenAI API via backend routes
- **File Storage**: Cloudinary (resume PDFs)
- **Auth**: JWT stored in localStorage

## Running the Frontend

```
cd client && npm run dev
```

Runs on **port 5000**. Workflow: `Start application`.

## Running the Backend

Workflow: `Start backend` (runs automatically on port **3001**).

```
cd server && node server.js
```

The Vite dev server proxies all `/api` requests from port 5000 → 3001, so the frontend always uses relative `/api` URLs. The backend starts even without MongoDB, but DB-dependent routes will fail until `MONGO_URI` is set.

## Required Secrets

Set these in Replit Secrets before running the backend:

| Secret | Purpose |
|--------|---------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `EMAIL_USER` | Email address for Nodemailer |
| `EMAIL_PASS` | Email password/app password |

## Frontend Structure

```
client/src/
├── components/       # Reusable UI components
├── context/          # AuthContext, ToastContext
├── pages/            # Route-level page components
├── routes/           # ProtectedRoute
├── services/         # Axios API service modules
└── utils/            # helpers.js (formatDate, statusColors, etc.)
```

## Key Frontend Files

- `client/src/services/api.js` — Axios instance; **baseURL is `http://localhost:5000/api`** — update this when backend is deployed
- `client/src/context/AuthContext.jsx` — user state + localStorage persistence
- `client/src/context/ToastContext.jsx` — global toast notifications

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login.jsx | Auth with form validation |
| `/register` | Register.jsx | Registration |
| `/dashboard` | Dashboard.jsx | Stats cards + charts + recent apps |
| `/profile` | Profile.jsx | Edit profile, skills tags |
| `/resume` | Resume.jsx | Upload (drag & drop), ATS scores |
| `/jobs` | Jobs.jsx | CRUD jobs with modal form |
| `/applications` | Applications.jsx | Track applications with status timeline |
| `/ai` | AIDashboard.jsx | AI chat, resume analysis, interview prep |

## User Preferences

- No inline CSS — Tailwind only
- No backend changes — frontend only
- Professional dashboard UI (Notion/Vercel/Clerk style)
- Indigo as primary color
- All pages fully responsive
