/**
 * Recommendation Engine
 *
 * Matches each incident to the most suitable available response team.
 *
 * Logic:
 *  1. Map incident type → required resource type
 *  2. Filter available resources of that type
 *  3. Prefer a resource in the same zone
 *  4. Fall back to any available resource of the required type
 *  5. If none match, return a "no team available" notice
 */

/** Maps incident types to required resource types */
const TYPE_MAP = {
    Flood: 'Disaster',
    'Power Outage': 'Utility',
    Pothole: 'Infrastructure',
    'Road Blockage': 'Traffic',
    'Fire Hazard': 'Fire',
    'Gas Leak': 'Hazmat',
};

/** Human-readable match reason */
function buildMatchReason(resource, sameZone) {
    if (sameZone) {
        return `Same-zone deployment — ${resource.name} is already in ${resource.zone}`;
    }
    return `Closest available team — ${resource.name} dispatched from ${resource.zone}`;
}

/**
 * Generate recommendations for a list of incidents.
 * @param {Object[]} incidents
 * @param {Object[]} resources
 * @returns {Object[]} recommendations
 */
function generateRecommendations(incidents, resources) {
    return incidents
        .filter((inc) => inc.status !== 'resolved')
        .map((incident) => {
            const requiredType = TYPE_MAP[incident.type] || 'General';

            const availableOfType = resources.filter(
                (r) => r.type === requiredType && r.status === 'available'
            );

            const sameZone = availableOfType.find((r) => r.zone === incident.zone);
            const recommended = sameZone || availableOfType[0] || null;

            return {
                incidentId: incident.incidentId,
                incidentType: incident.type,
                zone: incident.zone,
                severity: incident.severity,
                recommendedResource: recommended
                    ? {
                        resourceId: recommended.resourceId,
                        name: recommended.name,
                        type: recommended.type,
                        zone: recommended.zone,
                    }
                    : null,
                matchReason: recommended
                    ? buildMatchReason(recommended, !!sameZone)
                    : 'No available team of the required type. Manual allocation required.',
                confidence: recommended ? (sameZone ? 'High' : 'Medium') : 'Low',
            };
        });
}

module.exports = { generateRecommendations };
