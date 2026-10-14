'use client';

import React from 'react';
import Link from 'next/link';
import { getPublicShowcaseData } from '../../lib/publicData';
import { calculateGrowthMetrics } from '../../lib/metrics';
import { PrinterIcon } from '../../components/Icons';

export default function ExecutiveReportPage() {
  const data = getPublicShowcaseData();
  const metrics = calculateGrowthMetrics(data);
  const zenithGroup = data.scoreboard.find((g) => g.group_number === 5 || g.is_current_team);
  const nowStr = new Date().toUTCString();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div style={styles.page}>
      {/* Action Toolbar (hidden during print) */}
      <div style={styles.toolbar} className="no-print">
        <div className="container" style={styles.toolbarInner}>
          <Link href="/" style={styles.backLink}>
            <span>←</span>
            <span>BACK TO SHOWCASE OVERVIEW</span>
          </Link>
          <div style={styles.actionBtns}>
            <button onClick={handlePrint} style={styles.printBtn}>
              <PrinterIcon size={16} color="#FFFFFF" />
              <span>PRINT / SAVE AS PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="container" style={styles.docContainer}>
        {/* Document Header */}
        <div style={styles.docHeader} className="report-card">
          <div style={styles.docTopRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src="/images/zenith-logo.jpg"
                alt="ZENITH Logo"
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #E5A93C', objectFit: 'cover' }}
              />
              <div>
                <div style={styles.docPre}>EXECUTIVE PLACEMENT DOSSIER</div>
                <h1 style={styles.docTitle}>ZENITH — Team No. 5</h1>
                <div style={styles.docSub}>
                  mPOWER Placement Training Program • Official Cohort Progress Report
                </div>
              </div>
            </div>
            <div style={styles.docBadgeBox}>
              <div style={styles.badgeRank}>RANK 2</div>
              <div style={styles.badgePoints}>465 Certified Points</div>
            </div>
          </div>

          <div style={styles.snapshotNoticeBox}>
            <div style={styles.snapshotNoticeTitle}>
              ⏱ POINT-IN-TIME CERTIFIED SNAPSHOT
            </div>
            <div style={styles.snapshotNoticeText}>
              Report Generated: <strong>{nowStr}</strong> • Snapshot Baseline: <strong>{data.snapshotTimestamp}</strong>. This document represents an authenticated, frozen snapshot of team deliverables and live leaderboard tally. Downloaded reports do not reflect post-generation score modifications.
            </div>
          </div>
        </div>

        {/* Section 1: Executive Overview */}
        <div style={styles.section} className="report-card">
          <h2 style={styles.sectionHeading}>1. Executive Overview & Squad Identity</h2>
          <p style={styles.paragraph}>
            ZENITH (Team No. 5) is an eight-member engineering cohort participating in the intensive four-day mPOWER Placement Training Program. The team operates under strict operational role segregation: one Team Admin, one Captain, one Vice-Captain, and five Members. Public signups are disabled across all environments, ensuring verified identity controls and non-repudiation during competitive scoring rounds.
          </p>

          <div style={styles.metricsGrid}>
            {metrics.slice(0, 4).map((m) => (
              <div key={m.id} style={styles.metricItem}>
                <div style={styles.metricLabel}>{m.label}</div>
                <div style={styles.metricValue}>{m.value}</div>
                <div style={styles.metricSource}>Source: {m.source}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Candidate Roster */}
        <div style={styles.section} className="report-card">
          <h2 style={styles.sectionHeading}>2. Candidate Roster & Verified Competencies</h2>
          <p style={styles.paragraph}>
            In accordance with institutional security policies, candidate email addresses and contact credentials remain locked within the private cohort workspace. The following eight accounts represent verified Team 5 members:
          </p>

          <table style={styles.rosterTable}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>CANDIDATE NAME</th>
                <th style={styles.tableHeader}>ASSIGNED ROLE</th>
                <th style={styles.tableHeader}>CORE COMPETENCIES & SKILLS</th>
              </tr>
            </thead>
            <tbody>
              {data.roster.map((member) => (
                <tr key={member.id} style={styles.tableRow}>
                  <td style={{ ...styles.tableCell, fontWeight: '700' }}>
                    {member.full_name}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.tableRoleTag}>
                      {member.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.tableSkillsRow}>
                      {member.skills.map((s, idx) => (
                        <span key={idx} style={styles.tableSkillChip}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Four-Day Curriculum Progress */}
        <div style={styles.section} className="report-card">
          <h2 style={styles.sectionHeading}>3. Four-Day Placement Curriculum Progress</h2>
          <div style={styles.curriculumList}>
            {data.trainingDays.map((d) => {
              const isCompleted = d.status === 'completed';
              return (
                <div
                  key={d.id}
                  style={{
                    ...styles.curriculumCard,
                    ...(isCompleted ? styles.curriculumCardDone : {}),
                  }}
                >
                  <div style={styles.curriculumTop}>
                    <span style={styles.curriculumDay}>DAY 0{d.day_number} — {d.title}</span>
                    <span
                      style={{
                        ...styles.curriculumBadge,
                        color: isCompleted ? '#10B981' : '#FBBF24',
                      }}
                    >
                      {isCompleted ? '✓ DELIVERED & COMPLETED' : '⏳ SCHEDULED / PENDING'}
                    </span>
                  </div>
                  <div style={styles.curriculumDesc}>{d.description}</div>

                  {isCompleted && d.learning_outcomes ? (
                    <div style={styles.outcomesList}>
                      <strong>Verified Outcomes Mastered:</strong>
                      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                        {d.learning_outcomes.map((o, idx) => (
                          <li key={idx}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={styles.pendingOutcomeNotice}>
                      Curriculum delivery scheduled for {d.schedule_date}. Deliverables will be certified following session conclusion.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Live Scoreboard Snapshot */}
        <div style={styles.section} className="report-card">
          <h2 style={styles.sectionHeading}>4. Live mPOWER Scoreboard Snapshot</h2>
          <p style={styles.paragraph}>
            Certified standings across all 10 competition squads adhering to the official 1224 competition tie rule:
          </p>

          <table style={styles.rosterTable}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={{ ...styles.tableHeader, width: '70px' }}>RANK</th>
                <th style={styles.tableHeader}>GROUP NAME</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>GROUP ID</th>
                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>BONUS / PENALTY</th>
                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>TOTAL POINTS</th>
              </tr>
            </thead>
            <tbody>
              {data.scoreboard.map((grp) => {
                const isZenith = grp.group_number === 5;
                return (
                  <tr
                    key={grp.id}
                    style={{
                      ...styles.tableRow,
                      ...(isZenith ? { backgroundColor: 'rgba(37, 99, 235, 0.15)', fontWeight: '700' } : {}),
                    }}
                  >
                    <td style={styles.tableCell}>
                      {grp.rank === 1 ? '🥇 1st' : grp.rank === 2 ? '🥈 2nd' : grp.rank === 3 ? '🥉 3rd' : `#${grp.rank}`}
                    </td>
                    <td style={styles.tableCell}>
                      {grp.group_name} {isZenith ? '(Our Team)' : ''}
                    </td>
                    <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                      Group {grp.group_number}
                    </td>
                    <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                      {grp.bonus_points > 0 ? `+${grp.bonus_points}` : '0'} / -{grp.penalty_points}
                    </td>
                    <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: '800' }}>
                      {grp.current_points} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 5: Showcase Reflections */}
        <div style={styles.section} className="report-card">
          <h2 style={styles.sectionHeading}>5. Endorsed Experiential Reflections</h2>
          <div style={styles.reflectionsList}>
            {data.reflections.map((refl) => (
              <div key={refl.id} style={styles.reflCard}>
                <div style={styles.reflHeader}>
                  <span style={styles.reflAuthor}>{refl.member_name} ({refl.member_role})</span>
                  <span style={styles.reflDay}>Day 0{refl.day_number} • {refl.mood_rating}/5 Mastery</span>
                </div>
                <div style={styles.reflTakeaways}>"{refl.key_takeaways}"</div>
                {refl.action_items ? (
                  <div style={styles.reflAction}>
                    <strong>Action Items:</strong> {refl.action_items}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Institutional Certification & Sign-off */}
        <div style={styles.signOffBox} className="report-card">
          <div style={styles.signOffTitle}>INSTITUTIONAL INTEGRITY & CERTIFICATION</div>
          <div style={styles.signOffText}>
            This dossier reflects authentic deliverables and certified standing achieved by ZENITH — Team No. 5 in the mPOWER Placement Training Program. Certified in accordance with academic integrity guidelines.
          </div>
          <div style={styles.signOffRow}>
            <div style={styles.signOffCol}>
              <div style={styles.signLine} />
              <div style={styles.signLabel}>Team Captain / Lead Representative</div>
            </div>
            <div style={styles.signOffCol}>
              <div style={styles.signLine} />
              <div style={styles.signLabel}>mPOWER Faculty / Evaluation Jury</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#070318',
    color: '#FFFFFF',
    paddingBottom: '80px',
  },
  toolbar: {
    backgroundColor: '#0D0727',
    borderBottom: '1px solid rgba(168, 85, 247, 0.25)',
    padding: '14px 0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  toolbarInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  backLink: {
    color: '#F472B6',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    letterSpacing: '0.5px',
  },
  actionBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  printBtn: {
    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
    border: 'none',
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 0 16px rgba(139, 92, 246, 0.45)',
  },
  docContainer: {
    marginTop: '32px',
    maxWidth: '960px',
  },
  docHeader: {
    backgroundColor: 'rgba(20, 11, 46, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    padding: '32px',
    marginBottom: '24px',
  },
  docTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  docPre: {
    color: '#F472B6',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
  },
  docTitle: {
    color: '#FFFFFF',
    fontSize: '32px',
    fontWeight: '800',
    marginTop: '4px',
    marginBottom: '4px',
  },
  docSub: {
    color: '#A5A6C4',
    fontSize: '14px',
  },
  docBadgeBox: {
    backgroundColor: 'rgba(28, 16, 60, 0.8)',
    borderRadius: '12px',
    padding: '12px 20px',
    textAlign: 'right',
    border: '1px solid rgba(168, 85, 247, 0.35)',
  },
  badgeRank: {
    color: '#FBBF24',
    fontSize: '24px',
    fontWeight: '800',
  },
  badgePoints: {
    color: '#F472B6',
    fontSize: '12px',
    fontWeight: '700',
  },
  snapshotNoticeBox: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
  },
  snapshotNoticeTitle: {
    color: '#E9D5FF',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '4px',
  },
  snapshotNoticeText: {
    color: '#A5A6C4',
    fontSize: '11px',
    lineHeight: 1.5,
  },
  section: {
    backgroundColor: 'rgba(20, 11, 46, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(168, 85, 247, 0.22)',
    padding: '28px',
    marginBottom: '24px',
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '800',
    marginBottom: '12px',
    borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
    paddingBottom: '8px',
  },
  paragraph: {
    color: '#A5A6C4',
    fontSize: '13px',
    lineHeight: 1.6,
    marginBottom: '20px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px',
  },
  metricItem: {
    backgroundColor: 'rgba(28, 16, 60, 0.7)',
    borderRadius: '8px',
    padding: '14px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  metricLabel: {
    color: '#F472B6',
    fontSize: '10px',
    fontWeight: '800',
    marginBottom: '4px',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: '800',
    marginBottom: '4px',
  },
  metricSource: {
    color: '#71719A',
    fontSize: '9px',
  },
  rosterTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  tableHeaderRow: {
    borderBottom: '1px solid rgba(168, 85, 247, 0.25)',
  },
  tableHeader: {
    color: '#71719A',
    padding: '10px',
    textAlign: 'left',
    fontSize: '10px',
    fontWeight: '800',
  },
  tableRow: {
    borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
  },
  tableCell: {
    padding: '12px 10px',
    color: '#FFFFFF',
  },
  tableRoleTag: {
    backgroundColor: 'rgba(28, 16, 60, 0.8)',
    color: '#FBBF24',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '800',
  },
  tableSkillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  tableSkillChip: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    color: '#E9D5FF',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '9px',
    fontWeight: '600',
  },
  curriculumList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  curriculumCard: {
    backgroundColor: 'rgba(28, 16, 60, 0.7)',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  curriculumCardDone: {
    borderLeft: '4px solid #10B981',
  },
  curriculumTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  curriculumDay: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '13px',
  },
  curriculumBadge: {
    fontSize: '10px',
    fontWeight: '800',
  },
  curriculumDesc: {
    color: '#A5A6C4',
    fontSize: '12px',
    lineHeight: 1.5,
    marginBottom: '8px',
  },
  outcomesList: {
    backgroundColor: 'rgba(20, 11, 46, 0.8)',
    borderRadius: '6px',
    padding: '10px',
    fontSize: '11px',
    color: '#FFFFFF',
  },
  pendingOutcomeNotice: {
    color: '#71719A',
    fontSize: '11px',
    fontStyle: 'italic',
  },
  reflectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reflCard: {
    backgroundColor: 'rgba(28, 16, 60, 0.7)',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  reflHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  reflAuthor: {
    color: '#F472B6',
    fontWeight: '700',
    fontSize: '12px',
  },
  reflDay: {
    color: '#FBBF24',
    fontSize: '11px',
    fontWeight: '700',
  },
  reflTakeaways: {
    color: '#FFFFFF',
    fontSize: '12px',
    lineHeight: 1.5,
    fontStyle: 'italic',
    marginBottom: '6px',
  },
  reflAction: {
    color: '#A5A6C4',
    fontSize: '11px',
  },
  signOffBox: {
    backgroundColor: 'rgba(20, 11, 46, 0.85)',
    borderRadius: '16px',
    border: '1px solid rgba(168, 85, 247, 0.22)',
    padding: '28px',
  },
  signOffTitle: {
    color: '#F472B6',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  signOffText: {
    color: '#A5A6C4',
    fontSize: '12px',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  signOffRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '32px',
    flexWrap: 'wrap',
  },
  signOffCol: {
    flex: 1,
    minWidth: '220px',
  },
  signLine: {
    borderBottom: '1px solid #71719A',
    marginBottom: '8px',
    height: '32px',
  },
  signLabel: {
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: '600',
    textAlign: 'center',
  },
};
