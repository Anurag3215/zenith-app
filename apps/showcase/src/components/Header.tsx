import React from 'react';
import Link from 'next/link';

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
              <span style={styles.teamTag}>TEAM NO. 5</span>
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
            <span>📄</span>
            <span>Report</span>
          </Link>
          <Link href="/present" style={styles.presentBtn}>
            <span>📽️</span>
            <span>Presentation</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: 'rgba(5, 8, 20, 0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1E3368',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#101C3D',
    border: '2px solid #2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)',
  },
  logoText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: '14px',
    letterSpacing: '1px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandName: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: '18px',
    letterSpacing: '1.5px',
  },
  teamTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#FBBF24',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: '700',
  },
  subBrand: {
    color: '#64748B',
    fontSize: '11px',
  },
  nav: {
    display: 'flex',
    gap: '24px',
  },
  navLink: {
    color: '#94A3B8',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  reportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    backgroundColor: '#101C3D',
    border: '1px solid #1E3368',
    color: '#F8FAFC',
    fontSize: '12px',
    fontWeight: '700',
  },
  presentBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '700',
    boxShadow: '0 0 14px rgba(37, 99, 235, 0.5)',
  },
};
