import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer} className="no-print">
      <div className="container" style={styles.inner}>
        <div style={styles.top}>
          <div>
            <div style={styles.brandRow}>
              <span style={styles.brand}>ZENITH</span>
              <span style={styles.badge}>TEAM NO. 05</span>
            </div>
            <div style={styles.subtext}>
              Official Showcase for the mPOWER Placement Training Program. Built with native cross-platform architecture and certified backend persistence.
            </div>
          </div>
          <div style={styles.disclaimerBox}>
            <div style={styles.disclaimerTitle}>AUTHENTICITY & INTEGRITY DISCLOSURE</div>
            <div style={styles.disclaimerText}>
              All accomplishments, scores, member competencies, and learning outcomes presented are verified from official cohort records. In strict accordance with institutional policy, unverified achievements and private contact credentials are omitted.
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <div style={styles.copyright}>
            © 2026 ZENITH — Team No. 5. Developed for Evaluator Review & Placement Assessment.
          </div>
          <div style={styles.links}>
            <span style={styles.metaBadge}>Zero-Trust RLS</span>
            <span style={styles.metaBadge}>Realtime CDC</span>
            <span style={styles.metaBadge}>1224 Tie Logic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#070318',
    borderTop: '1px solid rgba(168, 85, 247, 0.2)',
    padding: '56px 0 36px',
    marginTop: '80px',
    position: 'relative',
    zIndex: 1,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
  },
  top: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '36px',
    alignItems: 'start',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  brand: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '18px',
    letterSpacing: '1px',
  },
  badge: {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)',
    color: '#FBBF24',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.6px',
    fontFamily: 'var(--font-mono)',
  },
  subtext: {
    color: '#A5A6C4',
    fontSize: '13px',
    lineHeight: 1.6,
    maxWidth: '520px',
  },
  disclaimerBox: {
    backgroundColor: 'rgba(22, 12, 52, 0.65)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '14px',
    padding: '20px',
  },
  disclaimerTitle: {
    color: '#F472B6',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '8px',
    fontFamily: 'var(--font-mono)',
  },
  disclaimerText: {
    color: '#71719A',
    fontSize: '12px',
    lineHeight: 1.6,
  },
  bottom: {
    borderTop: '1px solid rgba(168, 85, 247, 0.15)',
    paddingTop: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  copyright: {
    color: '#71719A',
    fontSize: '12px',
  },
  links: {
    display: 'flex',
    gap: '8px',
  },
  metaBadge: {
    backgroundColor: 'rgba(28, 16, 60, 0.6)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    color: '#E9D5FF',
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
  },
};
