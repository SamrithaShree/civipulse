const { incidents, resources } = require('../data/store');
const { getPrioritizedIncidents } = require('../services/priorityEngine');
const { generateRecommendations } = require('../services/recommendationEngine');

/** GET /incidents */
function getAllIncidents(req, res) {
    res.json(incidents);
}

/** GET /incidents/prioritized */
function getPrioritized(req, res) {
    res.json(getPrioritizedIncidents(incidents));
}

/** GET /incidents/recommendations */
function getRecommendations(req, res) {
    res.json(generateRecommendations(incidents, resources));
}

module.exports = { getAllIncidents, getPrioritized, getRecommendations };
