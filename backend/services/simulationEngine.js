/**
 * Simulation Engine
 *
 * Generates realistic demo incidents and mutates resource states
 * in the shared in-memory store. Designed for live hackathon demos.
 */

const { incidents, resources, ZONES } = require('../data/store');

let incidentCounter = 100; // offset from base INC-001…006

const INCIDENT_TEMPLATES = [
    { type: 'Flood', severityRange: [7, 10], populationRange: [100, 500] },
    { type: 'Fire Hazard', severityRange: [6, 10], populationRange: [30, 200] },
    { type: 'Power Outage', severityRange: [5, 8], populationRange: [80, 400] },
    { type: 'Traffic Accident', severityRange: [4, 8], populationRange: [10, 100] },
    { type: 'Gas Leak', severityRange: [7, 10], populationRange: [20, 150] },
    { type: 'Road Blockage', severityRange: [3, 6], populationRange: [50, 300] },
    { type: 'Pothole', severityRange: [2, 4], populationRange: [5, 30] },
];

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate and add a random incident to the in-memory store.
 * @returns {Object} the new incident
 */
function simulateIncident(options = {}) {
    const template = options.type
        ? INCIDENT_TEMPLATES.find((t) => t.type === options.type) || randFrom(INCIDENT_TEMPLATES)
        : randFrom(INCIDENT_TEMPLATES);

    incidentCounter += 1;
    const newIncident = {
        incidentId: `SIM-${String(incidentCounter).padStart(3, '0')}`,
        type: template.type,
        zone: options.zone || randFrom(ZONES),
        severity: options.severity || randInt(...template.severityRange),
        affectedPopulation: options.affectedPopulation || randInt(...template.populationRange),
        reportedTime: new Date().toISOString(),
        status: 'open',
        simulated: true,
    };

    incidents.push(newIncident);
    return newIncident;
}

/**
 * Mark a random available resource as busy (increases activeTasks).
 * @returns {Object|null} the affected resource, or null if none available
 */
function simulateResourceBusy(resourceId) {
    let target = resourceId
        ? resources.find((r) => r.resourceId === resourceId)
        : resources.filter((r) => r.status === 'available')[0];

    if (!target) return null;
    target.activeTasks = (target.activeTasks || 0) + 1;
    target.status = 'busy';
    return target;
}

/**
 * Mark a random busy resource as available (decreases activeTasks).
 * @returns {Object|null} the affected resource, or null if none busy
 */
function simulateResourceAvailable(resourceId) {
    let target = resourceId
        ? resources.find((r) => r.resourceId === resourceId)
        : resources.filter((r) => r.status === 'busy')[0];

    if (!target) return null;
    target.activeTasks = Math.max(0, (target.activeTasks || 1) - 1);
    if (target.activeTasks === 0) target.status = 'available';
    return target;
}

/**
 * Run a full demo scenario in sequence:
 *  1. Generate one random incident
 *  2. (Optionally) mark a resource busy to show fallback logic
 * Returns a summary of everything that happened.
 */
function simulateDemoScenario() {
    const newIncident = simulateIncident();

    // Randomly decide to make an available resource busy to demo fallback
    const shouldBust = Math.random() > 0.5;
    let affectedResource = null;
    if (shouldBust) {
        const available = resources.filter((r) => r.status === 'available');
        if (available.length > 1) {
            affectedResource = simulateResourceBusy(randFrom(available).resourceId);
        }
    }

    return {
        scenario: 'Demo scenario executed',
        newIncident,
        resourceUpdate: affectedResource
            ? { action: 'marked-busy', resource: affectedResource }
            : { action: 'none' },
    };
}

module.exports = {
    simulateIncident,
    simulateResourceBusy,
    simulateResourceAvailable,
    simulateDemoScenario,
};
