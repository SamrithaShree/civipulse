import { useState, useEffect, useCallback, useRef } from 'react';
import PriorityPanel from '../components/PriorityPanel';
import RecommendationCard from '../components/RecommendationCard';
import DemoControls from '../components/DemoControls';
import { getPrioritizedIncidents, getResources, getRecommendations } from '../services/api';

const POLL_INTERVAL = 3000; // ms

/* ── Stat icons ─────────────────────────────────────────────── */
const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
const TeamIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);
const CriticalIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);
const ResolvedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function StatCard({ label, value, icon: Icon, accentColor }) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: `${accentColor}20` }}>
                <span style={{ color: accentColor }}><Icon /></span>
            </div>
            <div className="stat-label">{label}</div>
            <div className="stat-value" style={{ color: accentColor }}>{value}</div>
        </div>
    );
}

export default function DashboardPage() {
    const [prioritized, setPrioritized] = useState([]);
    const [resources, setResources] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(null);
    const pollRef = useRef(null);
    const recRef = useRef(null);   // recommendations panel — scroll target

    /** Load all data from the API */
    const fetchAll = useCallback(async () => {
        try {
            const [p, r, rec] = await Promise.all([
                getPrioritizedIncidents(),
                getResources(),
                getRecommendations(),
            ]);
            setPrioritized(p);
            setResources(r);
            setRecommendations(rec);
            setLastRefresh(new Date());
            setError(null);
        } catch {
            setError('Could not reach the CiviPulse API. Make sure the backend is running on port 3001.');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Called by DemoControls when a simulation action returns a state snapshot.
     * Avoids an extra network round-trip — the snapshot IS the fresh state.
     */
    const handleSimUpdate = useCallback((state) => {
        if (state.prioritizedIncidents) setPrioritized(state.prioritizedIncidents);
        if (state.resources) setResources(state.resources);
        if (state.recommendations) setRecommendations(state.recommendations);
        setLastRefresh(new Date());
        // Scroll the recommendations panel into view so judges see the result
        setTimeout(() => {
            recRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    }, []);

    /** Start polling */
    useEffect(() => {
        fetchAll();
        pollRef.current = setInterval(fetchAll, POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, [fetchAll]);

    if (loading) return (
        <div className="state-msg">
            <div className="spinner" />
            Loading dashboard data…
        </div>
    );
    if (error) return <div className="state-msg" style={{ color: '#f87171' }}>{error}</div>;

    const totalIncidents = prioritized.length;
    const availableTeams = resources.filter((r) => r.status === 'available').length;
    const criticalCount = prioritized.filter((i) => i.severity >= 9 && i.status !== 'resolved').length;
    const resolvedCount = prioritized.filter((i) => i.status === 'resolved').length;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                    <h1>Command Dashboard</h1>
                    <p>Real-time incident overview and response coordination support</p>
                </div>
                {lastRefresh && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Last updated: {lastRefresh.toLocaleTimeString()}
                    </span>
                )}
            </div>

            {/* Demo Controls Bar */}
            <DemoControls onUpdate={handleSimUpdate} />

            {/* Stat row */}
            <div className="stat-grid">
                <StatCard label="Total Incidents" value={totalIncidents} icon={AlertIcon} accentColor="#3b82f6" />
                <StatCard label="Available Teams" value={availableTeams} icon={TeamIcon} accentColor="#22c55e" />
                <StatCard label="Critical (Sev 9+)" value={criticalCount} icon={CriticalIcon} accentColor="#ef4444" />
                <StatCard label="Resolved" value={resolvedCount} icon={ResolvedIcon} accentColor="#94a3b8" />
            </div>

            {/* Two-column panels */}
            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header">
                        <h2>Priority Ranking</h2>
                        <span className="card-subtitle">Highest urgency first</span>
                    </div>
                    <div className="card-body">
                        <PriorityPanel incidents={prioritized} />
                    </div>
                </div>

                <div className="card" ref={recRef}>
                    <div className="card-header">
                        <h2>Response Recommendations</h2>
                        <span className="card-subtitle">Administrator review required</span>
                    </div>
                    <div className="card-body">
                        <RecommendationCard recommendations={recommendations} />
                    </div>
                </div>
            </div>
        </div>
    );
}
