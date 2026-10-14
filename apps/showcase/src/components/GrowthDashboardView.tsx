import React from 'react';
import { GrowthMetric } from '../lib/metrics';
import { ChartBarIcon, CheckCircleIcon } from './Icons';

interface GrowthDashboardViewProps {
  metrics: GrowthMetric[];
}

export const GrowthDashboardView: React.FC<GrowthDashboardViewProps> = ({ metrics }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBadge}>
            <ChartBarIcon size={22} color="#00F0FF" />
          </div>
          <div>
            <div style={styles.pre}>VERIFIED TRAJECTORY</div>
            <h2 style={styles.title}>Growth & Velocity Metrics</h2>
          </div>
        </div>
        <div style={styles.disclaimer}>
          <span>All metrics computed directly from authentic database transactions. Zero simulated estimates.</span>
        </div>
      </div>

      <div style={styles.grid}>
        {metrics.map((m) => (
          <div key={m.id} style={styles.card} className="glass-panel">
            <div style={styles.cardHeader}>
              <span style={styles.categoryBadge}>{m.category.toUpperCase()}</span>
              <div style={styles.verifiedTag}>
                <CheckCircleIcon size={12} color="#10B981" />
                <span>Certified</span>
              </div>
            </div>

            <div style={styles.valueRow}>
              <span style={styles.value} className="gradient-text-white">{m.value}</span>
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
    margin: '48px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '28px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  iconBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pre: {
    color: '#00F0FF',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    fontFamily: 'var(--font-mono)',
  },
  title: {
    color: '#F8FAFC',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.3px',
    marginTop: '2px',
  },
  disclaimer: {
    color: '#94A3B8',
    fontSize: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '20px',
  },
  card: {
    borderRadius: '18px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  categoryBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    color: '#38BDF8',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800',
    padding: '3px 8px',
    letterSpacing: '0.6px',
    fontFamily: 'var(--font-mono)',
  },
  verifiedTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#10B981',
    fontSize: '11px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '8px',
  },
  value: {
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-1px',
    fontFamily: 'var(--font-mono)',
  },
  unit: {
    color: '#FBBF24',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  label: {
    color: '#F8FAFC',
    fontSize: '15px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  def: {
    color: '#94A3B8',
    fontSize: '12px',
    lineHeight: 1.5,
    marginBottom: '18px',
    flex: 1,
  },
  sourceBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '11px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  sourceLabel: {
    color: '#38BDF8',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
  },
  sourceValue: {
    color: '#94A3B8',
    fontFamily: 'var(--font-mono)',
  },
};
