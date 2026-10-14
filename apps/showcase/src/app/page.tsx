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
import {
  PresentationIcon,
  DocumentIcon,
  TrophyIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
} from '../components/Icons';

export default function ShowcaseLandingPage() {
  const data = getPublicShowcaseData();
  const metrics = calculateGrowthMetrics(data);

  const zenithGroup = data.scoreboard.find((g) => g.group_number === 5 || g.is_current_team);

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        {/* Geometric Background Wireframe Circles from Reference Design */}
        <div className="wireframe-circle-left" />
        <div className="wireframe-circle-right" />

        <div className="container" style={styles.heroContainer}>
          {/* Top Pill Announcement Badge */}
          <div className="hero-announcement-badge" style={{ marginBottom: '28px' }}>
            <span
              className="pulse-dot"
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#EC4899',
                display: 'inline-block',
                boxShadow: '0 0 8px #EC4899',
              }}
            />
            <span>✦ TEAM NO. 5 • COHORT STANDING: RANK 2 • 465 PTS</span>
          </div>

          {/* Hero Main Heading */}
          <h1 style={styles.heroTitle}>
            Engineering Excellence &amp;<br />
            Placement Cohort Leadership
          </h1>

          {/* Hero Subtitle */}
          <p style={styles.heroDesc}>
            Official Evaluator Showcase for <strong style={{ color: '#FFFFFF' }}>ZENITH (Team 5)</strong> in the mPOWER Placement Training Program. Certified 10-group leaderboard standing, Day 1 delivery, verified competencies, and genuine experiential reflections.
          </p>

          {/* Action Buttons: Gradient Pill + Glass Capsule */}
          <div style={styles.ctaRow}>
            <Link href="/present" className="pill-btn-gradient">
              <span>Enter Presentation Mode</span>
              <ArrowRightIcon size={16} color="#FFFFFF" />
            </Link>
            <Link href="/report" className="pill-btn-glass">
              <PlayIcon size={13} color="#C084FC" />
              <span>Executive Dossier (PDF)</span>
            </Link>
          </div>

          {/* 3 Metric Stat Cards (Matching Reference Layout) */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard} className="glass-panel">
              <div style={styles.statValue}>#{zenithGroup?.rank || 2}</div>
              <div style={styles.statLabel}>Cohort Standing (of 10 Groups)</div>
            </div>

            <div style={styles.statCard} className="glass-panel">
              <div style={styles.statValue}>{zenithGroup?.current_points || 465} <span style={styles.statUnit}>PTS</span></div>
              <div style={styles.statLabel}>Total Points (Audit Verified)</div>
            </div>

            <div style={styles.statCard} className="glass-panel">
              <div style={styles.statValue}>8 / 8</div>
              <div style={styles.statLabel}>Members • Day 1 Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Luminous Neon Purple Horizon Beam (Directly above the Scoreboard / Dashboard) */}
      <div className="horizon-glow-wrapper">
        <div className="horizon-bloom" />
        <div className="horizon-beam" />
      </div>

      {/* Main Content Sections */}
      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
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
        <section style={styles.closingSection} className="glass-panel">
          <div style={styles.closingHeader}>
            <div style={styles.closingPre}>TRAINING MASTERY</div>
            <h2 style={styles.closingTitle}>Genuine Lessons &amp; Future Placement Commitments</h2>
            <p style={styles.closingDesc}>Authentic experiential takeaways captured directly from team delivery.</p>
          </div>

          <div style={styles.closingGrid}>
            <div style={styles.closingCard}>
              <div style={styles.closingCardHeader}>
                <div style={styles.closingCardIcon}>
                  <StarIcon size={18} color="#FBBF24" />
                </div>
                <h3 style={styles.closingCardTitle}>Key Lessons from Day 1 Delivery</h3>
              </div>
              <ul style={styles.closingList}>
                <li>
                  <strong style={{ color: '#FFFFFF' }}>Speed Mathematics Discipline:</strong> Sectional aptitude under 60-second time boundaries requires systematic recognition of algebraic shortcuts rather than brute-force computation.
                </li>
                <li>
                  <strong style={{ color: '#FFFFFF' }}>Quantified Resume Articulation:</strong> Evaluator panels prioritize measurable business impact and problem scale over generic keyword lists.
                </li>
                <li>
                  <strong style={{ color: '#FFFFFF' }}>Operational Squad Synergy:</strong> Rapid consensus and structured turn-taking during group discussions generate higher cohort scores than aggressive dominance.
                </li>
              </ul>
            </div>

            <div style={styles.closingCard}>
              <div style={styles.closingCardHeader}>
                <div style={styles.closingCardIcon}>
                  <ShieldCheckIcon size={18} color="#F472B6" />
                </div>
                <h3 style={styles.closingCardTitle}>Forward Commitments for Days 2–4</h3>
              </div>
              <ul style={styles.closingList}>
                <li>
                  <strong style={{ color: '#FFFFFF' }}>Technical Rigor:</strong> Execute algorithmic coding rounds with strict attention to time and space complexity boundaries.
                </li>
                <li>
                  <strong style={{ color: '#FFFFFF' }}>Interview Confidence:</strong> Apply the STAR methodology in mock behavioral rounds with verified situational anecdotes.
                </li>
                <li>
                  <strong style={{ color: '#FFFFFF' }}>Podium Finish:</strong> Sustain Team 5&apos;s top-tier standing on the mPOWER competition leaderboard through rigorous peer coaching.
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
    paddingBottom: '80px',
    position: 'relative',
    overflow: 'hidden',
  },
  hero: {
    position: 'relative',
    padding: '70px 0 30px',
  },
  heroContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 'clamp(36px, 6vw, 62px)',
    fontWeight: '800',
    lineHeight: 1.14,
    maxWidth: '920px',
    marginBottom: '20px',
    letterSpacing: '-1.5px',
    textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
  },
  heroDesc: {
    color: '#A5A6C4',
    fontSize: 'clamp(15px, 2vw, 17px)',
    lineHeight: 1.65,
    maxWidth: '720px',
    marginBottom: '34px',
    fontWeight: '400',
  },
  ctaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '46px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '880px',
  },
  statCard: {
    padding: '24px 20px',
    textAlign: 'center',
    borderRadius: '20px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-1px',
    fontFamily: 'var(--font-mono)',
  },
  statUnit: {
    fontSize: '18px',
    color: '#F472B6',
    fontWeight: '700',
  },
  statLabel: {
    color: '#A5A6C4',
    fontSize: '13px',
    marginTop: '6px',
    fontWeight: '500',
  },
  section: {
    margin: '40px 0',
  },
  closingSection: {
    padding: '44px',
    borderRadius: '24px',
    margin: '64px 0 32px',
  },
  closingHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  closingPre: {
    color: '#F472B6',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    fontFamily: 'var(--font-mono)',
    marginBottom: '6px',
  },
  closingTitle: {
    color: '#FFFFFF',
    fontSize: '26px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  closingDesc: {
    color: '#A5A6C4',
    fontSize: '14px',
    marginTop: '6px',
  },
  closingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  closingCard: {
    backgroundColor: 'rgba(24, 14, 56, 0.6)',
    borderRadius: '16px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    padding: '28px',
  },
  closingCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px',
  },
  closingCardIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closingCardTitle: {
    color: '#FFFFFF',
    fontSize: '17px',
    fontWeight: '700',
  },
  closingList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    color: '#A5A6C4',
    fontSize: '13px',
    lineHeight: 1.6,
  },
};
