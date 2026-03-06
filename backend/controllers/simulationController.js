const {
    simulateIncident,
    simulateResourceBusy,
    simulateResourceAvailable,
    simulateDemoScenario,
} = require('../services/simulationEngine');

const { incidents, resources } = require('../data/store');
const { getPrioritizedIncidents } = require('../services/priorityEngine');
const { generateRecommendations } = require('../services/recommendationEngine');

/** Helper — build a full state snapshot to return after any simulation action */
function stateSnapshot() {
    return {
        prioritizedIncidents: getPrioritizedIncidents(incidents),
        resources: resources,
        recommendations: generateRecommendations(incidents, resources),
    };
}

/** POST /simulate/incident */
function handleSimulateIncident(req, res) {
    const newIncident = simulateIncident(req.body || {});
    res.status(201).json({
        action: 'incident-generated',
        incident: newIncident,
        state: stateSnapshot(),
    });
}

/** POST /simulate/resource-busy */
function handleResourceBusy(req, res) {
    const { resourceId } = req.body || {};
    const updated = simulateResourceBusy(resourceId);
    if (!updated) return res.status(404).json({ error: 'No available resource found to set as busy.' });
    res.json({
        action: 'resource-marked-busy',
        resource: updated,
        state: stateSnapshot(),
    });
}

/** POST /simulate/resource-free */
function handleResourceFree(req, res) {
    const { resourceId } = req.body || {};
    const updated = simulateResourceAvailable(resourceId);
    if (!updated) return res.status(404).json({ error: 'No busy resource found to free.' });
    res.json({
        action: 'resource-freed',
        resource: updated,
        state: stateSnapshot(),
    });
}

/** POST /simulate/demo-scenario */
function handleDemoScenario(req, res) {
    const result = simulateDemoScenario();
    res.status(201).json({
        ...result,
        state: stateSnapshot(),
    });
}

module.exports = {
    handleSimulateIncident,
    handleResourceBusy,
    handleResourceFree,
    handleDemoScenario,
};
