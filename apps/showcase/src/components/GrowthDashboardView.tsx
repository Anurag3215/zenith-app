import React from 'react';
import { GrowthMetric } from '../lib/metrics';

interface GrowthDashboardViewProps {
  metrics: GrowthMetric[];
}

export const GrowthDashboardView: React.FC<GrowthDashboardViewProps> = ({ metrics }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.pre}>VERIFIED TRAJECTORY</div>
          <h2 style={styles.title}>Growth & Velocity Metrics</h2>
        </div>
        <div style={styles.disclaimer}>
          <span>All indicators traced to real database records. Zero synthetic percentages or unverified claims.</span>
        </div>
      </div>

      <div style={styles.grid}>
        {metrics.map((m) => (
          <div key={m.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.categoryBadge}>{m.category.toUpperCase()}</span>
              <span style={styles.sourceTag}>Certified Record</span>
            </div>

            <div style={styles.valueRow}>
              <span style={styles.value}>{m.value}</span>
              {m.unit ? <span style={styles.unit}>{m.unit}</span> : null}
            </div>

            <div style={styles.label}>{m.label}</div>
            <div style={styles.def}>{m.definition}</div>

            <div style={styles.sourceBox}>
              <span style={styles.sourceLabel}>SOURCE: </span>
              <span style={styles.sourceValue}>{m.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '32px 0',
  },
  header: {
    marginBottom: '20px',
  },
  pre: {
    color: '#06B6D4',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1px',
  },
  title: {
    color: '#F8FAFC',
    fontSize: '22px',
    fontWeight: '800',
    marginTop: '2px',
  },
  disclaimer: {
    color: '#94A3B8',
    fontSize: '12px',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#101C3D',
    borderRadius: '14px',
    border: '1px solid #1E3368',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  categoryBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    color: '#38BDF8',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 6px',
    letterSpacing: '0.6px',
  },
  sourceTag: {
    color: '#10B981',
    fontSize: '10px',
    fontWeight: '700',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '6px',
  },
  value: {
    color: '#F8FAFC',
    fontSize: '26px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  unit: {
    color: '#FBBF24',
    fontSize: '11px',
    fontWeight: '700',
  },
  label: {
    color: '#E2E8F0',
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  def: {
    color: '#94A3B8',
    fontSize: '11px',
    lineHeight: 1.5,
    marginBottom: '14px',
    flex: 1,
  },
  sourceBox: {
    backgroundColor: '#1C2E60',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '10px',
    border: '1px solid rgba(45, 75, 148, 0.4)',
  },
  sourceLabel: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  sourceValue: {
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
};
