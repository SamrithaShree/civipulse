import { useState } from 'react';
import {
    simulateIncident,
    simulateDemoScenario,
    simulateResourceBusy,
    simulateResourceFree,
} from '../services/api';

/* ── Icons ────────────────────────────────────────────────── */
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const BusyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);
const FreeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

function DemoButton({ onClick, icon: Icon, label, color, loading, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: 8,
                border: `1px solid ${color}40`,
                background: `${color}15`,
                color: loading ? 'var(--text-muted)' : color,
                fontSize: '0.82rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: loading || disabled ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s, transform 0.1s',
                opacity: loading || disabled ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!loading && !disabled) e.currentTarget.style.background = `${color}28`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${color}15`; }}
        >
            <Icon />
            {loading ? 'Working…' : label}
        </button>
    );
}

/**
 * DemoControls — floating demo control bar.
 * Calls simulation endpoints and calls onUpdate(state) so the
 * parent page can refresh its data from the response snapshot.
 */
export default function DemoControls({ onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [lastEvent, setLastEvent] = useState(null);

    async function run(apiFn, label) {
        setLoading(true);
        setLastEvent(null);
        try {
            const result = await apiFn();
            if (result.state) onUpdate(result.state);
            const msg = result.incident
                ? `${result.incident.type} · ${result.incident.zone} · Sev ${result.incident.severity}`
                : result.resource
                    ? `${result.resource.name} → ${result.resource.status}`
                    : result.newIncident
                        ? `${result.newIncident.type} · ${result.newIncident.zone} (+ resource update)`
                        : label;
            setLastEvent(msg);
        } catch {
            setLastEvent('Error — is the backend running?');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-muted)',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
        }}>
            {/* Label */}
            <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: 'var(--text-muted)',
                marginRight: '0.25rem',
            }}>
                Demo Controls
            </span>

            <DemoButton
                icon={PlusIcon}
                label="Generate Incident"
                color="#3b82f6"
                loading={loading}
                onClick={() => run(simulateIncident, 'Incident generated')}
            />
            <DemoButton
                icon={BusyIcon}
                label="Resource → Busy"
                color="#f97316"
                loading={loading}
                onClick={() => run(simulateResourceBusy, 'Resource set busy')}
            />
            <DemoButton
                icon={FreeIcon}
                label="Resource → Free"
                color="#22c55e"
                loading={loading}
                onClick={() => run(simulateResourceFree, 'Resource freed')}
            />
            <DemoButton
                icon={PlayIcon}
                label="Run Demo Scenario"
                color="#818cf8"
                loading={loading}
                onClick={() => run(simulateDemoScenario, 'Demo scenario')}
            />

            {/* Last event toast */}
            {lastEvent && (
                <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    color: 'var(--accent-light)',
                    background: 'var(--accent-dim)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 6,
                    fontStyle: 'italic',
                    maxWidth: 260,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    ⚡ {lastEvent}
                </span>
            )}
        </div>
    );
}
