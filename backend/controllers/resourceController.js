const resources = require('../data/resources');

/** GET /resources — return all response resources */
function getAllResources(req, res) {
    res.json(resources);
}

module.exports = { getAllResources };
