import { useState, useEffect, useRef } from 'react';
import IncidentTable from '../components/IncidentTable';
import { getPrioritizedIncidents } from '../services/api';

const POLL_INTERVAL = 3000;

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pollRef = useRef(null);

    function fetchData() {
        return getPrioritizedIncidents()
            .then(setIncidents)
            .catch(() => setError('Failed to load incidents. Is the backend running?'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchData();
        pollRef.current = setInterval(fetchData, POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, []);

    if (loading) return <div className="state-msg"><div className="spinner" />Loading incidents…</div>;
    if (error) return <div className="state-msg" style={{ color: '#f87171' }}>{error}</div>;

    const open = incidents.filter((i) => i.status !== 'resolved').length;
    const resolved = incidents.filter((i) => i.status === 'resolved').length;
    const simCount = incidents.filter((i) => i.simulated).length;

    return (
        <div>
            <div className="page-header">
                <h1>All Incidents</h1>
                <p>
                    {open} open · {resolved} resolved
                    {simCount > 0 && ` · ${simCount} simulated`}
                    {' '}· auto-refreshing every 3s · sorted by priority score
                </p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Incident Registry</h2>
                    <span className="card-subtitle">Priority score = (Sev × 0.5) + (Pop × 0.3) + (Wait × 0.2)</span>
                </div>
                <IncidentTable incidents={incidents} showScore />
            </div>
        </div>
    );
}
