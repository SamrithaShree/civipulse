const incidents = require('../data/incidents');
const { getPrioritizedIncidents } = require('../services/priorityEngine');
const { generateRecommendations } = require('../services/recommendationEngine');
const resources = require('../data/resources');

/** GET /incidents — return all raw incidents */
function getAllIncidents(req, res) {
    res.json(incidents);
}

/** GET /prioritized-incidents — return incidents sorted by priority score */
function getPrioritized(req, res) {
    const prioritized = getPrioritizedIncidents(incidents);
    res.json(prioritized);
}

/** GET /recommendations — return response recommendations for open incidents */
function getRecommendations(req, res) {
    const recommendations = generateRecommendations(incidents, resources);
    res.json(recommendations);
}

module.exports = { getAllIncidents, getPrioritized, getRecommendations };
