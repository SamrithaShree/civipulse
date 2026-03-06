const express = require('express');
const router = express.Router();
const {
    handleSimulateIncident,
    handleResourceBusy,
    handleResourceFree,
    handleDemoScenario,
} = require('../controllers/simulationController');

router.post('/incident', handleSimulateIncident);
router.post('/resource-busy', handleResourceBusy);
router.post('/resource-free', handleResourceFree);
router.post('/demo-scenario', handleDemoScenario);

module.exports = router;
