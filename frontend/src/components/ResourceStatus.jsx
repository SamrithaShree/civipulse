import StatusBadge from './StatusBadge';

const LocationIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const typeColors = {
    Disaster: '#ef4444',
    Utility: '#3b82f6',
    Infrastructure: '#8b5cf6',
    Fire: '#f97316',
    Hazmat: '#eab308',
    Traffic: '#06b6d4',
    Medical: '#ec4899',
    General: '#94a3b8',
};

/**
 * ResourceStatus — grid of response team cards.
 */
export default function ResourceStatus({ resources }) {
    if (!resources || resources.length === 0) {
        return <div className="state-msg">No resources available.</div>;
    }

    return (
        <div className="resource-grid">
            {resources.map((r) => (
                <div className="resource-card" key={r.resourceId}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span
                            style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: typeColors[r.type] || '#94a3b8',
                                marginRight: 6,
                            }}
                        />
                        <span className="rc-type" style={{ flex: 1 }}>{r.type}</span>
                        <StatusBadge status={r.status} />
                    </div>

                    <div className="rc-name">{r.name}</div>

                    <div className="rc-zone">
                        <LocationIcon />
                        {r.zone}
                    </div>

                    <div className="rc-capacity">
                        Capacity: <strong style={{ color: 'var(--text-secondary)' }}>{r.capacity} personnel</strong>
                    </div>

                    <div style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: 'var(--text-muted)',
                        marginTop: 2,
                    }}>
                        {r.resourceId}
                    </div>
                </div>
            ))}
        </div>
    );
}
