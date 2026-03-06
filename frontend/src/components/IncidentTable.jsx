import StatusBadge from './StatusBadge';

/** Colour class for severity number */
function severityClass(sev) {
    if (sev >= 9) return 'sev-critical';
    if (sev >= 7) return 'sev-high';
    if (sev >= 5) return 'sev-medium';
    return 'sev-low';
}

/** Colour hex for priority score bar */
function scoreColor(score) {
    if (score >= 100) return '#ef4444';
    if (score >= 60) return '#f97316';
    if (score >= 30) return '#eab308';
    return '#22c55e';
}

/** Human-readable wait time */
function formatWait(reportedTime) {
    const mins = Math.round((Date.now() - new Date(reportedTime).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m ago` : `${hrs}h ago`;
}

/**
 * IncidentTable — renders a list of incidents (enriched with priorityScore if present).
 */
export default function IncidentTable({ incidents, showScore = false }) {
    if (!incidents || incidents.length === 0) {
        return <div className="state-msg">No incidents to display.</div>;
    }

    // Determine max score for proportional bar widths
    const maxScore = showScore
        ? Math.max(...incidents.map((i) => i.priorityScore || 0))
        : 100;

    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Zone</th>
                        <th>Severity</th>
                        <th>Population</th>
                        <th>Reported</th>
                        <th>Status</th>
                        {showScore && <th>Priority Score</th>}
                    </tr>
                </thead>
                <tbody>
                    {incidents.map((inc) => (
                        <tr key={inc.incidentId}>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {inc.incidentId}
                            </td>
                            <td><span className="incident-type">{inc.type}</span></td>
                            <td>{inc.zone}</td>
                            <td>
                                <span className={`${severityClass(inc.severity)}`} style={{ fontWeight: 700 }}>
                                    {inc.severity}/10
                                </span>
                            </td>
                            <td>{inc.affectedPopulation.toLocaleString()}</td>
                            <td style={{ fontSize: '0.78rem' }}>{formatWait(inc.reportedTime)}</td>
                            <td><StatusBadge status={inc.status} /></td>
                            {showScore && (
                                <td>
                                    <div className="score-bar-wrap">
                                        <div className="score-bar-bg">
                                            <div
                                                className="score-bar-fill"
                                                style={{
                                                    width: `${Math.min(100, (inc.priorityScore / maxScore) * 100)}%`,
                                                    background: scoreColor(inc.priorityScore),
                                                }}
                                            />
                                        </div>
                                        <span className="score-val">{inc.priorityScore}</span>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
