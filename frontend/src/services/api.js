import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export const getIncidents = () => api.get('/incidents').then((r) => r.data);
export const getPrioritizedIncidents = () => api.get('/incidents/prioritized').then((r) => r.data);
export const getResources = () => api.get('/resources').then((r) => r.data);
export const getRecommendations = () => api.get('/incidents/recommendations').then((r) => r.data);

// ── Simulation endpoints ─────────────────────────────────────
export const simulateIncident = (body = {}) => api.post('/simulate/incident', body).then((r) => r.data);
export const simulateResourceBusy = (body = {}) => api.post('/simulate/resource-busy', body).then((r) => r.data);
export const simulateResourceFree = (body = {}) => api.post('/simulate/resource-free', body).then((r) => r.data);
export const simulateDemoScenario = () => api.post('/simulate/demo-scenario').then((r) => r.data);
