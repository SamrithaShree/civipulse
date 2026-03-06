# Priority Engine — Logic Documentation

## Overview

The Priority Engine ranks city incidents by calculated urgency score so administrators can allocate response resources to the most critical incidents first.

---

## Formula

```
priorityScore = (severity × 0.5) + (affectedPopulation × 0.3) + (waitTime × 0.2)
```

### Components

| Input               | Weight | Unit      | Description                            |
|---------------------|--------|-----------|----------------------------------------|
| `severity`          | 0.5    | 1–10 scale| Threat level as reported by field teams|
| `affectedPopulation`| 0.3    | count     | Citizens directly impacted             |
| `waitTime`          | 0.2    | minutes   | Time elapsed since incident was reported|

### Design Rationale

- **Severity dominates (50%)**: An immediate safety threat (gas leak, flood) must outrank low-severity inconveniences even with large affected counts.
- **Population adds scale (30%)**: A moderate incident affecting 500 people may deserve more attention than a high-severity issue affecting 5.
- **Wait time prevents starvation (20%)**: Low-priority incidents that are ignored will naturally rise in the ranking as time passes, ensuring nothing is permanently neglected.

---

## Recommendation Engine

### Type Mapping

| Incident Type  | Required Resource Type |
|----------------|------------------------|
| Flood          | Disaster               |
| Power Outage   | Utility                |
| Pothole        | Infrastructure         |
| Road Blockage  | Traffic                |
| Fire Hazard    | Fire                   |
| Gas Leak       | Hazmat                 |

### Selection Logic

1. Filter resources by matching `type` AND `status === 'available'`
2. If a match exists in the **same zone** → assign (Confidence: High)
3. Otherwise pick the **first available** matching team → assign (Confidence: Medium)
4. If no match → flag as unresolvable (Confidence: Low)

### Confidence Levels

| Level  | Meaning                                               |
|--------|-------------------------------------------------------|
| High   | Same-zone team matched — fastest possible deployment  |
| Medium | Cross-zone team matched — some travel time expected   |
| Low    | No suitable available team — manual allocation needed |
