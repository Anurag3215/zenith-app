import React from 'react';
import Link from 'next/link';
import { getPublicShowcaseData } from '../lib/publicData';
import { calculateGrowthMetrics } from '../lib/metrics';
import { ScoreboardSnapshot } from '../components/ScoreboardSnapshot';
import { GrowthDashboardView } from '../components/GrowthDashboardView';
import { JourneyTimelineView } from '../components/JourneyTimelineView';
import { RosterGrid } from '../components/RosterGrid';
import { GallerySection } from '../components/GallerySection';
import { ReflectionsHighlight } from '../components/ReflectionsHighlight';

export default function ShowcaseLandingPage() {
  const data = getPublicShowcaseData();
  const metrics = calculateGrowthMetrics(data);

  const zenithGroup = data.scoreboard.find((g) => g.group_number === 5 || g.is_current_team);

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContainer}>
          <div style={styles.heroBadgeRow}>
            <span style={styles.heroBadge}>TEAM NO. 5 • COHORT STANDING: RANK 2</span>
            <span style={styles.verifiedTag}>✓ Officially Certified Data</span>
          </div>

          <h1 style={styles.heroTitle}>
            Engineering Excellence, Rigorous Preparation & Placement Leadership
          </h1>

          <p style={styles.heroDesc}>
            Welcome to the official public presentation portal for <strong style={{ color: '#F8FAFC' }}>ZENITH (Team 5)</strong> in the mPOWER Placement Training Program. Inspect verified curriculum delivery, our verified Rank 2 leaderboard standing, individual member competencies, and genuine experiential reflections.
          </p>

          <div style={styles.ctaRow}>
            <Link href="/present" style={styles.ctaPrimary}>
              <span>📽️</span>
              <span>ENTER PRESENTATION MODE</span>
            </Link>
            <Link href="/report" style={styles.ctaSecondary}>
              <span>📄</span>
              <span>DOWNLOAD EXECUTIVE REPORT</span>
            </Link>
            <Link href="/#scoreboard" style={styles.ctaOutline}>
              <span>🏆</span>
              <span>LEADERBOARD SNAPSHOT</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div style={styles.quickBar}>
            <div style={styles.quickMetric}>
              <div style={styles.quickValue}>#{zenithGroup?.rank || 2}</div>
              <div style={styles.quickLabel}>COHORT RANK</div>
            </div>
            <div style={styles.quickDivider} />
            <div style={styles.quickMetric}>
              <div style={styles.quickValue}>{zenithGroup?.current_points || 465}</div>
              <div style={styles.quickLabel}>TOTAL POINTS</div>
            </div>
            <div style={styles.quickDivider} />
            <div style={styles.quickMetric}>
              <div style={styles.quickValue}>8</div>
              <div style={styles.quickLabel}>CANDIDATES</div>
            </div>
            <div style={styles.quickDivider} />
            <div style={styles.quickMetric}>
              <div style={styles.quickValue}>1 of 4</div>
              <div style={styles.quickLabel}>DAYS COMPLETED</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container">
        {/* Scoreboard Section */}
        <section id="scoreboard" style={styles.section}>
          <ScoreboardSnapshot
            groups={data.scoreboard}
            snapshotTimestamp={data.snapshotTimestamp}
          />
        </section>

        {/* Growth Dashboard Section */}
        <section id="growth" style={styles.section}>
          <GrowthDashboardView metrics={metrics} />
        </section>

        {/* Journey Timeline Section */}
        <section id="journey" style={styles.section}>
          <JourneyTimelineView days={data.trainingDays} />
        </section>

        {/* Candidate Roster Section */}
        <section id="roster" style={styles.section}>
          <RosterGrid roster={data.roster} />
        </section>

        {/* Media Gallery Section */}
        <section id="gallery" style={styles.section}>
          <GallerySection items={data.gallery} />
        </section>

        {/* Reflections Section */}
        <section id="reflections" style={styles.section}>
          <ReflectionsHighlight reflections={data.reflections} />
        </section>

        {/* Genuine Lessons & Future Commitments Section */}
        <section style={styles.closingSection}>
          <div style={styles.closingHeader}>
            <div style={styles.closingPre}>REFLECTION & AMBITION</div>
            <h2 style={styles.closingTitle}>Genuine Lessons & Future Placement Commitments</h2>
          </div>

          <div style={styles.closingGrid}>
            <div style={styles.closingCard}>
              <h3 style={styles.closingCardTitle}>💡 Key Lessons from Day 1 Delivery</h3>
              <ul style={styles.closingList}>
                <li>
                  <strong>Speed Mathematics Discipline:</strong> Sectional aptitude under 60-second time boundaries requires systematic recognition of algebraic shortcuts rather than brute-force computation.
                </li>
                <li>
                  <strong>Quantified Resume Articulation:</strong> Evaluator panels prioritize measurable business impact and problem scale over generic keyword lists.
                </li>
                <li>
                  <strong>Operational Squad Synergy:</strong> Rapid consensus and structured turn-taking during group discussions generate higher cohort scores than aggressive dominance.
                </li>
              </ul>
            </div>

            <div style={styles.closingCard}>
              <h3 style={styles.closingCardTitle}>🚀 Forward Commitments for Days 2–4</h3>
              <ul style={styles.closingList}>
                <li>
                  <strong>Technical Rigor:</strong> Execute algorithmic coding rounds with strict attention to time and space complexity boundaries.
                </li>
                <li>
                  <strong>Interview Confidence:</strong> Apply the STAR methodology in mock behavioral rounds with verified situational anecdotes.
                </li>
                <li>
                  <strong>Podium Finish:</strong> Sustain Team 5's top-tier standing on the mPOWER competition leaderboard through rigorous peer coaching.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
  },
  hero: {
    padding: '64px 0 48px',
    background: 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.15) 0%, rgba(5, 8, 20, 0) 70%)',
    borderBottom: '1px solid #1E3368',
    marginBottom: '32px',
  },
  heroContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  heroBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '18px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    color: '#FBBF24',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.8px',
  },
  verifiedTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    color: '#10B981',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: '700',
  },
  heroTitle: {
    color: '#F8FAFC',
    fontSize: 'clamp(28px, 4.5vw, 44px)',
    fontWeight: '800',
    lineHeight: 1.2,
    maxWidth: '920px',
    marginBottom: '18px',
    letterSpacing: '-0.5px',
  },
  heroDesc: {
    color: '#94A3B8',
    fontSize: 'clamp(14px, 1.8vw, 16px)',
    lineHeight: 1.6,
    maxWidth: '780px',
    marginBottom: '28px',
  },
  ctaRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  ctaPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '13px',
    padding: '12px 22px',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)',
    letterSpacing: '0.5px',
  },
  ctaSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#101C3D',
    border: '1px solid #1E3368',
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: '13px',
    padding: '12px 20px',
    borderRadius: '10px',
    letterSpacing: '0.5px',
  },
  ctaOutline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: '1px solid #06B6D4',
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: '13px',
    padding: '12px 20px',
    borderRadius: '10px',
    letterSpacing: '0.5px',
  },
  quickBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101C3D',
    border: '1px solid #1E3368',
    borderRadius: '16px',
    padding: '16px 32px',
    gap: '24px',
    flexWrap: 'wrap',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  quickMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '100px',
  },
  quickValue: {
    color: '#F8FAFC',
    fontSize: '22px',
    fontWeight: '800',
  },
  quickLabel: {
    color: '#06B6D4',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginTop: '2px',
  },
  quickDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: '#1E3368',
  },
  section: {
    marginBottom: '48px',
  },
  closingSection: {
    backgroundColor: '#101C3D',
    borderRadius: '20px',
    border: '1px solid #1E3368',
    padding: '36px',
    margin: '48px 0 32px',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4)',
  },
  closingHeader: {
    marginBottom: '24px',
  },
  closingPre: {
    color: '#06B6D4',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1px',
  },
  closingTitle: {
    color: '#F8FAFC',
    fontSize: '22px',
    fontWeight: '800',
    marginTop: '4px',
  },
  closingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  closingCard: {
    backgroundColor: '#1C2E60',
    borderRadius: '14px',
    padding: '24px',
    border: '1px solid rgba(45, 75, 148, 0.4)',
  },
  closingCardTitle: {
    color: '#FBBF24',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '14px',
  },
  closingList: {
    paddingLeft: '18px',
    color: '#CBD5E1',
    fontSize: '13px',
    lineHeight: 1.7,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
};
