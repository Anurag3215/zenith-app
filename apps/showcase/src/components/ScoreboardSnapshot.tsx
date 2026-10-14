import React from 'react';
import { ScoreboardGroup } from '@zenith/shared';

interface ScoreboardSnapshotProps {
  groups: ScoreboardGroup[];
  snapshotTimestamp: string;
}

export const ScoreboardSnapshot: React.FC<ScoreboardSnapshotProps> = ({
  groups,
  snapshotTimestamp,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.preTitle}>OFFICIAL mPOWER LEADERBOARD</div>
          <h2 style={styles.title}>Live Competition Scoreboard</h2>
        </div>
        <div style={styles.badgeBox}>
          <span style={styles.liveDot} />
          <span style={styles.badgeText}>READ-ONLY EVALUATOR SNAPSHOT</span>
        </div>
      </div>

      <div style={styles.infoBanner}>
        <span>📌 Standings certified by placement evaluation coordinators. Snapshot captured: {new Date(snapshotTimestamp).toLocaleDateString()} at {new Date(snapshotTimestamp).toLocaleTimeString()}. Tie policy: Standard 1224 competition rank skipping.</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={{ ...styles.th, width: '80px' }}>RANK</th>
              <th style={styles.th}>SQUAD / GROUP</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>GROUP NO</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>BONUS / PENALTY</th>
              <th style={{ ...styles.th, textAlign: 'right', width: '130px' }}>TOTAL POINTS</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((grp) => {
              const isZenith = grp.group_number === 5 || grp.is_current_team;
              return (
                <tr
                  key={grp.id}
                  style={{
                    ...styles.tr,
                    ...(isZenith ? styles.trHighlight : {}),
                  }}
                >
                  <td style={styles.td}>
                    <div
                      style={{
                        ...styles.rankPill,
                        ...(grp.rank === 1
                          ? styles.rankGold
                          : grp.rank === 2
                          ? styles.rankSilver
                          : grp.rank === 3
                          ? styles.rankBronze
                          : {}),
                      }}
                    >
                      {grp.rank === 1 ? '🥇 1st' : grp.rank === 2 ? '🥈 2nd' : grp.rank === 3 ? '🥉 3rd' : `#${grp.rank}`}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.groupNameRow}>
                      <span style={{ ...styles.groupName, ...(isZenith ? styles.groupNameZenith : {}) }}>
                        {grp.group_name}
                      </span>
                      {isZenith ? <span style={styles.zenithTag}>OUR TEAM</span> : null}
                    </div>
                    {grp.notes ? <div style={styles.groupNotes}>{grp.notes}</div> : null}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center', color: '#94A3B8' }}>
                    Group {grp.group_number}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <span style={{ color: grp.bonus_points > 0 ? '#10B981' : '#64748B', fontSize: '12px', fontWeight: '600' }}>
                      {grp.bonus_points > 0 ? `+${grp.bonus_points} bonus` : '—'}
                    </span>
                    {grp.penalty_points > 0 ? (
                      <span style={{ color: '#EF4444', fontSize: '11px', marginLeft: '6px' }}>
                        (-{grp.penalty_points})
                      </span>
                    ) : null}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <span style={{ ...styles.points, ...(isZenith ? styles.pointsZenith : {}) }}>
                      {grp.current_points}
                    </span>
                    <span style={styles.ptsUnit}> pts</span>
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
    backgroundColor: '#101C3D',
    borderRadius: '16px',
    border: '1px solid #1E3368',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px',
  },
  preTitle: {
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
  badgeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '20px',
    padding: '4px 10px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
  },
  badgeText: {
    color: '#10B981',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  infoBanner: {
    backgroundColor: 'rgba(30, 51, 104, 0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '11px',
    color: '#94A3B8',
    marginBottom: '20px',
    border: '1px solid rgba(30, 51, 104, 0.5)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    borderBottom: '1px solid #1E3368',
  },
  th: {
    padding: '12px 14px',
    color: '#64748B',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
  },
  tr: {
    borderBottom: '1px solid rgba(30, 51, 104, 0.3)',
    transition: 'background-color 0.15s ease',
  },
  trHighlight: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderLeft: '3px solid #2563EB',
  },
  td: {
    padding: '14px',
  },
  rankPill: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: '#1C2E60',
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: '11px',
    textAlign: 'center',
    minWidth: '55px',
  },
  rankGold: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#FBBF24',
    border: '1px solid rgba(245, 158, 11, 0.4)',
  },
  rankSilver: {
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    color: '#38BDF8',
    border: '1px solid rgba(56, 189, 248, 0.4)',
  },
  rankBronze: {
    backgroundColor: 'rgba(217, 119, 6, 0.18)',
    color: '#F59E0B',
  },
  groupNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  groupName: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: '13px',
  },
  groupNameZenith: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  zenithTag: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '800',
    padding: '1px 5px',
    letterSpacing: '0.5px',
  },
  groupNotes: {
    color: '#64748B',
    fontSize: '10px',
    marginTop: '3px',
  },
  points: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: '15px',
  },
  pointsZenith: {
    color: '#FBBF24',
    fontSize: '16px',
  },
  ptsUnit: {
    color: '#64748B',
    fontSize: '11px',
  },
};
