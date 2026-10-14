import React from 'react';
import Link from 'next/link';
import { PresentationIcon, DocumentIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header style={styles.header} className="no-print">
      <div className="container" style={styles.inner}>
        <Link href="/" style={styles.brand}>
          <div style={styles.logoBadge}>
            <span style={styles.logoText}>Z5</span>
          </div>
          <div>
            <div style={styles.titleRow}>
              <span style={styles.brandName}>ZENITH</span>
              <span style={styles.teamTag}>TEAM 05</span>
            </div>
            <div style={styles.subBrand}>mPOWER Placement Training Program</div>
          </div>
        </Link>

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
        </nav>

        <div style={styles.actionGroup}>
          <Link href="/report" style={styles.reportBtn}>
            <DocumentIcon size={15} color="#94A3B8" />
            <span>Executive Dossier</span>
          </Link>
          <Link href="/present" style={styles.presentBtn}>
            <PresentationIcon size={15} color="#FFFFFF" />
            <span>Presentation</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: 'rgba(3, 7, 18, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'all 0.2s ease',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '74px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px -3px rgba(56, 189, 248, 0.3)',
  },
  logoText: {
    background: 'linear-gradient(135deg, #38BDF8 0%, #00F0FF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    fontSize: '15px',
    letterSpacing: '1px',
    fontFamily: 'var(--font-mono)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandName: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: '19px',
    letterSpacing: '1px',
  },
  teamTag: {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)',
    color: '#FBBF24',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  subBrand: {
    color: '#64748B',
    fontSize: '11px',
    fontWeight: '500',
    marginTop: '1px',
  },
  nav: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
  },
  navLink: {
    color: '#94A3B8',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'color 0.15s ease',
  },
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  reportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 16px',
    borderRadius: '10px',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#F8FAFC',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  presentBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '700',
    boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
    transition: 'all 0.2s ease',
  },
};
