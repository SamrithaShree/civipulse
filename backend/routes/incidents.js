const express = require('express');
const router = express.Router();
const {
    getAllIncidents,
    getPrioritized,
    getRecommendations,
} = require('../controllers/incidentController');

router.get('/', getAllIncidents);
router.get('/prioritized', getPrioritized);
router.get('/recommendations', getRecommendations);

module.exports = router;
