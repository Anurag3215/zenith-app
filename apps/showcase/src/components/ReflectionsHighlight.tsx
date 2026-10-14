import React from 'react';
import { Reflection } from '@zenith/shared';
import { StarIcon, CheckCircleIcon } from './Icons';

interface ReflectionsHighlightProps {
  reflections: Reflection[];
}

export const ReflectionsHighlight: React.FC<ReflectionsHighlightProps> = ({ reflections }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBadge}>
            <StarIcon size={22} color="#FBBF24" />
          </div>
          <div>
            <div style={styles.pre}>EXPERIENTIAL INSIGHTS</div>
            <h2 style={styles.title}>Showcase-Endorsed Reflections</h2>
          </div>
        </div>
        <div style={styles.sub}>
          Direct observations from squad members vetted and approved by Captains for evaluator inspection.
        </div>
      </div>

      <div style={styles.grid}>
        {reflections.map((refl) => (
          <div key={refl.id} style={styles.card} className="glass-panel">
            <div style={styles.topRow}>
              <div>
                <div style={styles.author}>{refl.member_name}</div>
                <div style={styles.metaRow}>
                  <span style={styles.dayTag}>DAY 0{refl.day_number}</span>
                  <span style={styles.roleTag}>{refl.member_role.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
              <div style={styles.ratingBox}>
                <div style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={14}
                      color={star <= refl.mood_rating ? '#FBBF24' : '#334155'}
                    />
                  ))}
                </div>
                <span style={styles.ratingSub}>{refl.mood_rating}/5 Confidence</span>
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
              <CheckCircleIcon size={13} color="#10B981" />
              <span>Certified & Endorsed for Evaluator Review</span>
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
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
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
  sub: {
    color: '#94A3B8',
    fontSize: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    borderRadius: '20px',
    padding: '26px',
    display: 'flex',
    flexDirection: 'column',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '14px',
    marginBottom: '16px',
  },
  author: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: '15px',
    marginBottom: '4px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dayTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    color: '#38BDF8',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
  },
  roleTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#FBBF24',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '9px',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
  },
  ratingBox: {
    textAlign: 'right',
  },
  starsRow: {
    display: 'flex',
    gap: '3px',
    justifyContent: 'flex-end',
  },
  ratingSub: {
    display: 'block',
    color: '#64748B',
    fontSize: '10px',
    marginTop: '4px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
  },
  block: {
    marginBottom: '14px',
  },
  blockTitle: {
    color: '#00F0FF',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-mono)',
    marginBottom: '6px',
  },
  body: {
    color: '#CBD5E1',
    fontSize: '13px',
    lineHeight: 1.6,
  },
  endorseBadge: {
    marginTop: 'auto',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#10B981',
    fontSize: '11px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
};
