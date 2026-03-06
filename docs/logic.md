# CiviPulse — Logic Documentation

## 1. Priority Engine

### Purpose
Rank all city incidents so administrators immediately know which ones demand attention first.

### Formula

```
priorityScore = (severity × 0.5) + (affectedPopulation × 0.3) + (waitTime × 0.2)
```

### Component Breakdown

| Component | Weight | Input | Notes |
|-----------|--------|-------|-------|
| Severity Score | **50%** | `severity` (1–10) | Field-reported immediate threat level |
| Population Score | **30%** | `affectedPopulation` (count) | Direct community impact |
| Wait Score | **20%** | minutes since `reportedTime` | Computed live at query time |

### Weight Rationale

- **Severity dominates (50%)** — a severity-10 gas leak must outrank a severity-3 pothole even if the pothole affects more people.
- **Population adds scale (30%)** — a moderate incident affecting 500 people deserves more attention than the same severity affecting 5.
- **Wait time prevents starvation (20%)** — low-priority incidents left unattended gain score over time, ensuring nothing is permanently deprioritised.

### Example Calculation

```
Flood – Ward 3 – sev 9 – pop 200 – reported 90 min ago

  severityComponent   = 9 × 0.5  = 4.5
  populationComponent = 200 × 0.3 = 60.0
  waitComponent       = 90 × 0.2  = 18.0

  priorityScore = 4.5 + 60.0 + 18.0 = 82.5
```

---

## 2. Recommendation Engine

### Purpose
Match each open incident to the most suitable available response team, with a transparent score and human-readable reasoning.

### Incident Type → Resource Type Mapping

| Incident Type | Required Resource Type |
|---------------|------------------------|
| Flood | Disaster |
| Fire Hazard / Fire | Fire |
| Power Outage | Utility |
| Gas Leak | Hazmat |
| Pothole / Road Damage | Infrastructure |
| Road Blockage / Traffic Accident | Traffic |

### Recommendation Score Formula

```
recommendationScore =
    availabilityScore
  + zoneScore
  + workloadScore
  + priorityWeight
```

#### Factor Details

**availabilityScore**
```
available → +50
busy      → −100
```
A busy team is heavily penalised because dispatching them risks degrading their active assignment.

**zoneScore**
```
same zone     → +30   (fastest response)
adjacent zone → +10   (minimal travel)
distant zone  →   0   (cross-city dispatch)
```
Zones are modelled as a ring: Ward 1 → Ward 2 → … → Ward 5 → Ward 1. "Adjacent" means ±1 step around the ring.

**workloadScore**
```
workloadScore = 10 − min(activeTasks, 10)
```
A team with 0 active tasks scores +10. Each active task reduces this by 1, down to 0 at 10 tasks.

**priorityWeight**
```
priorityWeight = incidentPriorityScore × 0.1
```
High-urgency incidents boost the scores of all candidates proportionally, ensuring the best resource is allocated to the worst incident.

### Example Calculation

```
Incident: Flood – Ward 3 – priorityScore 82.5
Candidate: Rescue Team Alpha – available – Ward 3 – activeTasks 0

  availabilityScore = +50     (available)
  zoneScore         = +30     (same zone: Ward 3)
  workloadScore     = +10     (10 − 0 active tasks)
  priorityWeight    = +8.25   (82.5 × 0.1)

  recommendationScore = 50 + 30 + 10 + 8.25 = 98.25
  confidence: High (score ≥ 70)
```

### Confidence Levels

| Level | Threshold | Meaning |
|-------|-----------|---------|
| **High** | score ≥ 70 | Strong match — same zone, available, low workload |
| **Medium** | 30 ≤ score < 70 | Acceptable match — cross-zone or some workload |
| **Low** | score < 30 | Weak match — busy resource or no compatible team found |

---

## 3. Simulation Engine

### Purpose
Generate realistic dynamic events during a live demo so judges see the system behaving like a real smart-city platform.

### Incident Templates

| Type | Severity Range | Population Range |
|------|---------------|-----------------|
| Flood | 7–10 | 100–500 |
| Fire Hazard | 6–10 | 30–200 |
| Power Outage | 5–8 | 80–400 |
| Traffic Accident | 4–8 | 10–100 |
| Gas Leak | 7–10 | 20–150 |
| Road Blockage | 3–6 | 50–300 |
| Pothole | 2–4 | 5–30 |

### Functions

| Function | Effect |
|----------|--------|
| `simulateIncident()` | Picks random template + zone, pushes to `store.incidents[]` |
| `simulateResourceBusy()` | Marks a resource busy, increments `activeTasks` |
| `simulateResourceAvailable()` | Decrements `activeTasks`, restores available status |
| `simulateDemoScenario()` | Chains `simulateIncident` + randomly calls `simulateResourceBusy` |

### Resource Workload Lifecycle

```
dispatch     activeTasks++     → if activeTasks ≥ capacity → status = 'busy'
free         activeTasks--     → if activeTasks = 0          → status = 'available'
```

---

## 4. Auto-Refresh Behaviour

All three frontend pages poll the backend every **3 seconds** using `setInterval`. This keeps displayed data current without requiring a page reload.

When a demo button is clicked in `DemoControls`, the simulation POST response already includes a full state snapshot (`prioritizedIncidents`, `resources`, `recommendations`). The frontend applies this snapshot immediately — before the next poll fires — so the UI update feels instantaneous.

After a simulation action the dashboard also smooth-scrolls to the **Response Recommendations** panel, directing judge attention to the decision output.
