/**
 * In-Memory Store
 *
 * Central mutable data store — all services read/write here
 * instead of importing static arrays. This allows the simulation
 * engine to dynamically add incidents and mutate resource state
 * while every API call reflects the latest data.
 */

const incidents = [
    {
        incidentId: 'INC-001',
        type: 'Flood',
        zone: 'Ward 3',
        severity: 9,
        affectedPopulation: 200,
        reportedTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        status: 'open',
    },
    {
        incidentId: 'INC-002',
        type: 'Power Outage',
        zone: 'Ward 2',
        severity: 7,
        affectedPopulation: 150,
        reportedTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: 'open',
    },
    {
        incidentId: 'INC-003',
        type: 'Pothole',
        zone: 'Ward 5',
        severity: 3,
        affectedPopulation: 20,
        reportedTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        status: 'open',
    },
    {
        incidentId: 'INC-004',
        type: 'Fire Hazard',
        zone: 'Ward 1',
        severity: 8,
        affectedPopulation: 80,
        reportedTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'open',
    },
    {
        incidentId: 'INC-005',
        type: 'Gas Leak',
        zone: 'Ward 4',
        severity: 10,
        affectedPopulation: 60,
        reportedTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        status: 'open',
    },
    {
        incidentId: 'INC-006',
        type: 'Road Blockage',
        zone: 'Ward 2',
        severity: 5,
        affectedPopulation: 300,
        reportedTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'resolved',
    },
];

const resources = [
    {
        resourceId: 'RES-001',
        name: 'Rescue Team Alpha',
        type: 'Disaster',
        status: 'available',
        zone: 'Ward 3',
        capacity: 12,
        activeTasks: 0,
    },
    {
        resourceId: 'RES-002',
        name: 'Electric Crew Bravo',
        type: 'Utility',
        status: 'available',
        zone: 'Ward 2',
        capacity: 6,
        activeTasks: 0,
    },
    {
        resourceId: 'RES-003',
        name: 'Repair Crew Charlie',
        type: 'Infrastructure',
        status: 'busy',
        zone: 'Ward 5',
        capacity: 8,
        activeTasks: 2,
    },
    {
        resourceId: 'RES-004',
        name: 'Fire Brigade Delta',
        type: 'Fire',
        status: 'available',
        zone: 'Ward 1',
        capacity: 15,
        activeTasks: 0,
    },
    {
        resourceId: 'RES-005',
        name: 'Hazmat Unit Echo',
        type: 'Hazmat',
        status: 'available',
        zone: 'Ward 4',
        capacity: 8,
        activeTasks: 1,
    },
    {
        resourceId: 'RES-006',
        name: 'Traffic Control Foxtrot',
        type: 'Traffic',
        status: 'busy',
        zone: 'Ward 2',
        capacity: 5,
        activeTasks: 3,
    },
    {
        resourceId: 'RES-007',
        name: 'Medical Response Golf',
        type: 'Medical',
        status: 'available',
        zone: 'Ward 3',
        capacity: 10,
        activeTasks: 0,
    },
];

/** All zones in use across the system */
const ZONES = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];

module.exports = { incidents, resources, ZONES };
