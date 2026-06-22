# LifeReplay AI API Documentation

Base URL for local development:

```text
http://localhost:5000
```

## Health Check

### `GET /health`

Returns backend health status.

Response:

```json
{
  "status": "ok",
  "app": "LifeReplay AI",
  "timestamp": "2026-06-20T00:00:00.000Z"
}
```

## Analyze Decision

### `POST /api/analyze/stream`

Accepts the same body as `/api/analyze` and returns Server-Sent Events. `status` events report progress, `result` contains the saved `AnalysisResult`, `done` closes the stream, and `error` contains a safe message.

```text
event: status
data: {"message":"Simulating best-case future..."}

event: result
data: {"id":"analysis_id", ...}
```

### `GET /api/analyze/:id`

Returns one saved analysis for a shareable decision route. Responds with `404` and `{ "message": "Decision not found." }` when the ID does not exist.

### `POST /api/analyze`

Analyzes a decision and stores it in history.

Request body:

```json
{
  "decision": "Should I choose Data Science or Software Engineering?"
}
```

Response body:

```json
{
  "id": "analysis_id",
  "decision": "Should I choose Data Science or Software Engineering?",
  "createdAt": "2026-06-20T00:00:00.000Z",
  "bestCaseFuture": "string",
  "worstCaseFuture": "string",
  "mostLikelyFuture": "string",
  "confidenceScore": 84,
  "confidenceExplanation": "string",
  "careerRisks": ["string"],
  "financialRisks": ["string"],
  "personalRisks": ["string"],
  "opportunityScore": 90,
  "recommendedNextSteps": ["string"],
  "timeline": [
    {
      "period": "6 months",
      "outlook": "string",
      "milestone": "string",
      "riskLevel": "Medium"
    }
  ],
  "actionPlan": {
    "immediate": ["string"],
    "thirtyDay": ["string"],
    "ninetyDay": ["string"],
    "longTerm": ["string"]
  },
  "summary": "string",
  "dominantRiskCategory": "Career"
}
```

Validation:

- `decision` is required
- Minimum length: 8 characters
- Maximum length: 500 characters

## Compare Options

### `POST /api/compare`

Compares Option A and Option B.

Request body:

```json
{
  "optionA": "Data Science",
  "optionB": "Software Engineering"
}
```

Response body:

```json
{
  "id": "comparison_id",
  "optionA": "Data Science",
  "optionB": "Software Engineering",
  "createdAt": "2026-06-20T00:00:00.000Z",
  "prosA": ["string"],
  "consA": ["string"],
  "prosB": ["string"],
  "consB": ["string"],
  "finalRecommendation": "string",
  "riskComparison": "string",
  "betterOption": "Data Science",
  "explanation": "string"
}
```

Validation:

- `optionA` and `optionB` are required
- Minimum length: 2 characters
- Maximum length: 240 characters each

## Future Outcome Simulation

### `POST /api/future-simulation`

```json
{ "scenarios": ["AI Engineer", "Government Exams", "Higher Studies"], "profile": "Final-year CSE student with Python projects" }
```

Returns quantified scenario outcomes, scorecards, SWOT analyses, five-item risk matrices, the best scenario, and exactly five recommendation reasons.

## Recruiter View

### `POST /api/recruiter-view`

```json
{ "targetRole": "AI Engineer", "profile": "CSE graduate with Python, React, two projects, and no internships" }
```

Returns readiness score, missing skills/projects, resume gaps, interview weaknesses, 3/6/12-month hiring probabilities, recruiter verdict, and improvement plan.

## History

### `GET /api/history`

Returns previous decision analyses, newest first.

Response body:

```json
[
  {
    "id": "analysis_id",
    "decision": "Should I choose Data Science or Software Engineering?",
    "createdAt": "2026-06-20T00:00:00.000Z",
    "confidenceScore": 84,
    "summary": "string",
    "dominantRiskCategory": "Career"
  }
]
```

The actual response includes the full analysis object for each history item.

## Dashboard

### `GET /api/dashboard`

Returns aggregate metrics for previous analyses.

Response body:

```json
{
  "totalDecisions": 3,
  "totalComparisons": 2,
  "averageConfidenceScore": 81,
  "mostCommonRiskCategory": "Career",
  "recentAnalyses": [],
  "recentComparisons": [],
  "riskDistribution": {
    "Career": 2,
    "Financial": 1
  }
}
```

## Error Format

Validation errors:

```json
{
  "message": "Validation failed",
  "issues": ["Decision must be at least 8 characters."]
}
```

Unexpected errors:

```json
{
  "message": "Something went wrong. Please try again."
}
```
