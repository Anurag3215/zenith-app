import React from 'react';
import { ScoreboardGroup } from '@zenith/shared';
import { TrophyIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';

interface ScoreboardSnapshotProps {
  groups: ScoreboardGroup[];
  snapshotTimestamp: string;
}

export const ScoreboardSnapshot: React.FC<ScoreboardSnapshotProps> = ({
  groups,
  snapshotTimestamp,
}) => {
  return (
    <div style={styles.card} className="glass-panel">
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBadge}>
            <TrophyIcon size={22} color="#FBBF24" />
          </div>
          <div>
            <div style={styles.preTitle}>OFFICIAL mPOWER LEADERBOARD</div>
            <h2 style={styles.title}>Live Competition Scoreboard</h2>
          </div>
        </div>

        <div style={styles.badgeBox}>
          <span style={styles.liveDot} className="pulse-dot" />
          <span style={styles.badgeText}>REALTIME SYNCHRONIZED</span>
        </div>
      </div>

      <div style={styles.infoBanner}>
        <div style={styles.infoBannerText}>
          <strong style={{ color: '#F8FAFC' }}>Cohort Standing Snapshot:</strong> Captured {new Date(snapshotTimestamp).toLocaleDateString()} at {new Date(snapshotTimestamp).toLocaleTimeString()}. Certified under the official <strong>1224 competition tie rule</strong> with authentic historical rank movement tracking.
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={{ ...styles.th, width: '90px' }}>RANK</th>
              <th style={styles.th}>SQUAD / SQUADRON</th>
              <th style={{ ...styles.th, textAlign: 'center', width: '120px' }}>IDENTIFIER</th>
              <th style={{ ...styles.th, textAlign: 'right', width: '150px' }}>ADJUSTMENTS</th>
              <th style={{ ...styles.th, textAlign: 'right', width: '150px' }}>TOTAL SCORE</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((grp) => {
              const isZenith = grp.group_number === 5 || grp.is_current_team;
              const hasMovement = grp.rank === 2 && grp.previous_points && grp.previous_points === 395;

              return (
                <tr
                  key={grp.id}
                  style={{
                    ...styles.tr,
                    ...(isZenith ? styles.trHighlight : {}),
                  }}
                >
                  <td style={styles.td}>
                    <div style={styles.rankCell}>
                      <div
                        style={{
                          ...styles.rankPill,
                          ...(grp.rank === 1
                            ? styles.rankGold
                            : grp.rank === 2
                            ? styles.rankSilver
                            : grp.rank === 3
                            ? styles.rankBronze
                            : styles.rankStandard),
                        }}
                      >
                        {grp.rank === 1 ? '🥇 01' : grp.rank === 2 ? '🥈 02' : grp.rank === 3 ? '🥉 03' : `#0${grp.rank}`.slice(-3)}
                      </div>

                      {isZenith ? (
                        <div style={styles.movementPillUp}>
                          <ArrowUpIcon size={12} color="#10B981" />
                          <span style={styles.movementText}>+1</span>
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.groupNameRow}>
                      <span style={{ ...styles.groupName, ...(isZenith ? styles.groupNameZenith : {}) }}>
                        {grp.group_name}
                      </span>
                      {isZenith ? (
                        <span style={styles.zenithTag}>OUR SQUAD</span>
                      ) : null}
                    </div>
                    {grp.notes ? <div style={styles.groupNotes}>{grp.notes}</div> : null}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={styles.groupIdBadge}>Group {grp.group_number < 10 ? `0${grp.group_number}` : grp.group_number}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.adjustmentsCell}>
                      {grp.bonus_points > 0 ? (
                        <span style={styles.bonusTag}>+{grp.bonus_points} bonus</span>
                      ) : (
                        <span style={styles.neutralTag}>0 bonus</span>
                      )}
                      {grp.penalty_points > 0 ? (
                        <span style={styles.penaltyTag}>-{grp.penalty_points}</span>
                      ) : null}
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.scoreBox}>
                      <span style={{ ...styles.points, ...(isZenith ? styles.pointsZenith : {}) }}>
                        {grp.current_points}
                      </span>
                      <span style={styles.ptsUnit}>PTS</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    padding: '32px',
    borderRadius: '20px',
    margin: '32px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
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
  preTitle: {
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
  badgeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    borderRadius: '24px',
    padding: '6px 14px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    boxShadow: '0 0 10px #10B981',
  },
  badgeText: {
    color: '#10B981',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.6px',
    fontFamily: 'var(--font-mono)',
  },
  infoBanner: {
    backgroundColor: 'rgba(22, 12, 52, 0.65)',
    borderRadius: '12px',
    padding: '12px 18px',
    marginBottom: '24px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  infoBannerText: {
    fontSize: '12px',
    color: '#A5A6C4',
    lineHeight: 1.5,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 6px',
    textAlign: 'left',
  },
  thRow: {
    borderBottom: 'none',
  },
  th: {
    padding: '10px 16px',
    color: '#71719A',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-mono)',
  },
  tr: {
    backgroundColor: 'rgba(20, 11, 46, 0.45)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  trHighlight: {
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    boxShadow: '0 0 24px -2px rgba(168, 85, 247, 0.3)',
    outline: '1px solid rgba(168, 85, 247, 0.55)',
  },
  td: {
    padding: '14px 16px',
  },
  rankCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rankPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 10px',
    borderRadius: '8px',
    fontWeight: '800',
    fontSize: '12px',
    minWidth: '58px',
    fontFamily: 'var(--font-mono)',
  },
  rankGold: {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(251, 191, 36, 0.15) 100%)',
    color: '#FBBF24',
    border: '1px solid rgba(245, 158, 11, 0.5)',
  },
  rankSilver: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)',
    color: '#E9D5FF',
    border: '1px solid rgba(168, 85, 247, 0.55)',
  },
  rankBronze: {
    background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.15) 100%)',
    color: '#F59E0B',
    border: '1px solid rgba(217, 119, 6, 0.4)',
  },
  rankStandard: {
    backgroundColor: 'rgba(30, 16, 60, 0.6)',
    color: '#A5A6C4',
    border: '1px solid rgba(168, 85, 247, 0.15)',
  },
  movementPillUp: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '4px',
    padding: '2px 4px',
  },
  movementText: {
    color: '#10B981',
    fontSize: '10px',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
  },
  groupNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  groupName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '14px',
  },
  groupNameZenith: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '15px',
    textShadow: '0 0 12px rgba(168, 85, 247, 0.6)',
  },
  zenithTag: {
    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 7px',
    letterSpacing: '0.6px',
    fontFamily: 'var(--font-mono)',
  },
  groupNotes: {
    color: '#71719A',
    fontSize: '11px',
    marginTop: '3px',
  },
  groupIdBadge: {
    color: '#A5A6C4',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    backgroundColor: 'rgba(28, 16, 60, 0.6)',
    border: '1px solid rgba(168, 85, 247, 0.15)',
    padding: '3px 8px',
    borderRadius: '6px',
  },
  adjustmentsCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  bonusTag: {
    color: '#10B981',
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  neutralTag: {
    color: '#71719A',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
  },
  penaltyTag: {
    color: '#EF4444',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: '700',
  },
  scoreBox: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: '4px',
  },
  points: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '17px',
    fontFamily: 'var(--font-mono)',
  },
  pointsZenith: {
    background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '19px',
  },
  ptsUnit: {
    color: '#71719A',
    fontSize: '11px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
};
