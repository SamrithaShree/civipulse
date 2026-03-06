import { NavLink } from 'react-router-dom';

/* ── Inline SVG icons ───────────────────────────────────────── */
const DashboardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const IncidentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const ResourceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const PulseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

export default function Sidebar() {
    return (
        <nav className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-mark">
                    <span style={{ color: '#3b82f6', width: 26, height: 26, display: 'flex' }}>
                        <PulseIcon />
                    </span>
                    <div>
                        <div className="logo-name">CiviPulse</div>
                        <div className="logo-sub">Smart City Admin</div>
                    </div>
                </div>
            </div>

            <span className="nav-section-label">Navigation</span>

            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <DashboardIcon />
                Dashboard
            </NavLink>

            <NavLink to="/incidents" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <IncidentIcon />
                Incidents
            </NavLink>

            <NavLink to="/resources" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <ResourceIcon />
                Resources
            </NavLink>
        </nav>
    );
}
