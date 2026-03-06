import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

/** Fetch all raw incidents */
export async function getIncidents() {
    const res = await api.get('/incidents');
    return res.data;
}

/** Fetch incidents sorted by priority score */
export async function getPrioritizedIncidents() {
    const res = await api.get('/incidents/prioritized');
    return res.data;
}

/** Fetch all response resources */
export async function getResources() {
    const res = await api.get('/resources');
    return res.data;
}

/** Fetch response recommendations */
export async function getRecommendations() {
    const res = await api.get('/incidents/recommendations');
    return res.data;
}
