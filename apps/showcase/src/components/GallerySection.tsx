import React from 'react';
import { GalleryItem } from '@zenith/shared';
import { StarIcon } from './Icons';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBadge}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div>
            <div style={styles.pre}>VISUAL ARCHIVE</div>
            <h2 style={styles.title}>Showcase-Approved Milestones</h2>
          </div>
        </div>
        <div style={styles.sub}>
          Photographs capturing live cohort sprints, whiteboard architecture, and aptitude assessments.
        </div>
      </div>

      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item.id} style={styles.card} className="glass-panel">
            <div style={styles.mediaBox}>
              <div style={styles.mediaPlaceholderIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div style={styles.placeholderLabel}>Verified Training Moment</div>
              <div style={styles.featuredBadge}>
                <StarIcon size={11} color="#FBBF24" />
                <span>FEATURED</span>
              </div>
              {item.day_number ? (
                <div style={styles.dayBadge}>DAY 0{item.day_number}</div>
              ) : null}
            </div>

            <div style={styles.content}>
              <div style={styles.caption}>{item.caption}</div>
              <div style={styles.uploader}>Captured by {item.uploader_name}</div>
              <div style={styles.tagsRow}>
                {item.tags.map((t, idx) => (
                  <span key={idx} style={styles.tag}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '48px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '28px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  iconBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pre: {
    color: '#00F0FF',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    fontFamily: 'var(--font-mono)',
  },
  title: {
    color: '#F8FAFC',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.3px',
    marginTop: '2px',
  },
  sub: {
    color: '#94A3B8',
    fontSize: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  mediaBox: {
    height: '190px',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.95) 100%)',
  },
  mediaPlaceholderIcon: {
    marginBottom: '8px',
  },
  placeholderLabel: {
    color: '#64748B',
    fontSize: '11px',
    fontStyle: 'italic',
  },
  featuredBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    color: '#FBBF24',
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-mono)',
  },
  dayBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    border: '1px solid rgba(56, 189, 248, 0.35)',
    color: '#38BDF8',
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
  },
  content: {
    padding: '20px',
  },
  caption: {
    color: '#F8FAFC',
    fontSize: '14px',
    fontWeight: '700',
    lineHeight: 1.5,
    marginBottom: '8px',
  },
  uploader: {
    color: '#64748B',
    fontSize: '11px',
    marginBottom: '12px',
    fontFamily: 'var(--font-mono)',
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    color: '#38BDF8',
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '11px',
    fontWeight: '600',
    fontFamily: 'var(--font-mono)',
  },
};
