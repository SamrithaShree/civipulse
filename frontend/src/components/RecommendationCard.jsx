/**
 * RecommendationCard (v2)
 *
 * Shows the recommended team, a numeric recommendation score,
 * and human-readable reason bullets for each incident.
 * Also displays up to 2 alternative candidates if available.
 */

const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const NoTeamIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

const CheckIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function ScorePip({ score }) {
    const color =
        score >= 70 ? '#22c55e' :
            score >= 30 ? '#eab308' : '#ef4444';
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.75rem',
            fontWeight: 700,
            color,
            background: `${color}18`,
            borderRadius: 6,
            padding: '2px 8px',
        }}>
            Score: {score}
        </span>
    );
}

export default function RecommendationCard({ recommendations }) {
    if (!recommendations || recommendations.length === 0) {
        return <div className="state-msg">No recommendations available.</div>;
    }

    return (
        <div className="rec-list">
            {recommendations.map((rec) => (
                <div className="rec-card" key={rec.incidentId}>

                    {/* Header row */}
                    <div className="rec-header">
                        <span className="rec-incident">{rec.incidentType}</span>
                        <span className={`confidence-badge conf-${rec.confidence.toLowerCase()}`}>
                            {rec.confidence}
                        </span>
                    </div>

                    <div className="rec-zone">
                        {rec.zone} · Severity {rec.severity}/10
                        {rec.priorityScore != null && (
                            <span style={{ marginLeft: 6, color: 'var(--text-muted)' }}>
                                · Priority {rec.priorityScore}
                            </span>
                        )}
                    </div>

                    {/* Recommended team */}
                    {rec.recommendedResource ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                                <span style={{ color: 'var(--text-muted)', display: 'flex' }}><ArrowIcon /></span>
                                <span className="rec-team">{rec.recommendedResource.name}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    ({rec.recommendedResource.zone})
                                </span>
                                {rec.recommendationScore != null && <ScorePip score={rec.recommendationScore} />}
                            </div>

                            {/* Reason bullets */}
                            {rec.reasons && rec.reasons.length > 0 && (
                                <ul style={{
                                    margin: '0.4rem 0 0',
                                    paddingLeft: 0,
                                    listStyle: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem',
                                }}>
                                    {rec.reasons.map((r, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span style={{ color: '#22c55e', marginTop: 1, flexShrink: 0 }}><CheckIcon /></span>
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Alternatives */}
                            {rec.allCandidates && rec.allCandidates.length > 1 && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Alternatives: </span>
                                    {rec.allCandidates.slice(1).map((c, i) => (
                                        <span key={i}>
                                            {c.name} ({c.zone}, score {c.score}){i < rec.allCandidates.slice(1).length - 1 ? ' · ' : ''}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span style={{ color: '#f87171', display: 'flex' }}><NoTeamIcon /></span>
                            <span style={{ fontSize: '0.8rem', color: '#f87171' }}>No compatible team available</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
