import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit' },
  cardTitle: { fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' },
  cardValue: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' },
  quickLinks: { marginTop: '2rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' },
  linkGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  linkCard: { padding: '1rem 1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: '#2563eb', fontWeight: '500' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ candidates: 0, companies: 0, jobs: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [candidateRes, companyRes, jobRes] = await Promise.all([
        axiosClient.get('/api/candidatelist?page=0&size=1'),
        axiosClient.get('/api/companylist?page=0&size=1'),
        axiosClient.get('/api/joblist?page=0&size=1'),
      ]);
      setStats({
        candidates: candidateRes.data.totalElements || 0,
        companies: companyRes.data.totalElements || 0,
        jobs: jobRes.data.totalElements || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.grid}>
        <Link to="/admin/candidates" style={styles.card}>
          <div style={styles.cardTitle}>Candidates</div>
          <div style={styles.cardValue}>{stats.candidates}</div>
        </Link>
        <Link to="/admin/companies" style={styles.card}>
          <div style={styles.cardTitle}>Companies</div>
          <div style={styles.cardValue}>{stats.companies}</div>
        </Link>
        <Link to="/admin/jobs" style={styles.card}>
          <div style={styles.cardTitle}>Jobs</div>
          <div style={styles.cardValue}>{stats.jobs}</div>
        </Link>
      </div>

      <div style={styles.quickLinks}>
        <h2 style={styles.sectionTitle}>Quick Links</h2>
        <div style={styles.linkGrid}>
          <Link to="/admin/candidates" style={styles.linkCard}>Manage Candidates</Link>
          <Link to="/admin/companies" style={styles.linkCard}>Manage Companies</Link>
          <Link to="/admin/jobs" style={styles.linkCard}>Manage Jobs</Link>
          <Link to="/admin/deleted" style={styles.linkCard}>View Soft-Deleted Records</Link>
        </div>
      </div>
    </div>
  );
}
