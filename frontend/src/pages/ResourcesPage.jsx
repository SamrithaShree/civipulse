import { useState, useEffect, useRef } from 'react';
import ResourceStatus from '../components/ResourceStatus';
import { getResources } from '../services/api';

const POLL_INTERVAL = 3000;

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pollRef = useRef(null);

    function fetchData() {
        return getResources()
            .then(setResources)
            .catch(() => setError('Failed to load resources. Is the backend running?'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchData();
        pollRef.current = setInterval(fetchData, POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, []);

    if (loading) return <div className="state-msg"><div className="spinner" />Loading resources…</div>;
    if (error) return <div className="state-msg" style={{ color: '#f87171' }}>{error}</div>;

    const available = resources.filter((r) => r.status === 'available').length;
    const busy = resources.filter((r) => r.status === 'busy').length;

    return (
        <div>
            <div className="page-header">
                <h1>Response Resources</h1>
                <p>{available} available · {busy} busy · {resources.length} total teams · auto-refreshing every 3s</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Team Registry</h2>
                    <span className="card-subtitle">All registered response units</span>
                </div>
                <div className="card-body">
                    <ResourceStatus resources={resources} />
                </div>
            </div>
        </div>
    );
}
