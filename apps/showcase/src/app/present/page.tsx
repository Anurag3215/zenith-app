'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getPublicShowcaseData } from '../../lib/publicData';
import { calculateGrowthMetrics } from '../../lib/metrics';
import { PresentationIcon } from '../../components/Icons';

export default function PresentationModePage() {
  const [slide, setSlide] = useState<number>(1);
  const totalSlides = 5;

  const data = getPublicShowcaseData();
  const metrics = calculateGrowthMetrics(data);
  const zenithGroup = data.scoreboard.find((g) => g.group_number === 5 || g.is_current_team);

  const nextSlide = useCallback(() => {
    setSlide((curr) => (curr < totalSlides ? curr + 1 : curr));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setSlide((curr) => (curr > 1 ? curr - 1 : curr));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div style={styles.presentationWrapper}>
      {/* Top Animated Progress Bar */}
      <div style={{ height: '3px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div
          style={{
            height: '100%',
            width: `${(slide / totalSlides) * 100}%`,
            background: 'linear-gradient(90deg, #2563EB 0%, #00F0FF 100%)',
            boxShadow: '0 0 10px #00F0FF',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Top Bar Navigation */}
      <div style={styles.topBar}>
        <Link href="/" style={styles.returnBtn}>
          <span>←</span>
          <span>RETURN TO OVERVIEW</span>
        </Link>

        <div style={styles.presentationTag}>
          <PresentationIcon size={14} color="#00F0FF" />
          <span>PROJECTOR PRESENTATION MODE</span>
          <span style={styles.slideCounter}>
            SLIDE {slide} OF {totalSlides}
          </span>
        </div>

        <div style={styles.slideNavControls}>
          <button
            onClick={prevSlide}
            disabled={slide === 1}
            style={{
              ...styles.navBtn,
              opacity: slide === 1 ? 0.3 : 1,
            }}
            aria-label="Previous Slide"
          >
            PREV
          </button>
          <button
            onClick={nextSlide}
            disabled={slide === totalSlides}
            style={{
              ...styles.navBtn,
              ...styles.navBtnPrimary,
              opacity: slide === totalSlides ? 0.3 : 1,
            }}
            aria-label="Next Slide"
          >
            NEXT
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div style={styles.canvas}>
        {/* SLIDE 1: Executive Overview */}
        {slide === 1 && (
          <div style={styles.slideContent}>
            <div style={styles.slideCategory}>EXECUTIVE OVERVIEW • SLIDE 01</div>
            <h1 style={styles.slideHeading}>ZENITH — Team No. 5</h1>
            <p style={styles.slideSubhead}>
              mPOWER Placement Training Program • Evaluator Executive Briefing
            </p>

            <div style={styles.overviewGrid}>
              <div style={styles.overviewCard}>
                <div style={styles.cardHeaderSmall}>CURRENT COHORT STANDING</div>
                <div style={styles.heroNumber}>RANK 2</div>
                <div style={styles.heroMeta}>465 Verified Scoreboard Points</div>
              </div>

              <div style={styles.overviewCard}>
                <div style={styles.cardHeaderSmall}>ROSTER COMPOSITION</div>
                <div style={styles.heroNumber}>8 MEMBERS</div>
                <div style={styles.heroMeta}>Zero Public Signup • Strict RBAC Segregation</div>
              </div>

              <div style={styles.overviewCard}>
                <div style={styles.cardHeaderSmall}>CURRICULUM STATUS</div>
                <div style={styles.heroNumber}>DAY 01</div>
                <div style={styles.heroMeta}>Completed with Certified Placement Outcomes</div>
              </div>
            </div>

            <div style={styles.coreMissionBox}>
              <div style={styles.coreMissionTitle}>MISSION OBJECTIVE</div>
              <div style={styles.coreMissionText}>
                To combine analytical speed, modern full-stack systems engineering, and disciplined peer leadership into consistent top-tier performance during the competitive placement training cohort.
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: Candidate Roster */}
        {slide === 2 && (
          <div style={styles.slideContent}>
            <div style={styles.slideCategory}>AUTHORIZED ROSTER • SLIDE 02</div>
            <h1 style={styles.slideHeading}>Team No. 5 Candidate Roster</h1>
            <p style={styles.slideSubhead}>
              8 Authorized Member Accounts with Enforced Role Separation
            </p>

            <div style={styles.rosterGridSlide}>
              {data.roster.map((m) => (
                <div key={m.id} style={styles.rosterSlideCard}>
                  <div style={styles.rosterSlideHeader}>
                    <span style={styles.rosterSlideName}>{m.full_name}</span>
                    <span style={styles.rosterSlideRole}>
                      {m.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div style={styles.rosterSlideSkills}>
                    {m.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} style={styles.skillPillSlide}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.securityCallout}>
              🛡 <strong>Security Architecture:</strong> Role segregation guarantees that Team Admin manages configuration and auditing, while Scoreboard mutations are strictly restricted to Captain and Vice-Captain credentials.
            </div>
          </div>
        )}

        {/* SLIDE 3: 4-Day Journey */}
        {slide === 3 && (
          <div style={styles.slideContent}>
            <div style={styles.slideCategory}>CURRICULUM TIMELINE • SLIDE 03</div>
            <h1 style={styles.slideHeading}>Four-Day Training Journey</h1>
            <p style={styles.slideSubhead}>
              Real Program Delivery: Day 1 Completed; Days 2–4 Awaiting Faculty Delivery
            </p>

            <div style={styles.journeySlideGrid}>
              {data.trainingDays.map((d) => {
                const isDone = d.status === 'completed';
                return (
                  <div
                    key={d.id}
                    style={{
                      ...styles.journeySlideCard,
                      ...(isDone ? styles.journeySlideCardDone : {}),
                    }}
                  >
                    <div style={styles.journeySlideTop}>
                      <span style={styles.journeySlideDay}>DAY 0{d.day_number}</span>
                      <span
                        style={{
                          ...styles.journeySlideStatus,
                          color: isDone ? '#10B981' : '#FBBF24',
                        }}
                      >
                        {isDone ? '✓ COMPLETED' : '⏳ UPCOMING'}
                      </span>
                    </div>
                    <div style={styles.journeySlideTitle}>{d.title}</div>
                    <div style={styles.journeySlideDesc}>{d.description}</div>

                    {isDone && d.learning_outcomes ? (
                      <div style={styles.journeySlideOutcomes}>
                        <div style={styles.outcomesHeader}>VERIFIED OUTCOMES:</div>
                        {d.learning_outcomes.slice(0, 2).map((o, idx) => (
                          <div key={idx} style={styles.outcomeLine}>
                            ✓ {o}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={styles.journeySlidePending}>
                        [Content will populate upon live session delivery]
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SLIDE 4: Live Scoreboard */}
        {slide === 4 && (
          <div style={styles.slideContent}>
            <div style={styles.slideCategory}>LIVE STANDINGS • SLIDE 04</div>
            <h1 style={styles.slideHeading}>Official mPOWER Scoreboard</h1>
            <p style={styles.slideSubhead}>
              Rank 2 Placement • Certified 1224 Competition Tie Policy
            </p>

            <div style={styles.scoreboardSlideBox}>
              <div style={styles.zenithHighlightBanner}>
                <div>
                  <span style={styles.highlightBadge}>OUR SQUAD STANDING</span>
                  <div style={styles.highlightName}>ZENITH (Team 5) — Group 05</div>
                </div>
                <div style={styles.highlightScores}>
                  <div style={styles.highlightRank}>RANK 2</div>
                  <div style={styles.highlightPoints}>465 PTS (+50 Bonus)</div>
                </div>
              </div>

              <div style={styles.compactLeaderboard}>
                {data.scoreboard.slice(0, 5).map((grp) => (
                  <div
                    key={grp.id}
                    style={{
                      ...styles.compactRow,
                      ...(grp.group_number === 5 ? styles.compactRowActive : {}),
                    }}
                  >
                    <span style={styles.compactRank}>
                      {grp.rank === 1 ? '🥇' : grp.rank === 2 ? '🥈' : grp.rank === 3 ? '🥉' : `#${grp.rank}`}
                    </span>
                    <span style={styles.compactName}>{grp.group_name}</span>
                    <span style={styles.compactPts}>{grp.current_points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: Reflections & Commitments */}
        {slide === 5 && (
          <div style={styles.slideContent}>
            <div style={styles.slideCategory}>RETROSPECTIVE & NEXT STEPS • SLIDE 05</div>
            <h1 style={styles.slideHeading}>Reflections & Placement Commitments</h1>
            <p style={styles.slideSubhead}>
              Key Insights from Placement Sprints and Forward Milestones
            </p>

            <div style={styles.retrospectiveGrid}>
              <div style={styles.retroCard}>
                <div style={styles.retroTitle}>💡 Core Insights Mastered</div>
                <ul style={styles.retroList}>
                  <li>
                    Speed arithmetic patterns eliminate computational lag during 60-second aptitude questions.
                  </li>
                  <li>
                    Articulating engineering solutions in quantifiable business impact metrics dramatically elevates evaluator scoring.
                  </li>
                  <li>
                    Squad-wide peer reviews ensure all 8 candidates maintain synchronized technical proficiency.
                  </li>
                </ul>
              </div>

              <div style={styles.retroCard}>
                <div style={styles.retroTitle}>🎯 Forward Commitments</div>
                <ul style={styles.retroList}>
                  <li>
                    Day 2: Demonstrate production-grade time complexity in competitive programming rounds.
                  </li>
                  <li>
                    Day 3: Model concise STAR communication in technical interview simulations.
                  </li>
                  <li>
                    Day 4: Secure final cohort placement certification on the mPOWER scoreboard podium.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Dots */}
      <div style={styles.slideFooter}>
        <div style={styles.dotsRow}>
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx + 1)}
              style={{
                ...styles.dot,
                ...(slide === idx + 1 ? styles.dotActive : {}),
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div style={styles.keyboardTip}>
          Tip: Use <kbd style={styles.kbd}>←</kbd> and <kbd style={styles.kbd}>→</kbd> arrows or spacebar to navigate slides
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  presentationWrapper: {
    minHeight: '100vh',
    backgroundColor: '#050814',
    color: '#F8FAFC',
    display: 'flex',
    flexDirection: 'column',
  },
  topBar: {
    height: '64px',
    backgroundColor: '#0A1128',
    borderBottom: '1px solid #1E3368',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  },
  returnBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#38BDF8',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  presentationTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#94A3B8',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
  },
  slideCounter: {
    backgroundColor: '#1C2E60',
    color: '#FBBF24',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '800',
  },
  slideNavControls: {
    display: 'flex',
    gap: '8px',
  },
  navBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#F8FAFC',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
  },
  navBtnPrimary: {
    background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    color: '#FFFFFF',
    boxShadow: '0 0 14px rgba(37, 99, 235, 0.4)',
  },
  canvas: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
  },
  slideContent: {
    maxWidth: '1100px',
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '48px',
    boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7)',
  },
  slideCategory: {
    color: '#06B6D4',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    marginBottom: '8px',
  },
  slideHeading: {
    color: '#F8FAFC',
    fontSize: 'clamp(28px, 4vw, 42px)',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  slideSubhead: {
    color: '#94A3B8',
    fontSize: '16px',
    marginBottom: '32px',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  overviewCard: {
    backgroundColor: '#1C2E60',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(45, 75, 148, 0.5)',
  },
  cardHeaderSmall: {
    color: '#06B6D4',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '8px',
  },
  heroNumber: {
    color: '#FBBF24',
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '4px',
  },
  heroMeta: {
    color: '#CBD5E1',
    fontSize: '12px',
  },
  coreMissionBox: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    border: '1px solid rgba(37, 99, 235, 0.35)',
    borderRadius: '12px',
    padding: '20px',
  },
  coreMissionTitle: {
    color: '#38BDF8',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '4px',
  },
  coreMissionText: {
    color: '#E2E8F0',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  rosterGridSlide: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  rosterSlideCard: {
    backgroundColor: '#1C2E60',
    borderRadius: '10px',
    padding: '12px 16px',
    border: '1px solid rgba(45, 75, 148, 0.4)',
  },
  rosterSlideHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  rosterSlideName: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: '13px',
  },
  rosterSlideRole: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#FBBF24',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '800',
  },
  rosterSlideSkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  skillPillSlide: {
    backgroundColor: '#101C3D',
    color: '#38BDF8',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: '600',
  },
  securityCallout: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '12px',
    color: '#E2E8F0',
  },
  journeySlideGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  journeySlideCard: {
    backgroundColor: '#1C2E60',
    borderRadius: '12px',
    padding: '18px',
    border: '1px solid rgba(45, 75, 148, 0.4)',
  },
  journeySlideCardDone: {
    borderLeft: '4px solid #10B981',
  },
  journeySlideTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  journeySlideDay: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: '11px',
  },
  journeySlideStatus: {
    fontSize: '10px',
    fontWeight: '800',
  },
  journeySlideTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: '13px',
    marginBottom: '6px',
  },
  journeySlideDesc: {
    color: '#94A3B8',
    fontSize: '11px',
    lineHeight: 1.5,
    marginBottom: '10px',
  },
  journeySlideOutcomes: {
    backgroundColor: '#101C3D',
    borderRadius: '6px',
    padding: '8px',
    fontSize: '10px',
  },
  outcomesHeader: {
    color: '#10B981',
    fontWeight: '800',
    marginBottom: '4px',
  },
  outcomeLine: {
    color: '#CBD5E1',
    marginBottom: '2px',
  },
  journeySlidePending: {
    color: '#64748B',
    fontSize: '10px',
    fontStyle: 'italic',
  },
  scoreboardSlideBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  zenithHighlightBanner: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    border: '1px solid #2563EB',
    borderRadius: '14px',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  highlightBadge: {
    color: '#06B6D4',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
  },
  highlightName: {
    color: '#F8FAFC',
    fontSize: '20px',
    fontWeight: '800',
    marginTop: '2px',
  },
  highlightScores: {
    textAlign: 'right',
  },
  highlightRank: {
    color: '#FBBF24',
    fontSize: '24px',
    fontWeight: '800',
  },
  highlightPoints: {
    color: '#38BDF8',
    fontSize: '13px',
    fontWeight: '700',
  },
  compactLeaderboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  compactRow: {
    backgroundColor: '#1C2E60',
    borderRadius: '8px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
    border: '1px solid rgba(45, 75, 148, 0.3)',
  },
  compactRowActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    border: '1px solid #2563EB',
  },
  compactRank: {
    width: '40px',
    fontWeight: '800',
  },
  compactName: {
    flex: 1,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  compactPts: {
    fontWeight: '800',
    color: '#FBBF24',
  },
  retrospectiveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  retroCard: {
    backgroundColor: '#1C2E60',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(45, 75, 148, 0.5)',
  },
  retroTitle: {
    color: '#FBBF24',
    fontSize: '16px',
    fontWeight: '800',
    marginBottom: '14px',
  },
  retroList: {
    paddingLeft: '18px',
    color: '#CBD5E1',
    fontSize: '13px',
    lineHeight: 1.7,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  slideFooter: {
    height: '60px',
    backgroundColor: '#0A1128',
    borderTop: '1px solid #1E3368',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  },
  dotsRow: {
    display: 'flex',
    gap: '8px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#1E3368',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  dotActive: {
    backgroundColor: '#2563EB',
    boxShadow: '0 0 8px rgba(37, 99, 235, 0.6)',
  },
  keyboardTip: {
    color: '#64748B',
    fontSize: '11px',
  },
  kbd: {
    backgroundColor: '#1C2E60',
    color: '#F8FAFC',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: 'monospace',
    border: '1px solid #2D4B94',
  },
};
