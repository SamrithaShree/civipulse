/** Colour for score bar based on value */
function scoreColor(score) {
    if (score >= 100) return '#ef4444';
    if (score >= 60) return '#f97316';
    if (score >= 30) return '#eab308';
    return '#22c55e';
}

/**
 * PriorityPanel — ranked list of incidents by priority score.
 */
export default function PriorityPanel({ incidents }) {
    if (!incidents || incidents.length === 0) {
        return <div className="state-msg">No priority data available.</div>;
    }

    const maxScore = Math.max(...incidents.map((i) => i.priorityScore || 0));

    return (
        <div className="priority-list">
            {incidents.slice(0, 6).map((inc, idx) => (
                <div className="priority-item" key={inc.incidentId}>
                    <div className="priority-rank">#{idx + 1}</div>

                    <div className="priority-info">
                        <div className="p-type">{inc.type}</div>
                        <div className="p-meta">{inc.zone} · Sev {inc.severity}/10 · {inc.affectedPopulation} affected</div>

                        <div className="score-bar-wrap" style={{ marginTop: '0.5rem' }}>
                            <div className="score-bar-bg">
                                <div
                                    className="score-bar-fill"
                                    style={{
                                        width: `${Math.min(100, (inc.priorityScore / maxScore) * 100)}%`,
                                        background: scoreColor(inc.priorityScore),
                                    }}
                                />
                            </div>
                            <span className="score-val" style={{ color: scoreColor(inc.priorityScore) }}>
                                {inc.priorityScore}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
