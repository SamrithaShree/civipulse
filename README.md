<div align="center">

# ⚡ CiviPulse

### Smart City Incident Prioritization & Response Coordination Platform

*A decision-support system that helps city administrators prioritize incidents and coordinate limited response resources — without automating human decisions.*

</div>

---

## Problem Statement

City administrators face dozens of simultaneous incidents across different zones with limited response teams. Manual triage is slow, inconsistent, and doesn't scale. CiviPulse provides intelligent, explainable recommendations so administrators can act fast and allocate the right resources to the right incidents.

---

## Solution Overview

CiviPulse is a full-stack MVP dashboard that:

1. **Ingests incidents** across city zones (live simulation during demo)
2. **Calculates a priority score** for every incident using a weighted formula
3. **Tracks response teams** and their availability / workload
4. **Recommends the best team** for each incident using a multi-factor scoring engine
5. **Keeps humans in the loop** — all recommendations require administrator approval before any action is taken

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Administrator Browser                │
│         React + Vite Frontend  (port 5173)          │
│   ┌──────────┐  ┌─────────────┐  ┌──────────────┐  │
│   │Dashboard │  │  Incidents  │  │  Resources   │  │
│   └────┬─────┘  └──────┬──────┘  └───────┬──────┘  │
│        └───────────────┴─────────────────┘          │
│                   Axios HTTP (3s poll)               │
└──────────────────────────┬──────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────┐
│            Express REST API  (port 3001)             │
│  /incidents        → incidentController              │
│  /incidents/prioritized → priorityEngine service     │
│  /incidents/recommendations → recommendationEngine   │
│  /resources        → resourceController              │
│  /simulate/*       → simulationController            │
└──────────────────────────┬──────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────┐
│           In-Memory Store  (data/store.js)           │
│       incidents[]                resources[]         │
└─────────────────────────────────────────────────────┘
```

### Folder Structure

```
civipulse/
├── backend/
│   ├── data/
│   │   ├── store.js             # Shared mutable in-memory store
│   │   ├── incidents.js         # (legacy static — superseded by store)
│   │   └── resources.js         # (legacy static — superseded by store)
│   ├── services/
│   │   ├── priorityEngine.js    # Weighted priority score formula
│   │   ├── recommendationEngine.js  # Multi-factor recommendation scoring
│   │   └── simulationEngine.js  # Dynamic demo simulation
│   ├── controllers/
│   │   ├── incidentController.js
│   │   ├── resourceController.js
│   │   └── simulationController.js
│   ├── routes/
│   │   ├── incidents.js
│   │   ├── resources.js
│   │   └── simulate.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── IncidentTable.jsx
│       │   ├── PriorityPanel.jsx
│       │   ├── ResourceStatus.jsx
│       │   ├── RecommendationCard.jsx
│       │   └── DemoControls.jsx
│       ├── pages/
│       │   ├── DashboardPage.jsx
│       │   ├── IncidentsPage.jsx
│       │   └── ResourcesPage.jsx
│       └── services/
│           └── api.js
└── docs/
    ├── README.md         ← this file
    ├── architecture.md
    └── logic.md
```

---

## Priority Algorithm

Every incident receives a **priority score** calculated in real time:

```
priorityScore = (severity × 0.5) + (affectedPopulation × 0.3) + (waitTime × 0.2)
```

| Factor | Weight | Unit | Rationale |
|--------|--------|------|-----------|
| `severity` | **0.5** | 1–10 scale | Immediate threat level dominates |
| `affectedPopulation` | **0.3** | person count | Scale of community impact |
| `waitTime` | **0.2** | minutes since report | Prevents low-priority incidents being permanently ignored |

Incidents are sorted descending by priority score. `waitTime` recalculates on every request so the ranking is always current.

---

## Recommendation Engine

For every open incident the engine evaluates **all resources** and picks the highest scorer:

```
recommendationScore =
    availabilityScore   (+50 available / −100 busy)
  + zoneScore           (+30 same zone / +10 adjacent zone / 0 far)
  + workloadScore       +(10 − activeTasks)
  + priorityWeight      +(incidentPriorityScore × 0.1)
```

The UI shows:
- ✅ Recommended team name
- ✅ Numeric recommendation score (e.g. `98.27`)
- ✅ Confidence level (`High / Medium / Low`)
- ✅ Human-readable reason bullets
- ✅ Up to 2 alternative candidates

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/incidents` | All raw incidents |
| `GET` | `/incidents/prioritized` | Scored + sorted incident list |
| `GET` | `/resources` | All response teams |
| `GET` | `/incidents/recommendations` | Smart recommendations |
| `POST` | `/simulate/incident` | Generate a random incident |
| `POST` | `/simulate/resource-busy` | Mark a resource as busy |
| `POST` | `/simulate/resource-free` | Free a busy resource |
| `POST` | `/simulate/demo-scenario` | Run a full chained demo event |

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm

### 1 — Backend

```bash
cd backend
npm install
node server.js
# API running at http://localhost:3001
```

### 2 — Frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Demo Script (for judges)

1. Open the **Dashboard** tab
2. Click **Generate Incident** → a new incident appears, priority ranking reshuffles, and the recommendation panel scrolls into view showing which team was selected and why
3. Click **Resource → Busy** → the previously assigned team drops out; the engine auto-selects the next-best alternative
4. Click **Run Demo Scenario** → a complete chained event (new incident + resource state change) in one click
5. Navigate to **Incidents** page to see all incidents (including simulated ones marked `SIM-XXX`) sorted by live priority score
6. Navigate to **Resources** page to see live team availability

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router 7 |
| Backend | Node.js, Express 4, CORS |
| HTTP client | Axios |
| Storage | In-memory JSON (no DB dependency for MVP) |

---

## Design Principles

- **Decision support, not automation** — humans make the final call
- **Clean modular architecture** — logic lives in services, controllers are thin wrappers
- **Real-time scoring** — `waitTime` computed at query time; no stale data
- **Transparent AI** — confidence levels + reason bullets explain every recommendation
- **Demo-friendly** — simulation layer makes the system dynamic without needing a real IoT feed
