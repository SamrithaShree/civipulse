const { resources } = require('../data/store');

/** GET /resources */
function getAllResources(req, res) {
    res.json(resources);
}

module.exports = { getAllResources };
