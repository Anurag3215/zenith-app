import React from 'react';
import { GalleryItem } from '@zenith/shared';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.pre}>VISUAL ARCHIVE</div>
          <h2 style={styles.title}>Showcase-Approved Milestones</h2>
        </div>
        <div style={styles.sub}>
          Photographs capturing live cohort sprints, whiteboard design, and aptitude assessments.
        </div>
      </div>

      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.mediaBox}>
              <div style={styles.icon}>📷</div>
              <div style={styles.placeholderLabel}>Verified Training Moment</div>
              <div style={styles.featuredBadge}>★ SHOWCASE FEATURED</div>
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
    margin: '32px 0',
  },
  header: {
    marginBottom: '20px',
  },
  pre: {
    color: '#06B6D4',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1px',
  },
  title: {
    color: '#F8FAFC',
    fontSize: '22px',
    fontWeight: '800',
    marginTop: '2px',
  },
  sub: {
    color: '#94A3B8',
    fontSize: '12px',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#101C3D',
    borderRadius: '16px',
    border: '1px solid #1E3368',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  mediaBox: {
    height: '180px',
    backgroundColor: '#1C2E60',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: '1px solid #1E3368',
  },
  icon: {
    fontSize: '36px',
    marginBottom: '6px',
  },
  placeholderLabel: {
    color: '#94A3B8',
    fontSize: '11px',
    fontStyle: 'italic',
  },
  featuredBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    border: '1px solid #FBBF24',
    color: '#FBBF24',
    borderRadius: '20px',
    padding: '3px 8px',
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  dayBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#101C3D',
    border: '1px solid #06B6D4',
    color: '#38BDF8',
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '9px',
    fontWeight: '800',
  },
  content: {
    padding: '16px',
  },
  caption: {
    color: '#F8FAFC',
    fontSize: '13px',
    fontWeight: '700',
    lineHeight: 1.5,
    marginBottom: '6px',
  },
  uploader: {
    color: '#64748B',
    fontSize: '11px',
    marginBottom: '10px',
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    backgroundColor: '#1C2E60',
    color: '#38BDF8',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: '600',
  },
};
