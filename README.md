# LifeReplay AI

**See possible futures before making important life decisions.**

LifeReplay AI is a hackathon MVP for Bharat Academix CodeQuest 2026. It helps students, job seekers, professionals, and entrepreneurs explore possible outcomes before committing to important choices.

## Problem Statement

Important career, education, finance, and startup decisions are often made with incomplete information. People usually compare options informally, rely on scattered advice, or wait until consequences become visible. This creates avoidable risk, stress, and missed opportunities.

## Proposed Solution

LifeReplay AI turns a decision into structured future simulations. The app generates best-case, worst-case, and most-likely outcomes, future timelines, risk breakdowns, confidence scoring, decision comparisons, and action plans. When a Gemini API key is available, the backend uses Gemini. Without a key, the app still works with high-quality local mock intelligence.

## Features

- Modern SaaS landing page with hackathon-ready positioning
- AI-powered decision analyzer
- Future timeline for 6 months, 1 year, 3 years, and 5 years
- Option A vs Option B comparison
- Action plan generation
- Local backend history storage
- Dashboard with metrics, recent analyses, risk trends, and progress cards
- Gemini API integration with mock fallback
- Responsive React + Vite + Tailwind UI
- Express backend with API documentation

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Lucide React
- Backend: Node.js, Express, TypeScript
- AI: Gemini API via `@google/generative-ai`
- Storage: Lightweight JSON file storage for MVP history

## Architecture

```text
frontend React app
  -> API service
  -> backend Express routes
  -> AI service
  -> Gemini API or mock fallback
  -> JSON history store
```

See [docs/architecture.md](docs/architecture.md) for more detail.

## Installation

```bash
git clone https://github.com/VINAY-KUMAR-PY/lifereplay-ai.git
cd lifereplay-ai
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

`GEMINI_API_KEY` is optional for local demos. If it is missing, the backend logs a clear fallback message and serves polished mock AI responses.

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_URL=http://localhost:5000
```

## API Routes

- `POST /api/analyze` analyzes a life decision
- `POST /api/compare` compares two options
- `GET /api/history` returns previous analyses
- `GET /api/dashboard` returns dashboard metrics
- `GET /health` returns backend health status

See [docs/api-docs.md](docs/api-docs.md) for request and response examples.

## Run Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Deployment

Backend deployment options:

- Render, Railway, Fly.io, or any Node.js host
- Set `GEMINI_API_KEY`, `PORT`, and `FRONTEND_URL`
- Use `npm run build` and `npm start`

Frontend deployment options:

- Vercel, Netlify, or Cloudflare Pages
- Set `VITE_API_URL` to the deployed backend URL
- Use `npm run build`

## Future Scope

- User authentication and private decision workspaces
- PostgreSQL or MongoDB persistence
- PDF report export
- Saved scenarios and follow-up reminders
- AI mentor chat grounded in each simulation
- Mobile app for students and job seekers
- Vertical-specific modes for careers, education, finance, and startups

## Hackathon Relevance

LifeReplay AI scores strongly across the CodeQuest criteria:

- Innovation: future simulation rather than a generic chatbot
- Technical implementation: full-stack app, AI service layer, fallback intelligence, typed frontend
- Problem solving: addresses real uncertainty in high-impact life decisions
- User experience: fast, polished, responsive SaaS interface
- Scalability: documented path to multi-user SaaS and vertical expansion

## Team

- Team / Member Name: _Add your team details here_
- Institution: _Add institution name here_
- Contact: _Add email or portfolio link here_
