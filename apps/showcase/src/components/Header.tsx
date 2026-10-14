import React from 'react';
import Link from 'next/link';
import { PresentationIcon, DocumentIcon, SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header style={styles.headerWrapper} className="no-print">
      <div style={styles.capsule}>
        {/* Brand / Logo */}
        <Link href="/" style={styles.brand}>
          <div style={styles.logoBadge}>
            <SparklesIcon size={16} color="#C084FC" />
          </div>
          <div style={styles.brandTitleGroup}>
            <span style={styles.brandName}>ZENITH</span>
            <span style={styles.teamPill}>05</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav style={styles.nav}>
          <Link href="/#scoreboard" style={styles.navLink}>
            Scoreboard
          </Link>
          <Link href="/#journey" style={styles.navLink}>
            Journey
          </Link>
          <Link href="/#roster" style={styles.navLink}>
            Roster
          </Link>
          <Link href="/#growth" style={styles.navLink}>
            Growth
          </Link>
          <Link href="/#gallery" style={styles.navLink}>
            Gallery
          </Link>
          <Link href="/#reflections" style={styles.navLink}>
            Reflections
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={styles.actionGroup}>
          <Link href="/report" style={styles.dossierBtn}>
            <DocumentIcon size={14} color="#A5A6C4" />
            <span>Dossier</span>
          </Link>
          <Link href="/present" style={styles.presentBtn}>
            <span>Presentation</span>
            <span style={{ fontSize: '13px' }}>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  headerWrapper: {
    position: 'sticky',
    top: '16px',
    zIndex: 100,
    width: '100%',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  capsule: {
    pointerEvents: 'auto',
    width: '100%',
    maxWidth: '1060px',
    height: '62px',
    backgroundColor: 'rgba(18, 10, 40, 0.75)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderRadius: '9999px',
    border: '1px solid rgba(168, 85, 247, 0.28)',
    boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px 0 20px',
    transition: 'all 0.2s ease',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoBadge: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px -2px rgba(168, 85, 247, 0.4)',
  },
  brandTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  brandName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '17px',
    letterSpacing: '0.8px',
  },
  teamPill: {
    background: 'rgba(168, 85, 247, 0.2)',
    border: '1px solid rgba(168, 85, 247, 0.35)',
    color: '#E9D5FF',
    borderRadius: '9999px',
    padding: '1px 7px',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  nav: {
    display: 'flex',
    gap: '22px',
    alignItems: 'center',
  },
  navLink: {
    color: '#A5A6C4',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.15s ease',
    textDecoration: 'none',
  },
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dossierBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(28, 16, 60, 0.6)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    color: '#E2E8F0',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  presentBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    borderRadius: '9999px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 2px 18px rgba(139, 92, 246, 0.5)',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
};
