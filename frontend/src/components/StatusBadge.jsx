/**
 * StatusBadge — reusable pill badge for status/availability values.
 */
export default function StatusBadge({ status }) {
    const key = (status || '').toLowerCase();

    const config = {
        available: { cls: 'badge-available', label: 'Available' },
        busy: { cls: 'badge-busy', label: 'Busy' },
        open: { cls: 'badge-open', label: 'Open' },
        resolved: { cls: 'badge-resolved', label: 'Resolved' },
    };

    const { cls, label } = config[key] || { cls: 'badge-resolved', label: status || '—' };

    return (
        <span className={`badge ${cls}`}>
            <span className="badge-dot" style={{ background: 'currentColor' }} />
            {label}
        </span>
    );
}
