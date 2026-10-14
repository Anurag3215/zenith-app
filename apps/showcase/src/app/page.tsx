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
} from '../components/Icons';

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
            <div style={styles.heroBadge}>
              <span style={styles.liveDot} className="pulse-dot" />
              <span>TEAM NO. 5 • COHORT STANDING: RANK 2</span>
            </div>
            <div style={styles.verifiedTag}>
              <ShieldCheckIcon size={14} color="#10B981" />
              <span>Certified Placement Data</span>
            </div>
          </div>

          <h1 style={styles.heroTitle}>
            Engineering Excellence, Rigorous Preparation & <span className="gradient-text-cyan">Placement Leadership</span>
          </h1>

          <p style={styles.heroDesc}>
            Welcome to the official public presentation portal for <strong style={{ color: '#F8FAFC' }}>ZENITH (Team 5)</strong> in the mPOWER Placement Training Program. Inspect verified curriculum delivery, our verified Rank 2 leaderboard standing, individual member competencies, and genuine experiential reflections.
          </p>

          <div style={styles.ctaRow}>
            <Link href="/present" style={styles.ctaPrimary}>
              <PresentationIcon size={16} color="#FFFFFF" />
              <span>ENTER PRESENTATION MODE</span>
            </Link>
            <Link href="/report" style={styles.ctaSecondary}>
              <DocumentIcon size={16} color="#94A3B8" />
              <span>EXECUTIVE DOSSIER (PDF)</span>
            </Link>
            <Link href="/#scoreboard" style={styles.ctaOutline}>
              <TrophyIcon size={16} color="#FBBF24" />
              <span>LEADERBOARD STANDINGS</span>
            </Link>
          </div>

          {/* Quick Metrics Floating Bar */}
          <div style={styles.quickBar} className="glass-panel">
            <div style={styles.quickMetric}>
              <div style={styles.quickValue} className="gradient-text-gold">#{zenithGroup?.rank || 2}</div>
              <div style={styles.quickLabel}>COHORT RANK</div>
            </div>
            <div style={styles.quickDivider} />
            <div style={styles.quickMetric}>
              <div style={styles.quickValue} className="gradient-text-cyan">{zenithGroup?.current_points || 465}</div>
              <div style={styles.quickLabel}>TOTAL POINTS</div>
            </div>
            <div style={styles.quickDivider} />
            <div style={styles.quickMetric}>
              <div style={styles.quickValue}>8</div>
              <div style={styles.quickLabel}>CANDIDATES</div>
            </div>
            <div style={styles.quickDivider} />
            <div style={styles.quickMetric}>
              <div style={styles.quickValue}>1 <span style={{ fontSize: '14px', color: '#64748B' }}>/ 4</span></div>
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
        <section style={styles.closingSection} className="glass-panel">
          <div style={styles.closingHeader}>
            <div style={styles.closingPre}>TRAINING MASTERY</div>
            <h2 style={styles.closingTitle}>Genuine Lessons & Future Placement Commitments</h2>
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
                  <strong style={{ color: '#F8FAFC' }}>Speed Mathematics Discipline:</strong> Sectional aptitude under 60-second time boundaries requires systematic recognition of algebraic shortcuts rather than brute-force computation.
                </li>
                <li>
                  <strong style={{ color: '#F8FAFC' }}>Quantified Resume Articulation:</strong> Evaluator panels prioritize measurable business impact and problem scale over generic keyword lists.
                </li>
                <li>
                  <strong style={{ color: '#F8FAFC' }}>Operational Squad Synergy:</strong> Rapid consensus and structured turn-taking during group discussions generate higher cohort scores than aggressive dominance.
                </li>
              </ul>
            </div>

            <div style={styles.closingCard}>
              <div style={styles.closingCardHeader}>
                <div style={styles.closingCardIcon}>
                  <ShieldCheckIcon size={18} color="#00F0FF" />
                </div>
                <h3 style={styles.closingCardTitle}>Forward Commitments for Days 2–4</h3>
              </div>
              <ul style={styles.closingList}>
                <li>
                  <strong style={{ color: '#F8FAFC' }}>Technical Rigor:</strong> Execute algorithmic coding rounds with strict attention to time and space complexity boundaries.
                </li>
                <li>
                  <strong style={{ color: '#F8FAFC' }}>Interview Confidence:</strong> Apply the STAR methodology in mock behavioral rounds with verified situational anecdotes.
                </li>
                <li>
                  <strong style={{ color: '#F8FAFC' }}>Podium Finish:</strong> Sustain Team 5&apos;s top-tier standing on the mPOWER competition leaderboard through rigorous peer coaching.
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
  },
  hero: {
    padding: '80px 0 60px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: '48px',
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
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    color: '#FBBF24',
    borderRadius: '24px',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-mono)',
  },
  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#FBBF24',
    boxShadow: '0 0 8px #FBBF24',
  },
  verifiedTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    color: '#10B981',
    borderRadius: '24px',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  heroTitle: {
    color: '#F8FAFC',
    fontSize: 'clamp(32px, 5.5vw, 54px)',
    fontWeight: '800',
    lineHeight: 1.15,
    maxWidth: '960px',
    marginBottom: '20px',
    letterSpacing: '-1px',
  },
  heroDesc: {
    color: '#94A3B8',
    fontSize: 'clamp(15px, 2vw, 17px)',
    lineHeight: 1.7,
    maxWidth: '820px',
    marginBottom: '36px',
  },
  ctaRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '48px',
  },
  ctaPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '13px',
    padding: '14px 26px',
    borderRadius: '12px',
    boxShadow: '0 6px 24px rgba(37, 99, 235, 0.4)',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease',
  },
  ctaSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: '13px',
    padding: '14px 24px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease',
  },
  ctaOutline: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    color: '#FBBF24',
    fontWeight: '700',
    fontSize: '13px',
    padding: '14px 22px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease',
  },
  quickBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '36px',
    padding: '20px 48px',
    borderRadius: '20px',
    flexWrap: 'wrap',
  },
  quickMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  quickValue: {
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-1px',
    fontFamily: 'var(--font-mono)',
  },
  quickLabel: {
    color: '#64748B',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginTop: '4px',
    fontFamily: 'var(--font-mono)',
  },
  quickDivider: {
    width: '1px',
    height: '36px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  section: {
    margin: '48px 0',
  },
  closingSection: {
    padding: '40px',
    borderRadius: '24px',
    margin: '64px 0 32px',
  },
  closingHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  closingPre: {
    color: '#00F0FF',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    fontFamily: 'var(--font-mono)',
    marginBottom: '6px',
  },
  closingTitle: {
    color: '#F8FAFC',
    fontSize: '26px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  closingDesc: {
    color: '#94A3B8',
    fontSize: '14px',
    marginTop: '6px',
  },
  closingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  closingCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closingCardTitle: {
    color: '#F8FAFC',
    fontSize: '17px',
    fontWeight: '700',
  },
  closingList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    color: '#94A3B8',
    fontSize: '13px',
    lineHeight: 1.6,
  },
};
