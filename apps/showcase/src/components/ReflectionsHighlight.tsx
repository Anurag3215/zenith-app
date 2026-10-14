import React from 'react';
import { Reflection } from '@zenith/shared';

interface ReflectionsHighlightProps {
  reflections: Reflection[];
}

export const ReflectionsHighlight: React.FC<ReflectionsHighlightProps> = ({ reflections }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.pre}>EXPERIENTIAL INSIGHTS</div>
          <h2 style={styles.title}>Showcase-Endorsed Reflections</h2>
        </div>
        <div style={styles.sub}>
          Direct observations from squad members vetted and approved by Captains for evaluator inspection.
        </div>
      </div>

      <div style={styles.grid}>
        {reflections.map((refl) => (
          <div key={refl.id} style={styles.card}>
            <div style={styles.topRow}>
              <div>
                <div style={styles.author}>{refl.member_name}</div>
                <div style={styles.metaRow}>
                  <span style={styles.dayTag}>DAY 0{refl.day_number}</span>
                  <span style={styles.roleTag}>{refl.member_role.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
              <div style={styles.stars}>
                {'★'.repeat(refl.mood_rating)}
                <span style={styles.ratingSub}>{refl.mood_rating}/5 Mastery</span>
              </div>
            </div>

            <div style={styles.block}>
              <div style={styles.blockTitle}>KEY TAKEAWAYS & PATTERNS</div>
              <div style={styles.body}>{refl.key_takeaways}</div>
            </div>

            {refl.challenges_faced ? (
              <div style={styles.block}>
                <div style={styles.blockTitle}>CHALLENGES ENCOUNTERED</div>
                <div style={styles.body}>{refl.challenges_faced}</div>
              </div>
            ) : null}

            {refl.action_items ? (
              <div style={styles.block}>
                <div style={styles.blockTitle}>ACTION ITEMS</div>
                <div style={styles.body}>{refl.action_items}</div>
              </div>
            ) : null}

            <div style={styles.endorseBadge}>
              <span>✓ Certified & Endorsed for Evaluator Review</span>
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
  sub: {
    color: '#94A3B8',
    fontSize: '12px',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#101C3D',
    borderRadius: '16px',
    border: '1px solid #1E3368',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(30, 51, 104, 0.4)',
    paddingBottom: '12px',
    marginBottom: '14px',
  },
  author: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: '14px',
    marginBottom: '4px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dayTag: {
    backgroundColor: '#1C2E60',
    color: '#38BDF8',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: '800',
  },
  roleTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#FBBF24',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '9px',
    fontWeight: '800',
  },
  stars: {
    color: '#FBBF24',
    fontSize: '15px',
    letterSpacing: '1px',
    textAlign: 'right',
  },
  ratingSub: {
    display: 'block',
    color: '#64748B',
    fontSize: '10px',
    marginTop: '2px',
  },
  block: {
    marginBottom: '12px',
  },
  blockTitle: {
    color: '#06B6D4',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '4px',
  },
  body: {
    color: '#CBD5E1',
    fontSize: '12px',
    lineHeight: 1.6,
  },
  endorseBadge: {
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid rgba(30, 51, 104, 0.3)',
    color: '#10B981',
    fontSize: '10px',
    fontWeight: '700',
  },
};
