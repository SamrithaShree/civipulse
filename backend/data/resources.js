/**
 * Mock dataset — Response Resources / Teams
 * In production this would be tracked in a real-time database.
 */

const resources = [
    {
        resourceId: 'RES-001',
        name: 'Rescue Team Alpha',
        type: 'Disaster',
        status: 'available',
        zone: 'Ward 3',
        capacity: 12,
    },
    {
        resourceId: 'RES-002',
        name: 'Electric Crew Bravo',
        type: 'Utility',
        status: 'available',
        zone: 'Ward 2',
        capacity: 6,
    },
    {
        resourceId: 'RES-003',
        name: 'Repair Crew Charlie',
        type: 'Infrastructure',
        status: 'busy',
        zone: 'Ward 5',
        capacity: 8,
    },
    {
        resourceId: 'RES-004',
        name: 'Fire Brigade Delta',
        type: 'Fire',
        status: 'available',
        zone: 'Ward 1',
        capacity: 15,
    },
    {
        resourceId: 'RES-005',
        name: 'Hazmat Unit Echo',
        type: 'Hazmat',
        status: 'available',
        zone: 'Ward 4',
        capacity: 8,
    },
    {
        resourceId: 'RES-006',
        name: 'Traffic Control Foxtrot',
        type: 'Traffic',
        status: 'busy',
        zone: 'Ward 2',
        capacity: 5,
    },
    {
        resourceId: 'RES-007',
        name: 'Medical Response Golf',
        type: 'Medical',
        status: 'available',
        zone: 'Ward 3',
        capacity: 10,
    },
];

module.exports = resources;
