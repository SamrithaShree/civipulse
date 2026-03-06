# CiviPulse — System Architecture

## High-Level Diagram

```
Administrator Browser
        │
        ▼
React Frontend (port 5173)
        │  axios HTTP   (3-second polling on all pages)
        ▼
Express Backend (port 3001)
  ├── GET  /incidents                → incidentController.getAllIncidents
  ├── GET  /incidents/prioritized    → priorityEngine → sorted list
  ├── GET  /resources                → resourceController.getAllResources
  ├── GET  /incidents/recommendations→ recommendationEngine → scored matches
  ├── POST /simulate/incident        → simulationEngine.simulateIncident
  ├── POST /simulate/resource-busy   → simulationEngine.simulateResourceBusy
  ├── POST /simulate/resource-free   → simulationEngine.simulateResourceAvailable
  └── POST /simulate/demo-scenario   → simulationEngine.simulateDemoScenario
              │
              ▼
    data/store.js  (shared mutable in-memory arrays)
      ├── incidents[]   — live incident records
      └── resources[]   — live resource records with activeTasks
```

---

## Module Responsibilities

### Backend

| Module | File | Responsibility |
|--------|------|---------------|
| Shared Store | `data/store.js` | Single source of truth; mutable arrays shared by reference across all modules |
| Priority Engine | `services/priorityEngine.js` | Calculates `priorityScore`, sorts incidents descending |
| Recommendation Engine | `services/recommendationEngine.js` | Multi-factor scoring, selects best resource per incident, builds reason bullets |
| Simulation Engine | `services/simulationEngine.js` | Generates realistic random incidents; mutates resource states for demo |
| Incident Controller | `controllers/incidentController.js` | Routes → service calls → HTTP response |
| Resource Controller | `controllers/resourceController.js` | Returns full resource list |
| Simulation Controller | `controllers/simulationController.js` | Runs sim actions, returns full state snapshot |
| Routes | `routes/*.js` | Express router definitions |
| Server | `server.js` | App bootstrap, CORS, route registration |

### Frontend

| Module | File | Responsibility |
|--------|------|---------------|
| API Client | `services/api.js` | All axios calls in one place |
| Sidebar | `components/Sidebar.jsx` | Navigation with inline SVG icons + active highlighting |
| IncidentTable | `components/IncidentTable.jsx` | Sortable table with optional priority score column |
| PriorityPanel | `components/PriorityPanel.jsx` | Ranked cards with colour-scaled score bars |
| ResourceStatus | `components/ResourceStatus.jsx` | Team grid with type colour dots + status badges |
| RecommendationCard | `components/RecommendationCard.jsx` | Score + reason bullets + alternatives |
| DemoControls | `components/DemoControls.jsx` | Simulation button bar; applies state snapshots instantly |
| StatusBadge | `components/StatusBadge.jsx` | Reusable coloured pill (available/busy/open/resolved) |
| DashboardPage | `pages/DashboardPage.jsx` | Overview: stat cards + priority + recommendations + polling |
| IncidentsPage | `pages/IncidentsPage.jsx` | Full incident table + polling |
| ResourcesPage | `pages/ResourcesPage.jsx` | Full resource grid + polling |

---

## Data Flow

### Normal read flow
```
Browser polls every 3s
  → GET /incidents/prioritized
  → incidentController.getPrioritized()
  → priorityEngine.getPrioritizedIncidents(store.incidents)
      calculates waitTime = (now - reportedTime) / 60000
      score = (sev × 0.5) + (pop × 0.3) + (wait × 0.2)
      sort descending
  → JSON response to browser
```

### Simulation flow
```
Admin clicks "Generate Incident"
  → POST /simulate/incident
  → simulationEngine.simulateIncident()
      picks random template (type, severity range, population range)
      pushes to store.incidents[]
  → simulationController builds state snapshot
      { prioritizedIncidents, resources, recommendations }
  → JSON response to browser
  → DemoControls calls onUpdate(state)  ← no extra round-trip
  → React state updates → UI re-renders
  → DashboardPage scrolls to Recommendations panel
```

---

## Key Design Decisions

1. **Shared mutable store** — instead of re-importing static files, all services hold a reference to the same `incidents[]` and `resources[]` arrays. Mutations are immediately visible to all consumers.

2. **Snapshot pattern** — simulation POST responses include the full updated state, so the frontend doesn't need a second GET request after each action. This makes demo interactions feel instant.

3. **Real-time `waitTime`** — computed at query time, never stored. A low-severity backlog incident naturally rises in ranking as it ages, preventing starvation.

4. **Zone ring model** — zones are treated as a circular sequence. Adjacent-zone resources score +10 (not 0), making the proximity logic more nuanced than a simple same/different binary.

5. **No auto-dispatch** — all `POST /simulate/*` routes perform data mutations but never "send" anything. The recommendation is advisory; the administrator decides.

6. **Stateless backend** — the server holds state only in `store.js`. A future migration to a database just replaces the two arrays with DB queries in each service — no architectural changes needed.
