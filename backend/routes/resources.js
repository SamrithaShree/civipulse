const express = require('express');
const router = express.Router();
const { getAllResources } = require('../controllers/resourceController');

router.get('/', getAllResources);

module.exports = router;
