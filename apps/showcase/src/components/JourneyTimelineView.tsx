import React from 'react';
import { TrainingDay } from '@zenith/shared';
import { ClockIcon, CheckCircleIcon, LockIcon } from './Icons';

interface JourneyTimelineViewProps {
  days: TrainingDay[];
}

export const JourneyTimelineView: React.FC<JourneyTimelineViewProps> = ({ days }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBadge}>
            <ClockIcon size={22} color="#00F0FF" />
          </div>
          <div>
            <div style={styles.pre}>PLACEMENT CURRICULUM</div>
            <h2 style={styles.title}>Four-Day Training Journey</h2>
          </div>
        </div>
        <div style={styles.sub}>
          Real delivery verification: Day 1 completed; Days 2–4 locked pending official faculty execution.
        </div>
      </div>

      <div style={styles.timeline}>
        {days.map((day) => {
          const isCompleted = day.status === 'completed';
          return (
            <div
              key={day.id}
              style={{
                ...styles.dayCard,
                ...(isCompleted ? styles.dayCardCompleted : styles.dayCardPending),
              }}
              className="glass-panel"
            >
              <div style={styles.dayTop}>
                <div style={styles.dayMeta}>
                  <span
                    style={{
                      ...styles.dayPill,
                      ...(isCompleted ? styles.dayPillCompleted : styles.dayPillPending),
                    }}
                  >
                    DAY 0{day.day_number}
                  </span>
                  <span style={styles.scheduleDate}>{day.schedule_date}</span>
                </div>
                <div
                  style={{
                    ...styles.statusBadge,
                    ...(isCompleted ? styles.statusCompleted : styles.statusPending),
                  }}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircleIcon size={13} color="#10B981" />
                      <span>COMPLETED & VERIFIED</span>
                    </>
                  ) : (
                    <>
                      <LockIcon size={12} color="#FBBF24" />
                      <span>UPCOMING • AWAITING DELIVERY</span>
                    </>
                  )}
                </div>
              </div>

              <h3 style={styles.dayTitle}>{day.title}</h3>
              <p style={styles.dayDesc}>{day.description}</p>

              {day.trainer_name ? (
                <div style={styles.trainerRow}>
                  <span style={styles.trainerLabel}>LEAD FACULTY: </span>
                  <span style={styles.trainerName}>{day.trainer_name}</span>
                </div>
              ) : null}

              {isCompleted ? (
                <div style={styles.completedDetails}>
                  {day.topics_covered && day.topics_covered.length > 0 ? (
                    <div style={styles.sectionBlock}>
                      <div style={styles.sectionHeader}>DELIVERED TOPICS:</div>
                      <div style={styles.topicsGrid}>
                        {day.topics_covered.map((t, idx) => (
                          <div key={idx} style={styles.topicItem}>
                            <span style={styles.topicBullet}>▸</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {day.learning_outcomes && day.learning_outcomes.length > 0 ? (
                    <div style={styles.sectionBlock}>
                      <div style={styles.sectionHeader}>VERIFIED LEARNING OUTCOMES:</div>
                      <div style={styles.outcomesBox}>
                        {day.learning_outcomes.map((o, idx) => (
                          <div key={idx} style={styles.outcomeRow}>
                            <span style={styles.outcomeCheck}>✓</span>
                            <span>{o}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div style={styles.pendingNoticeBox}>
                  <div style={styles.pendingNoticeTitle}>
                    <LockIcon size={14} color="#FBBF24" />
                    <span>Curriculum Delivery Policy</span>
                  </div>
                  <div style={styles.pendingNoticeText}>
                    Session topics, technical milestones, and code challenges for Day 0{day.day_number} will be published strictly following classroom sprint conclusion by lead corporate instructors.
                  </div>
                </div>
              )}

              {/* Tags */}
              <div style={styles.tagsRow}>
                {day.focus_areas.map((tag, idx) => (
                  <span key={idx} style={styles.tagChip}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
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
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px rgba(168, 85, 247, 0.25)',
  },
  pre: {
    color: '#F472B6',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    fontFamily: 'var(--font-mono)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.3px',
    marginTop: '2px',
  },
  sub: {
    color: '#A5A6C4',
    fontSize: '12px',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  dayCard: {
    borderRadius: '20px',
    padding: '28px',
  },
  dayCardCompleted: {
    borderLeft: '4px solid #10B981',
  },
  dayCardPending: {
    borderLeft: '4px solid rgba(168, 85, 247, 0.5)',
    opacity: 0.92,
  },
  dayTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px',
  },
  dayMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dayPill: {
    borderRadius: '8px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
  },
  dayPillCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10B981',
    border: '1px solid rgba(16, 185, 129, 0.35)',
  },
  dayPillPending: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    color: '#E9D5FF',
    border: '1px solid rgba(168, 85, 247, 0.35)',
  },
  scheduleDate: {
    color: '#71719A',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.6px',
    fontFamily: 'var(--font-mono)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: '#10B981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  statusPending: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    color: '#E9D5FF',
    border: '1px solid rgba(168, 85, 247, 0.35)',
  },
  dayTitle: {
    color: '#FFFFFF',
    fontSize: '20px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-0.3px',
  },
  dayDesc: {
    color: '#A5A6C4',
    fontSize: '14px',
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  trainerRow: {
    fontSize: '12px',
    marginBottom: '18px',
  },
  trainerLabel: {
    color: '#F472B6',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
  },
  trainerName: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completedDetails: {
    backgroundColor: 'rgba(22, 12, 52, 0.65)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '18px',
    border: '1px solid rgba(168, 85, 247, 0.18)',
  },
  sectionBlock: {
    marginBottom: '16px',
  },
  sectionHeader: {
    color: '#C084FC',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-mono)',
    marginBottom: '8px',
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '8px',
  },
  topicItem: {
    color: '#E2E8F0',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  topicBullet: {
    color: '#EC4899',
    fontWeight: '700',
  },
  outcomesBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  outcomeRow: {
    color: '#E2E8F0',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  outcomeCheck: {
    color: '#10B981',
    fontWeight: '800',
  },
  pendingNoticeBox: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    borderRadius: '12px',
    padding: '16px 18px',
    marginBottom: '18px',
  },
  pendingNoticeTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#E9D5FF',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '4px',
    fontFamily: 'var(--font-mono)',
  },
  pendingNoticeText: {
    color: '#A5A6C4',
    fontSize: '12px',
    lineHeight: 1.6,
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagChip: {
    backgroundColor: 'rgba(28, 16, 60, 0.6)',
    color: '#E9D5FF',
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    fontFamily: 'var(--font-mono)',
  },
};
