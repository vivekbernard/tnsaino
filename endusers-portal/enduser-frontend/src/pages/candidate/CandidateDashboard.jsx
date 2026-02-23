import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' },
  cardValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' },
  profileCard: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  profileName: { fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' },
  profileEmail: { color: '#6b7280', marginBottom: '1rem' },
  profileDetail: { fontSize: '0.9rem', color: '#475569', marginBottom: '0.25rem' },
  editLink: { display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
};

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

  return (
    <div>
      <h1 style={styles.title}>Candidate Dashboard</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>My Applications</div>
          <div style={styles.cardValue}>{appCount}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Profile Status</div>
          <div style={styles.cardValue}>{profile?.status || 'N/A'}</div>
        </div>
      </div>

      {profile && (
        <div style={styles.profileCard}>
          <div style={styles.profileName}>{profile.name}</div>
          <div style={styles.profileEmail}>{profile.email}</div>
          {profile.currentTitle && <div style={styles.profileDetail}>Title: {profile.currentTitle}</div>}
          {profile.currentCompany && <div style={styles.profileDetail}>Company: {profile.currentCompany}</div>}
          {profile.phone && <div style={styles.profileDetail}>Phone: {profile.phone}</div>}
          <Link to="/candidate/profile" style={styles.editLink}>Edit Profile</Link>
        </div>
      )}
    </div>
  );
}
