# LifeReplay AI

**Career Decision Intelligence Platform**

Replay your future before making life-changing career decisions.

LifeReplay AI is not a chatbot. It is a Future Outcome Simulator, Career Decision Scorecard, Recruiter Readiness Analyzer, and consulting-style Decision Report Generator for students, freshers, career switchers, and young professionals.

## Team

- **Team member:** Aeddula Vinay Kumar
- **Institution:** Vignan Institute of Technology & Science
- **Project:** LifeReplay AI
- **Repository:** https://github.com/VINAY-KUMAR-PY/lifereplay-ai
- **Competition:** Bharat Academix CodeQuest 2026

## Problem Statement

High-stakes career decisions are often made from fragmented advice, social pressure, trend-driven content, and incomplete job-market data. Young people need a way to test assumptions, compare opportunity costs, and plan measurable next steps before committing time and money.

## Solution

LifeReplay AI combines Google Gemini with strict structured-output validation and an offline deterministic fallback. It simulates best, worst, and most-likely futures; compares alternatives; generates career roadmaps; tracks decision analytics; and creates shareable, exportable reports.

## Features

- Streaming Decision Analyzer with live simulation status
- CareerReplay for preset or custom career paths
- Multi-scenario Future Outcome Simulation with salary, success probability, opportunity cost, SWOT, and risk matrices
- Recruiter View with shortlist readiness, evidence gaps, interview weaknesses, and 3/6/12-month hiring probabilities
- Nine-metric Decision Scorecards across CareerReplay and simulated futures
- Exactly five evidence-based reasons behind major recommendations
- Resume context from `.txt` and `.pdf` files using on-demand PDF.js
- Option comparison with persisted dashboard history
- Shareable decision links at `/decision/:id`
- Confidence, opportunity, and risk analytics with interactive charts
- Searchable and filterable decision history
- Visual PDF reports with score bars, timelines, risks, and action plans
- Animated product preview on the landing page
- Gemini JSON mode with Zod validation and reliable mock fallback
- Docker Compose deployment configuration

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Lucide React |
| Visualization | Typed responsive SVG charts with hover values |
| PDF | jsPDF; PDF.js loaded on demand for resume extraction |
| Backend | Node.js, Express, TypeScript, Zod |
| AI | Google Gemini structured JSON output with deterministic fallback |
| Persistence | Local JSON files for MVP analyses and comparisons |
| Operations | Docker, Docker Compose, Nginx |

## Architecture

```text
React + Vite UI
  -> Express API (CORS, validation, rate limiting)
      -> Gemini JSON mode -> Zod validation
      -> deterministic mock fallback
      -> analysis/comparison JSON persistence
```

## Setup

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/VINAY-KUMAR-PY/lifereplay-ai.git
cd lifereplay-ai
npm install
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Environment Variables

Create `backend/.env` locally. It is intentionally ignored by Git.

```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Without `GEMINI_API_KEY`, the platform uses topic-aware deterministic mock intelligence.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health |
| POST | `/api/analyze` | Analyze and save a decision |
| POST | `/api/analyze/stream` | Stream analysis status and result using SSE |
| GET | `/api/analyze/:id` | Retrieve a shareable decision |
| POST | `/api/compare` | Compare and save two options |
| POST | `/api/career-replay` | Compare up to six preset/custom careers |
| POST | `/api/future-simulation` | Compare two to four quantified future scenarios |
| POST | `/api/recruiter-view` | Assess role-specific recruiter readiness |
| GET | `/api/history` | List saved analyses |
| GET | `/api/dashboard` | Aggregate analysis and comparison metrics |

Detailed contracts are in [docs/api-docs.md](docs/api-docs.md).

## Security

- CORS accepts the configured `FRONTEND_URL` instead of reflecting arbitrary origins.
- AI endpoints are limited to 30 requests per IP per 15-minute window.
- Zod validates request payloads and AI responses.
- Request bodies are size-limited.
- Secrets, generated output, runtime history, and comparison data are Git-ignored.

## Running with Docker

```bash
docker compose up --build
```

The frontend is served by Nginx on port `5173`; the backend runs on port `5000`; runtime data is mounted from `backend/data`.

## CareerReplay

CareerReplay scores fit, job readiness, growth, salary potential, learning curve, time investment, and risk. It produces skill roadmaps and 30/90/180-day plans for six presets or any custom path such as Civil Services or UX Designer. Resume text can personalize the analysis.

## Future Outcome Simulation

Future Simulation compares two to four scenarios in one intelligence view. Each future includes 1-year and 3-year salary ranges, success probability, hiring difficulty, time and financial impact, opportunity cost, career impact, a nine-metric scorecard, SWOT analysis, and a five-part risk matrix.

## Recruiter View

Recruiter View evaluates a profile against a target role as a recruiter would. It measures readiness, missing skills and projects, resume gaps, interview weaknesses, and hiring probability over 3, 6, and 12 months, then produces a shortlist-focused improvement plan.

## Decision Scorecard, SWOT, and Risk Matrix

The scorecard converts qualitative advice into comparable 0-100 metrics for market demand, learning curve, risk resilience, salary potential, competition, stability, growth, job readiness, and overall strength. SWOT exposes strategic trade-offs, while the risk matrix combines probability, impact, and a concrete mitigation across career, financial, learning, market, and personal risk.

## Scalability

The API/UI split supports independent deployment. Docker Compose provides a concrete container baseline. Production evolution can replace local JSON with PostgreSQL, add authentication and tenant ownership, queue long AI requests, cache repeat simulations, and route tasks across models.

## Hackathon Relevance

The product addresses a broad, urgent student problem with explainable AI, practical action plans, offline demo reliability, responsive UX, and an architecture that can grow into an institution-facing decision platform.

## Future Scope

- Per-analysis feedback loop with thumbs up/down
- LLM routing: fast comparison model and deeper CareerReplay model
- Institution dashboards for colleges and placement teams
- WhatsApp and email sharing of decision reports
- Authenticated private workspaces and mentor collaboration
- Live labor-market and salary datasets
