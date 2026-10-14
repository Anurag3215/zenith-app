import React from 'react';
import { TrainingDay } from '@zenith/shared';

interface JourneyTimelineViewProps {
  days: TrainingDay[];
}

export const JourneyTimelineView: React.FC<JourneyTimelineViewProps> = ({ days }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.pre}>PLACEMENT CURRICULUM</div>
          <h2 style={styles.title}>Four-Day Training Journey</h2>
        </div>
        <div style={styles.sub}>
          Real delivery verification: Day 1 completed; Days 2–4 awaiting official faculty execution.
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
                  {isCompleted ? '✓ COMPLETED' : '⏳ UPCOMING • AWAITING DELIVERY'}
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
                            <span style={styles.topicBullet}>•</span>
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
                  <div style={styles.pendingNoticeTitle}>🛡 Program Integrity Notice</div>
                  <div style={styles.pendingNoticeText}>
                    Session topics, technical milestones, and code challenges for Day 0{day.day_number} will be published strictly following conclusion of classroom and sprint delivery.
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
    margin: '32px 0',
  },
  header: {
    marginBottom: '24px',
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
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dayCard: {
    backgroundColor: '#101C3D',
    borderRadius: '16px',
    border: '1px solid #1E3368',
    padding: '24px',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.3)',
  },
  dayCardCompleted: {
    borderLeft: '4px solid #10B981',
  },
  dayCardPending: {
    borderLeft: '4px solid rgba(245, 158, 11, 0.4)',
    opacity: 0.95,
  },
  dayTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '12px',
  },
  dayMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dayPill: {
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '11px',
    fontWeight: '800',
  },
  dayPillCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10B981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  dayPillPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#FBBF24',
    border: '1px solid rgba(245, 158, 11, 0.3)',
  },
  scheduleDate: {
    color: '#64748B',
    fontSize: '12px',
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.6px',
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#10B981',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#FBBF24',
  },
  dayTitle: {
    color: '#F8FAFC',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  dayDesc: {
    color: '#94A3B8',
    fontSize: '13px',
    lineHeight: 1.6,
    marginBottom: '14px',
  },
  trainerRow: {
    fontSize: '11px',
    marginBottom: '16px',
  },
  trainerLabel: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  trainerName: {
    color: '#E2E8F0',
    fontWeight: '600',
  },
  completedDetails: {
    backgroundColor: '#1C2E60',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '16px',
  },
  sectionBlock: {
    marginBottom: '12px',
  },
  sectionHeader: {
    color: '#38BDF8',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  },
  topicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '6px',
  },
  topicItem: {
    color: '#CBD5E1',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
  },
  topicBullet: {
    color: '#06B6D4',
  },
  outcomesBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  outcomeRow: {
    color: '#E2E8F0',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
  },
  outcomeCheck: {
    color: '#10B981',
    fontWeight: '800',
  },
  pendingNoticeBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '16px',
  },
  pendingNoticeTitle: {
    color: '#FBBF24',
    fontSize: '11px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  pendingNoticeText: {
    color: '#94A3B8',
    fontSize: '11px',
    lineHeight: 1.5,
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tagChip: {
    backgroundColor: 'rgba(30, 51, 104, 0.5)',
    color: '#38BDF8',
    borderRadius: '20px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: '600',
    border: '1px solid rgba(56, 189, 248, 0.25)',
  },
};
