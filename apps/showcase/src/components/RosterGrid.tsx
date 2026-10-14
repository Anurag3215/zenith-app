import React from 'react';
import { PublicProfile } from '../lib/publicData';
import { UsersIcon, LockIcon } from './Icons';

interface RosterGridProps {
  roster: PublicProfile[];
}

export const RosterGrid: React.FC<RosterGridProps> = ({ roster }) => {
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'team_admin':
        return {
          bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
          text: '#E9D5FF',
          border: 'rgba(168, 85, 247, 0.45)',
          label: 'TEAM ADMIN',
        };
      case 'captain':
        return {
          bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)',
          text: '#FBBF24',
          border: 'rgba(245, 158, 11, 0.45)',
          label: 'CAPTAIN',
        };
      case 'vice_captain':
        return {
          bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(244, 114, 182, 0.15) 100%)',
          text: '#F472B6',
          border: 'rgba(236, 72, 153, 0.45)',
          label: 'VICE-CAPTAIN',
        };
      default:
        return {
          bg: 'rgba(28, 16, 60, 0.6)',
          text: '#A5A6C4',
          border: 'rgba(168, 85, 247, 0.25)',
          label: 'MEMBER',
        };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBadge}>
            <UsersIcon size={22} color="#00F0FF" />
          </div>
          <div>
            <div style={styles.pre}>TEAM REPOSITORY</div>
            <h2 style={styles.title}>Team No. 5 Candidate Roster</h2>
          </div>
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
            <div key={member.id} style={styles.card} className="glass-panel">
              <div style={styles.topRow}>
                <div style={styles.avatar}>
                  <span style={styles.avatarText}>{initials}</span>
                </div>
                <div style={styles.nameBlock}>
                  <div style={styles.name}>{member.full_name}</div>
                  <div
                    style={{
                      ...styles.roleBadge,
                      background: badge.bg,
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
                  <LockIcon size={12} color="#64748B" />
                  <span>Contact details restricted to private cohort workspace</span>
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
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.15) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px rgba(168, 85, 247, 0.25)',
  },
  pre: {
    color: '#F472B6',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    fontFamily: 'var(--font-mono)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.3px',
    marginTop: '2px',
  },
  badgeInfo: {
    color: '#A5A6C4',
    fontSize: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #241450 0%, #150C30 100%)',
    border: '1px solid rgba(168, 85, 247, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 14px rgba(168, 85, 247, 0.25)',
  },
  avatarText: {
    background: 'linear-gradient(135deg, #E9D5FF 0%, #F472B6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    fontSize: '16px',
    fontFamily: 'var(--font-mono)',
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '800',
    marginBottom: '4px',
    letterSpacing: '-0.2px',
  },
  roleBadge: {
    display: 'inline-block',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.6px',
    fontFamily: 'var(--font-mono)',
  },
  bio: {
    color: '#A5A6C4',
    fontSize: '12px',
    lineHeight: 1.6,
    fontStyle: 'italic',
    marginBottom: '18px',
    flex: 1,
  },
  skillsBlock: {
    marginBottom: '18px',
  },
  skillsLabel: {
    color: '#C084FC',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-mono)',
    marginBottom: '8px',
  },
  skillsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillPill: {
    backgroundColor: 'rgba(28, 16, 60, 0.65)',
    color: '#E9D5FF',
    borderRadius: '6px',
    padding: '4px 9px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid rgba(168, 85, 247, 0.2)',
  },
  footerRow: {
    borderTop: '1px solid rgba(168, 85, 247, 0.15)',
    paddingTop: '12px',
  },
  privacyNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#71719A',
    fontSize: '11px',
  },
};
