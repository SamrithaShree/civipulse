# CiviPulse — System Architecture

## High-Level Overview

```
Administrator Browser
        │
        ▼
  React Frontend (port 5173)
        │  axios HTTP requests
        ▼
  Express Backend (port 3001)
     ├── /incidents         → incidentController
     ├── /incidents/prioritized → priorityEngine service
     ├── /resources         → resourceController
     └── /incidents/recommendations → recommendationEngine service
              │
              ▼
      In-Memory JSON Data
        ├── incidents.js
        └── resources.js
```

## Module Responsibilities

| Module                    | Responsibility                                     |
|---------------------------|----------------------------------------------------|
| `data/incidents.js`       | Source of truth for all incident records           |
| `data/resources.js`       | Source of truth for all response team records      |
| `services/priorityEngine` | Calculates priority scores, sorts incident list    |
| `services/recommendationEngine` | Matches incidents to best available teams  |
| `controllers/*Controller` | Bridges service calls to HTTP response layer       |
| `routes/*.js`             | Express route definitions                          |
| `server.js`               | App bootstrap, middleware, route registration      |

## Frontend Structure

| File                           | Role                                               |
|--------------------------------|----------------------------------------------------|
| `services/api.js`              | All API calls in one place (axios)                 |
| `components/Sidebar.jsx`        | Dashboard navigation                               |
| `components/IncidentTable.jsx`  | Renders incident list with optional score column   |
| `components/PriorityPanel.jsx`  | Ranked cards with coloured score bars              |
| `components/ResourceStatus.jsx` | Team grid with availability badges                 |
| `components/RecommendationCard`| Incident → team mappings with confidence scores    |
| `pages/DashboardPage.jsx`      | Overview: stats + priority + recommendations       |
| `pages/IncidentsPage.jsx`      | Full table with priority scores                    |
| `pages/ResourcesPage.jsx`      | Full resource grid                                 |

## Key Design Decisions

1. **Separation of concerns**: Logic lives entirely in `services/`, controllers are thin wrappers.
2. **No auto-dispatch**: The system surfaces recommendations; humans make decisions.
3. **In-memory data**: No DB dependency for MVP — replace `data/*.js` with DB calls to scale.
4. **Real-time scoring**: `waitTime` is computed at query time so scores improve dynamically.
5. **Confidence levels**: Transparency about recommendation quality helps administrators calibrate trust.
