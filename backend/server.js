const express = require('express');
const cors = require('cors');

const incidentRoutes = require('./routes/incidents');
const resourceRoutes = require('./routes/resources');
const simulateRoutes = require('./routes/simulate');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'CiviPulse API is running' });
});

app.use('/incidents', incidentRoutes);
app.use('/resources', resourceRoutes);
app.use('/simulate', simulateRoutes);

// Convenience aliases (spec-compliant)
app.get('/prioritized-incidents', (req, res) => res.redirect('/incidents/prioritized'));
app.get('/recommendations', (req, res) => res.redirect('/incidents/recommendations'));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
    console.log(`\nCiviPulse API → http://localhost:${PORT}`);
    console.log('  GET  /incidents');
    console.log('  GET  /incidents/prioritized');
    console.log('  GET  /resources');
    console.log('  GET  /incidents/recommendations');
    console.log('  POST /simulate/incident');
    console.log('  POST /simulate/resource-busy');
    console.log('  POST /simulate/resource-free');
    console.log('  POST /simulate/demo-scenario\n');
});
