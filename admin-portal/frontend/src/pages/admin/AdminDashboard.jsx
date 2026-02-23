import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/Spinner';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: {
    padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textDecoration: 'none', color: 'inherit',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    transition: 'box-shadow 0.15s',
  },
  cardLeft: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  cardLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' },
  cardValue: { fontSize: '2.25rem', fontWeight: '700', color: '#1e293b', lineHeight: 1 },
  iconBox: {
    width: '52px', height: '52px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  quickLinks: { marginTop: '2rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' },
  linkGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  linkCard: {
    padding: '1rem 1.5rem', backgroundColor: '#fff', borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: '#2563eb', fontWeight: '500',
  },
};

const IconCandidate = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconCompany = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);

const IconJob = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-10h-4V4h4v4z" />
  </svg>
);

const IconUsers = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const statCards = [
  { to: '/candidates', label: 'Candidates', key: 'candidates', Icon: IconCandidate, color: '#2563eb', bg: '#eff6ff' },
  { to: '/companies',  label: 'Companies',  key: 'companies',  Icon: IconCompany,   color: '#7c3aed', bg: '#f5f3ff' },
  { to: '/jobs',       label: 'Jobs',       key: 'jobs',       Icon: IconJob,       color: '#16a34a', bg: '#f0fdf4' },
  { to: '/users',      label: 'Users',      key: 'users',      Icon: IconUsers,     color: '#ea580c', bg: '#fff7ed' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ candidates: 0, companies: 0, jobs: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [candidateRes, companyRes, jobRes, userRes] = await Promise.all([
        axiosClient.get('/api/candidatelist?page=0&size=1'),
        axiosClient.get('/api/companylist?page=0&size=1'),
        axiosClient.get('/api/joblist?page=0&size=1'),
        axiosClient.get('/api/userlist?page=0&size=1'),
      ]);
      setStats({
        candidates: candidateRes.data.totalElements || 0,
        companies:  companyRes.data.totalElements  || 0,
        jobs:       jobRes.data.totalElements      || 0,
        users:      userRes.data.totalElements     || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {loading ? (
        <Spinner text="Loading stats..." />
      ) : (
        <>
          <div style={styles.grid}>
            {statCards.map(({ to, label, key, Icon, color, bg }) => (
              <Link key={key} to={to} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.cardLabel}>{label}</div>
                  <div style={styles.cardValue}>{stats[key]}</div>
                </div>
                <div style={{ ...styles.iconBox, backgroundColor: bg, color }}>
                  <Icon />
                </div>
              </Link>
            ))}
          </div>

          <div style={styles.quickLinks}>
            <h2 style={styles.sectionTitle}>Quick Links</h2>
            <div style={styles.linkGrid}>
              <Link to="/candidates" style={styles.linkCard}>Manage Candidates</Link>
              <Link to="/companies"  style={styles.linkCard}>Manage Companies</Link>
              <Link to="/jobs"       style={styles.linkCard}>Manage Jobs</Link>
              <Link to="/users"      style={styles.linkCard}>Manage Users</Link>
              <Link to="/deleted"    style={styles.linkCard}>View Soft-Deleted Records</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
