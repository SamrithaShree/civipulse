/**
 * Mock dataset — City Incidents
 * In production this would come from a database.
 */

const incidents = [
    {
        incidentId: 'INC-001',
        type: 'Flood',
        zone: 'Ward 3',
        severity: 9,
        affectedPopulation: 200,
        reportedTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 min ago
        status: 'open',
    },
    {
        incidentId: 'INC-002',
        type: 'Power Outage',
        zone: 'Ward 2',
        severity: 7,
        affectedPopulation: 150,
        reportedTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
        status: 'open',
    },
    {
        incidentId: 'INC-003',
        type: 'Pothole',
        zone: 'Ward 5',
        severity: 3,
        affectedPopulation: 20,
        reportedTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 min ago
        status: 'open',
    },
    {
        incidentId: 'INC-004',
        type: 'Fire Hazard',
        zone: 'Ward 1',
        severity: 8,
        affectedPopulation: 80,
        reportedTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
        status: 'open',
    },
    {
        incidentId: 'INC-005',
        type: 'Gas Leak',
        zone: 'Ward 4',
        severity: 10,
        affectedPopulation: 60,
        reportedTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min ago
        status: 'open',
    },
    {
        incidentId: 'INC-006',
        type: 'Road Blockage',
        zone: 'Ward 2',
        severity: 5,
        affectedPopulation: 300,
        reportedTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 60 min ago
        status: 'resolved',
    },
];

module.exports = incidents;
