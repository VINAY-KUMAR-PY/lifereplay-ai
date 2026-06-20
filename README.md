# LifeReplay AI

LifeReplay AI - Career Decision Intelligence Platform for Bharat Academix CodeQuest.

**Tagline:** Replay your future before making life-changing career decisions.

## Team

| Item | Details |
| --- | --- |
| Team / Member Name | Aeddula Vinay Kumar |
| Institution | Vignan Institute of Technology & Science |
| Project | LifeReplay AI |
| Repository | https://github.com/VINAY-KUMAR-PY/lifereplay-ai |

## Problem Statement

Students, freshers, career switchers, and young professionals often make career-defining decisions with incomplete signals. A student may need to choose between AI Engineer, Data Scientist, Software Engineer, Government Exams, Startup Founder, or Higher Studies, but the comparison usually happens through scattered advice, social media opinions, peer pressure, and family expectations.

The result is avoidable confusion: unclear skill roadmaps, underestimated risk, poor timeline planning, and no structured way to compare future outcomes before committing time, money, and effort.

## Proposed Solution

LifeReplay AI turns career uncertainty into structured decision intelligence. Users can analyze a decision, compare two options, replay multiple career paths, view saved history, inspect decision analytics, and export a PDF report for review.

The platform uses Gemini when a backend API key is configured. If Gemini is unavailable, the product remains fully demo-ready with high-quality mock intelligence, preserving all core workflows.

## Key Features

- Premium SaaS-style responsive interface
- AI Decision Analyzer for best-case, worst-case, and most-likely futures
- CareerReplay Mode for comparing:
  - AI Engineer
  - Data Scientist
  - Software Engineer
  - Government Exams
  - Startup Founder
  - Higher Studies
- Career fit score, growth potential, job readiness score, salary potential, learning curve, risk level, time investment, skill roadmap, and 30/90/180-day plans
- Option comparison with pros, cons, risk comparison, and final recommendation
- Executive dashboard with total decisions, average confidence, average opportunity score, most common risk, recent decisions, risk distribution, confidence trend, and opportunity trend
- PDF export for decision reports
- Local backend history storage for MVP continuity
- Gemini API integration with polished fallback responses
- CORS-enabled Express API

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, React Router |
| UI | Lucide React icons, responsive cards, gradients, score visuals |
| Backend | Node.js, Express, TypeScript |
| AI | Google Gemini via `@google/generative-ai` |
| PDF | `jspdf` |
| Storage | Local JSON history file for MVP |

## Architecture

```text
React + Vite frontend
  -> API service layer
  -> Express TypeScript backend
  -> AI service
  -> Gemini API or mock fallback
  -> Local JSON history store
```

Core backend modules:

- `backend/src/server.ts` - API routes, CORS, validation, environment loading
- `backend/src/aiService.ts` - Gemini prompts, schemas, fallback routing
- `backend/src/mockAi.ts` - offline-safe mock intelligence
- `backend/src/storage.ts` - local decision history persistence
- `backend/src/types.ts` - shared backend contracts

Core frontend modules:

- `frontend/src/pages/AnalyzePage.tsx`
- `frontend/src/pages/CareerReplayPage.tsx`
- `frontend/src/pages/ComparePage.tsx`
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/HistoryPage.tsx`
- `frontend/src/components/ResultPanel.tsx`
- `frontend/src/utils/pdf.ts`

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Backend health check |
| `POST` | `/api/analyze` | Analyze a decision and save it to history |
| `POST` | `/api/compare` | Compare two options |
| `POST` | `/api/career-replay` | Generate career path intelligence |
| `GET` | `/api/history` | Return saved analyses |
| `GET` | `/api/dashboard` | Return dashboard metrics |

## CareerReplay Explanation

CareerReplay is the platform's career-path intelligence mode. It compares supported career routes against a user's background and returns:

- Career Fit Score
- Growth Potential
- Risk Level
- Time Investment
- Salary Potential
- Skill Roadmap
- Learning Curve
- 30 Day Plan
- 90 Day Plan
- 180 Day Plan
- Final Recommendation

The mode uses Gemini when `GEMINI_API_KEY` is available. If Gemini is not configured, the backend returns polished mock guidance so hackathon demos stay reliable.

## Setup Instructions

Install root tooling:

```bash
npm install
```

Install backend dependencies:

```bash
npm install --prefix backend
```

Install frontend dependencies:

```bash
npm install --prefix frontend
```

Build the complete project:

```bash
npm run build
```

Run backend and frontend together:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_URL=http://localhost:5000
```

`GEMINI_API_KEY` is optional for local demos. Without it, the backend uses mock intelligence so Analyze, Compare, CareerReplay, Dashboard, and History remain usable.

## Hackathon Relevance

LifeReplay AI fits Bharat Academix CodeQuest because it solves a real student and fresher problem: career confusion. The product is not just a chatbot; it is a structured decision platform with scoring, timelines, risk categories, career roadmaps, analytics, and downloadable reports.

It demonstrates:

- Full-stack engineering
- AI integration with fallback reliability
- Practical student-focused problem solving
- Polished product thinking
- Scalable architecture for future SaaS expansion

## Future Scope

- User accounts and private decision workspaces
- Cloud database storage with PostgreSQL or MongoDB
- Saved CareerReplay sessions
- College-specific career guidance templates
- Resume and portfolio scoring
- Mentor review workflows
- Follow-up reminders for 30/90/180-day plans
- Role-specific interview readiness tests
- Admin analytics for institutions

## Scalability Explanation

The MVP uses local JSON storage for speed and hackathon simplicity. The architecture can scale by replacing `storage.ts` with a database repository layer, adding authentication, and storing each analysis under a user account. Gemini calls are already isolated in `aiService.ts`, so model providers can be swapped or upgraded without changing UI routes. The frontend page structure supports new vertical modes such as education, finance, entrepreneurship, and interview readiness.

## Safety Notes

The repository should not commit:

- `.env` files
- `node_modules`
- `backend/data/history.json`
- `dist` or `build` folders
- cache or temporary files

These are already ignored through `.gitignore`.
