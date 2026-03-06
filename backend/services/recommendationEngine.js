/**
 * Recommendation Engine (v2)
 *
 * Uses a multi-factor Recommendation Score instead of simple type mapping.
 *
 * Score formula:
 *   recommendationScore =
 *     availabilityScore   (+50 available, -100 busy)
 *   + zoneScore           (+30 same zone, +10 adjacent zone, 0 far)
 *   + workloadScore       +(10 - activeTasks)
 *   + priorityWeight      +(incident.priorityScore * 0.1)
 *
 * Final selection: highest-scoring compatible resource wins.
 */

const { getPrioritizedIncidents } = require('./priorityEngine');

/** Maps incident types → required resource types */
const TYPE_MAP = {
    'Flood': 'Disaster',
    'Fire Hazard': 'Fire',
    'Power Outage': 'Utility',
    'Gas Leak': 'Hazmat',
    'Pothole': 'Infrastructure',
    'Road Blockage': 'Traffic',
    'Traffic Accident': 'Traffic',
    'Road Damage': 'Infrastructure',
    'Fire': 'Fire',
};

/**
 * Zones are treated as a ring: Ward 1 → Ward 2 → … → Ward 5 → Ward 1
 * Adjacent zones score +10, same zone scores +30.
 */
function zoneScore(resourceZone, incidentZone) {
    const ORDER = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
    const rIdx = ORDER.indexOf(resourceZone);
    const iIdx = ORDER.indexOf(incidentZone);
    if (rIdx === -1 || iIdx === -1) return 0;
    if (rIdx === iIdx) return 30;
    const diff = Math.abs(rIdx - iIdx);
    const ringDiff = Math.min(diff, ORDER.length - diff);
    return ringDiff === 1 ? 10 : 0;
}

/**
 * Build human-readable reason bullets for a recommendation.
 */
function buildReasons(resource, zSc, incident) {
    const reasons = [];

    if (resource.status === 'available') reasons.push('Currently available for deployment');
    if (zSc === 30) reasons.push(`Same-zone unit — already in ${resource.zone}`);
    else if (zSc === 10) reasons.push(`Adjacent zone — minimal travel time from ${resource.zone}`);
    else reasons.push(`Cross-zone dispatch from ${resource.zone}`);

    const tasks = resource.activeTasks || 0;
    if (tasks === 0) reasons.push('No active tasks — full capacity available');
    else if (tasks <= 2) reasons.push(`Low workload (${tasks} active task${tasks > 1 ? 's' : ''})`);
    else reasons.push(`High workload (${tasks} active tasks) — may be stretched`);

    if (incident.priorityScore && incident.priorityScore >= 80) {
        reasons.push('High-priority incident — matched with top-tier resource');
    }

    return reasons;
}

/**
 * Score a single resource against a single incident.
 * Returns null if resource type does not match incident type.
 */
function scoreResource(resource, incident, priorityScore) {
    const requiredType = TYPE_MAP[incident.type];
    if (!requiredType || resource.type !== requiredType) return null;

    const availabilityScore = resource.status === 'available' ? 50 : -100;
    const zSc = zoneScore(resource.zone, incident.zone);
    const workloadScore = 10 - Math.min(10, resource.activeTasks || 0);
    const priorityWeight = (priorityScore || 0) * 0.1;

    const total = availabilityScore + zSc + workloadScore + priorityWeight;
    return { resource, score: Math.round(total * 100) / 100, zSc };
}

/**
 * Generate recommendations for all open incidents.
 * @param {Object[]} incidents
 * @param {Object[]} resources
 * @returns {Object[]}
 */
function generateRecommendations(incidents, resources) {
    // Score incidents so we can pass priorityWeight
    const scored = getPrioritizedIncidents(incidents);
    const scoreMap = Object.fromEntries(scored.map((i) => [i.incidentId, i.priorityScore]));

    return incidents
        .filter((inc) => inc.status !== 'resolved')
        .map((incident) => {
            const pScore = scoreMap[incident.incidentId] || 0;

            // Score every compatible resource
            const candidates = resources
                .map((r) => scoreResource(r, incident, pScore))
                .filter(Boolean)
                .sort((a, b) => b.score - a.score);

            const best = candidates[0] || null;

            let confidence = 'Low';
            if (best) {
                if (best.score >= 70) confidence = 'High';
                else if (best.score >= 30) confidence = 'Medium';
            }

            return {
                incidentId: incident.incidentId,
                incidentType: incident.type,
                zone: incident.zone,
                severity: incident.severity,
                priorityScore: pScore,
                recommendedResource: best
                    ? {
                        resourceId: best.resource.resourceId,
                        name: best.resource.name,
                        type: best.resource.type,
                        zone: best.resource.zone,
                    }
                    : null,
                recommendationScore: best ? best.score : null,
                reasons: best ? buildReasons(best.resource, best.zSc, { ...incident, priorityScore: pScore }) : [],
                matchReason: best
                    ? `${best.resource.name} (score: ${best.score})`
                    : 'No compatible team available — manual allocation required.',
                confidence,
                allCandidates: candidates.slice(0, 3).map((c) => ({
                    name: c.resource.name,
                    score: c.score,
                    zone: c.resource.zone,
                })),
            };
        });
}

/**
 * Increment activeTasks for a resource when it is recommended and accepted.
 */
function assignResource(resources, resourceId) {
    const r = resources.find((r) => r.resourceId === resourceId);
    if (r) {
        r.activeTasks = (r.activeTasks || 0) + 1;
        if (r.activeTasks >= r.capacity) r.status = 'busy';
    }
}

module.exports = { generateRecommendations, assignResource, TYPE_MAP };
