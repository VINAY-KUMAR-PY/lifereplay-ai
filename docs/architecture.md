# LifeReplay AI Architecture

## Overview

LifeReplay AI is a full-stack decision simulation MVP. The frontend collects a decision or two comparison options, the backend validates the request, the AI layer generates structured output, and the storage layer keeps previous decision analyses for history and dashboard views.

## Frontend

The frontend is a React + Vite + TypeScript application styled with Tailwind CSS.

Key areas:

- `src/pages/LandingPage.tsx`: product introduction, problem, solution, and feature cards
- `src/pages/AnalyzePage.tsx`: decision input, loading state, validation, and analysis result rendering
- `src/pages/ComparePage.tsx`: side-by-side option comparison
- `src/pages/HistoryPage.tsx`: previous analyses with detail view
- `src/pages/DashboardPage.tsx`: aggregate metrics and recent analyses
- `src/components/ResultPanel.tsx`: reusable analysis visualization
- `src/services/api.ts`: frontend API client

The UI is intentionally built as a simulator, not a generic chatbot. Results are shown as structured cards, timelines, score rings, and action-plan sections.

## Backend

The backend is a Node.js + Express + TypeScript API.

Key areas:

- `src/server.ts`: routes, request validation, dashboard aggregation, and error handling
- `src/aiService.ts`: Gemini integration and fallback handling
- `src/mockAi.ts`: high-quality deterministic mock responses for demos without an API key
- `src/storage.ts`: lightweight JSON history persistence
- `src/types.ts`: shared backend data contracts

The backend exposes:

- `POST /api/analyze`
- `POST /api/compare`
- `GET /api/history`
- `GET /api/dashboard`
- `GET /health`

## AI Layer

The AI layer tries to use Gemini when `GEMINI_API_KEY` is available. The prompt asks Gemini to return strict JSON with predefined fields. The response is parsed and validated with Zod before returning to the frontend.

If Gemini is unavailable, the backend logs a clear message and returns polished mock responses. This keeps hackathon demos reliable even when credentials or network access are unavailable.

## Data Flow

```text
User enters decision
  -> React form validation
  -> POST /api/analyze
  -> Express request validation
  -> Gemini or mock AI response
  -> Zod output validation
  -> Save analysis in backend/data/history.json
  -> Return structured result
  -> Frontend renders scores, futures, risks, timeline, and action plan
```

For comparison:

```text
User enters Option A and Option B
  -> POST /api/compare
  -> Express validation
  -> Gemini or mock AI response
  -> Return pros, cons, risk comparison, and recommendation
```

For dashboard:

```text
GET /api/dashboard
  -> Read local history
  -> Calculate total decisions, average confidence, risk distribution
  -> Return metrics and recent analyses
```

## Scalability

The MVP uses JSON storage for speed and simplicity. For production, this should evolve into:

- Authenticated users with private decision workspaces
- PostgreSQL or MongoDB for analyses, comparisons, and user profiles
- Queue-based AI execution for heavy traffic
- Caching for repeated or similar prompts
- Observability for AI latency, cost, and failure rates
- Separate frontend and backend deployments with environment-specific configuration

