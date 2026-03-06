# CiviPulse

**Smart City Incident Prioritization & Response Coordination Platform**

---

## Problem Statement

City administrators manage dozens of simultaneous incidents across different zones with limited response resources. Manual prioritization is slow, error-prone, and doesn't scale.

## Solution

CiviPulse is a decision-support dashboard that:

1. **Tracks incidents** across city zones with real-time priority scoring
2. **Ranks them automatically** using a weighted urgency formula
3. **Identifies available response teams** from a resource registry
4. **Recommends the best team** for each incident based on type and zone matching
5. **Keeps humans in control** — all recommendations require administrator review before action

---

## Architecture

```
civipulse/
├── backend/           Node.js + Express REST API
│   ├── data/          Static mock datasets (incidents, resources)
│   ├── services/      Business logic (priorityEngine, recommendationEngine)
│   ├── controllers/   HTTP handler functions
│   ├── routes/        Express route definitions
│   └── server.js      App entry point
└── frontend/          React + Vite + Tailwind dashboard
    └── src/
        ├── components/ Reusable UI components
        ├── pages/      Full page views
        └── services/   Axios API client
```

---

## Priority Algorithm

```
priorityScore = (severity × 0.5) + (affectedPopulation × 0.3) + (waitTime × 0.2)
```

| Weight | Factor             | Rationale                          |
|--------|--------------------|------------------------------------|
| 0.5    | Severity (1–10)    | Immediate threat level             |
| 0.3    | Affected population| Scale of community impact          |
| 0.2    | Wait time (minutes)| Time sensitivity — prevents neglect|

---

## API Endpoints

| Method | Route                        | Description                         |
|--------|------------------------------|-------------------------------------|
| GET    | `/incidents`                 | All raw incidents                   |
| GET    | `/incidents/prioritized`     | Incidents sorted by priority score  |
| GET    | `/resources`                 | All response teams                  |
| GET    | `/incidents/recommendations` | Recommended team for each incident  |

---

## Running Locally

### 1. Backend

```bash
cd backend
npm install
node server.js
# API: http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4, React Router 7, Axios
- **Backend**: Node.js, Express 4, CORS
- **Storage**: In-memory JSON (mock data)
