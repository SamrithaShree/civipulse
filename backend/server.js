const express = require('express');
const cors = require('cors');

const incidentRoutes = require('./routes/incidents');
const resourceRoutes = require('./routes/resources');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'CiviPulse API is running' });
});

// Routes
app.use('/incidents', incidentRoutes);
app.use('/resources', resourceRoutes);

// Convenience aliases matching the spec
app.get('/prioritized-incidents', (req, res) => {
    res.redirect('/incidents/prioritized');
});

app.get('/recommendations', (req, res) => {
    res.redirect('/incidents/recommendations');
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`\nCiviPulse API running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log(`  GET /incidents`);
    console.log(`  GET /incidents/prioritized`);
    console.log(`  GET /resources`);
    console.log(`  GET /incidents/recommendations`);
    console.log(`  GET /prioritized-incidents (alias)`);
    console.log(`  GET /recommendations (alias)\n`);
});
