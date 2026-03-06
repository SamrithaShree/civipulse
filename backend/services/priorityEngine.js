/**
 * Priority Engine
 *
 * Calculates a priority score for each incident and returns
 * incidents sorted by descending priority.
 *
 * Formula:
 *   priorityScore = (severity * 0.5) + (affectedPopulation * 0.3) + (waitTime * 0.2)
 *
 * waitTime is measured in minutes from reportedTime to now.
 */

/**
 * Calculate priority score for a single incident.
 * @param {Object} incident
 * @returns {number} priority score (rounded to 2 decimal places)
 */
function calculatePriorityScore(incident) {
    const now = Date.now();
    const reported = new Date(incident.reportedTime).getTime();
    const waitTimeMinutes = (now - reported) / (1000 * 60);

    const severityComponent = incident.severity * 0.5;
    const populationComponent = incident.affectedPopulation * 0.3;
    const waitComponent = waitTimeMinutes * 0.2;

    const score = severityComponent + populationComponent + waitComponent;
    return Math.round(score * 100) / 100;
}

/**
 * Return all incidents enriched with their priority scores,
 * sorted from highest to lowest priority.
 * @param {Object[]} incidents
 * @returns {Object[]} sorted, scored incidents
 */
function getPrioritizedIncidents(incidents) {
    const scored = incidents.map((incident) => ({
        ...incident,
        priorityScore: calculatePriorityScore(incident),
    }));

    return scored.sort((a, b) => b.priorityScore - a.priorityScore);
}

module.exports = { calculatePriorityScore, getPrioritizedIncidents };
