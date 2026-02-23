import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: {
    padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  cardLeft: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  cardLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' },
  cardValue: { fontSize: '2.25rem', fontWeight: '700', color: '#1e293b', lineHeight: 1 },
  cardValueSm: { fontSize: '1.4rem', fontWeight: '700', color: '#1e293b', lineHeight: 1 },
  iconBox: {
    width: '52px', height: '52px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  profileCard: { padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  profileName: { fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' },
  profileEmail: { color: '#6b7280', marginBottom: '1rem' },
  profileDetail: { fontSize: '0.9rem', color: '#475569', marginBottom: '0.25rem' },
  editLink: { display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
  promptCard: { padding: '2rem', backgroundColor: '#fffbeb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' },
  promptText: { fontSize: '1rem', color: '#92400e', marginBottom: '1rem' },
  createLink: { display: 'inline-block', padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
};

const IconApplications = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 16h8v2H8v-2zm0-4h8v2H8v-2zm0-4h5v2H8V8z" />
  </svg>
);

const IconStatus = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    if (user?.linkedEntityId) {
      fetchProfile();
      fetchApplicationCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(`/api/candidate?id=${user.linkedEntityId}`);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchApplicationCount = async () => {
    try {
      const res = await axiosClient.get(`/api/jobapplicationlist?candidateId=${user.linkedEntityId}&page=0&size=1`);
      setAppCount(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch application count', err);
    }
  };

  const statusColor = profile?.status === 'ACTIVE' ? '#16a34a' : '#6b7280';
  const statusBg   = profile?.status === 'ACTIVE' ? '#f0fdf4'  : '#f3f4f6';

  return (
    <div>
      <h1 style={styles.title}>Candidate Dashboard</h1>

      {!user?.linkedEntityId && (
        <div style={styles.promptCard}>
          <div style={styles.promptText}>You haven't created your candidate profile yet. Set up your profile to start applying for jobs.</div>
          <Link to="/candidate/profile" style={styles.createLink}>Create Your Profile</Link>
        </div>
      )}

      {user?.linkedEntityId && (
        <>
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.cardLabel}>My Applications</div>
                <div style={styles.cardValue}>{appCount}</div>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <IconApplications />
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.cardLabel}>Profile Status</div>
                <div style={styles.cardValueSm}>{profile?.status || 'N/A'}</div>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: statusBg, color: statusColor }}>
                <IconStatus />
              </div>
            </div>
          </div>

          {profile && (
            <div style={styles.profileCard}>
              <div style={styles.profileName}>{profile.name}</div>
              <div style={styles.profileEmail}>{profile.email}</div>
              {profile.currentTitle   && <div style={styles.profileDetail}>Title: {profile.currentTitle}</div>}
              {profile.currentCompany && <div style={styles.profileDetail}>Company: {profile.currentCompany}</div>}
              {profile.phone          && <div style={styles.profileDetail}>Phone: {profile.phone}</div>}
              <Link to="/candidate/profile" style={styles.editLink}>Edit Profile</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
