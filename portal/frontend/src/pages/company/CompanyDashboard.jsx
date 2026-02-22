import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' },
  cardValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' },
  profileCard: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  companyName: { fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
  detail: { fontSize: '0.9rem', color: '#475569', marginBottom: '0.25rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  btn: { padding: '0.5rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
};

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobCount, setJobCount] = useState(0);
  const [openJobs, setOpenJobs] = useState(0);

  useEffect(() => {
    if (user?.linkedEntityId) {
      fetchCompany();
      fetchJobStats();
    }
  }, [user]);

  const fetchCompany = async () => {
    try {
      const res = await axiosClient.get(`/api/company?id=${user.linkedEntityId}`);
      setCompany(res.data);
    } catch (err) {
      console.error('Failed to fetch company', err);
    }
  };

  const fetchJobStats = async () => {
    try {
      const allRes = await axiosClient.get(`/api/joblist?companyId=${user.linkedEntityId}&page=0&size=1`);
      setJobCount(allRes.data.totalElements || 0);
      const openRes = await axiosClient.get(`/api/joblist?companyId=${user.linkedEntityId}&status=OPEN&page=0&size=1`);
      setOpenJobs(openRes.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch job stats', err);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Company Dashboard</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Jobs</div>
          <div style={styles.cardValue}>{jobCount}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Open Jobs</div>
          <div style={styles.cardValue}>{openJobs}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Company Status</div>
          <div style={styles.cardValue}>{company?.status || 'N/A'}</div>
        </div>
      </div>

      {company && (
        <div style={styles.profileCard}>
          <div style={styles.companyName}>{company.name}</div>
          {company.corporateWebsite && <div style={styles.detail}>Website: {company.corporateWebsite}</div>}
          {company.hrContactName && <div style={styles.detail}>HR Contact: {company.hrContactName} ({company.hrContactEmail})</div>}
          <div style={styles.actions}>
            <Link to="/company/jobs/create" style={styles.btn}>Post New Job</Link>
            <Link to="/company/jobs" style={styles.btn}>Manage Jobs</Link>
          </div>
        </div>
      )}
    </div>
  );
}
