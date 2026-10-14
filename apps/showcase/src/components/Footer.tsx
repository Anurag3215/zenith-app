import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer} className="no-print">
      <div className="container" style={styles.inner}>
        <div style={styles.top}>
          <div>
            <div style={styles.brand}>ZENITH • TEAM NO. 5</div>
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
            <span>Security Model: Zero-Trust RLS</span>
            <span>•</span>
            <span>Realtime Engine: PostgreSQL CDC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#050814',
    borderTop: '1px solid #1E3368',
    padding: '48px 0 32px',
    marginTop: '64px',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  top: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  brand: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: '14px',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  subtext: {
    color: '#94A3B8',
    fontSize: '12px',
    lineHeight: 1.6,
    maxWidth: '480px',
  },
  disclaimerBox: {
    backgroundColor: 'rgba(16, 28, 61, 0.5)',
    border: '1px solid #1E3368',
    borderRadius: '10px',
    padding: '16px',
  },
  disclaimerTitle: {
    color: '#FBBF24',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  },
  disclaimerText: {
    color: '#64748B',
    fontSize: '11px',
    lineHeight: 1.5,
  },
  bottom: {
    borderTop: '1px solid rgba(30, 51, 104, 0.4)',
    paddingTop: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '12px',
  },
  copyright: {
    color: '#64748B',
    fontSize: '11px',
  },
  links: {
    color: '#64748B',
    fontSize: '11px',
    display: 'flex',
    gap: '8px',
  },
};
