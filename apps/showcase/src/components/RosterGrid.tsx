import React from 'react';
import { PublicProfile } from '../lib/publicData';

interface RosterGridProps {
  roster: PublicProfile[];
}

export const RosterGrid: React.FC<RosterGridProps> = ({ roster }) => {
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'team_admin':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.4)', label: 'TEAM ADMIN' };
      case 'captain':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.4)', label: 'CAPTAIN' };
      case 'vice_captain':
        return { bg: 'rgba(6, 182, 212, 0.15)', text: '#22D3EE', border: 'rgba(6, 182, 212, 0.4)', label: 'VICE-CAPTAIN' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.12)', text: '#CBD5E1', border: 'rgba(148, 163, 184, 0.3)', label: 'MEMBER' };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.pre}>TEAM REPOSITORY</div>
          <h2 style={styles.title}>Team No. 5 Candidate Roster</h2>
        </div>
        <div style={styles.badgeInfo}>
          <span>8 Verified Member Accounts • Operational Role Segregation</span>
        </div>
      </div>

      <div style={styles.grid}>
        {roster.map((member) => {
          const badge = getRoleBadgeStyle(member.role);
          const initials = member.full_name.slice(0, 2).toUpperCase();

          return (
            <div key={member.id} style={styles.card}>
              <div style={styles.topRow}>
                <div style={styles.avatar}>
                  <span style={styles.avatarText}>{initials}</span>
                </div>
                <div style={styles.nameBlock}>
                  <div style={styles.name}>{member.full_name}</div>
                  <div
                    style={{
                      ...styles.roleBadge,
                      backgroundColor: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    {badge.label}
                  </div>
                </div>
              </div>

              <div style={styles.bio}>
                {member.bio || '[Official Biography Pending Institutional Verification]'}
              </div>

              <div style={styles.skillsBlock}>
                <div style={styles.skillsLabel}>VERIFIED SKILLS & COMPETENCIES:</div>
                <div style={styles.skillsRow}>
                  {member.skills.map((s, idx) => (
                    <span key={idx} style={styles.skillPill}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.footerRow}>
                <div style={styles.privacyNote}>
                  <span>🔒 Contact details restricted to private cohort workspace</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '32px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
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
  badgeInfo: {
    color: '#94A3B8',
    fontSize: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#101C3D',
    borderRadius: '16px',
    border: '1px solid #1E3368',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#1C2E60',
    border: '2px solid #2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: '15px',
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    color: '#F8FAFC',
    fontSize: '14px',
    fontWeight: '800',
    marginBottom: '4px',
  },
  roleBadge: {
    display: 'inline-block',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.6px',
  },
  bio: {
    color: '#94A3B8',
    fontSize: '11px',
    lineHeight: 1.5,
    fontStyle: 'italic',
    marginBottom: '16px',
    flex: 1,
  },
  skillsBlock: {
    marginBottom: '16px',
  },
  skillsLabel: {
    color: '#06B6D4',
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  },
  skillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillPill: {
    backgroundColor: '#1C2E60',
    color: '#38BDF8',
    borderRadius: '6px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: '600',
    border: '1px solid rgba(45, 75, 148, 0.5)',
  },
  footerRow: {
    borderTop: '1px solid rgba(30, 51, 104, 0.4)',
    paddingTop: '10px',
  },
  privacyNote: {
    color: '#64748B',
    fontSize: '10px',
  },
};
