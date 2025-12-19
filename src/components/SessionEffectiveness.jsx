function SessionEffectiveness() {
  return (
    <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>
          Session Effectiveness
        </h3>
        <span className="text-label px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#9ac4ab', color: '#1b7a43' }}>
          ✓ Anonymized
        </span>
      </div>
      <p className="text-body-md mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Aggregated pre/post improvement across all programs
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Avg Pre-Score */}
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
          <p className="text-label mb-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>Avg Pre-Score</p>
          <p className="text-h1" style={{ color: 'var(--color-text-primary)' }}>41</p>
        </div>

        {/* Avg Post-Score */}
        <div className="rounded-lg p-4" style={{ backgroundColor: '#9ac4ab' }}>
          <p className="text-label mb-2 font-medium" style={{ color: '#1b7a43' }}>Avg Post-Score</p>
          <p className="text-h1" style={{ color: '#1b7a43' }}>60</p>
        </div>

        {/* Improvement */}
        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--color-primary-lightest)' }}>
          <p className="text-label mb-2 font-medium" style={{ color: 'var(--color-primary)' }}>Improvement</p>
          <p className="text-h1" style={{ color: 'var(--color-primary)' }}>+19 pts</p>
          <p className="text-caption mt-2" style={{ color: 'var(--color-text-secondary)' }}>Sample: 520 attendees</p>
        </div>
      </div>
    </div>
  );
}

export default SessionEffectiveness;

