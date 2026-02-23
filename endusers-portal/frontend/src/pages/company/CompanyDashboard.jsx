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
  companyName: { fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
  detail: { fontSize: '0.9rem', color: '#475569', marginBottom: '0.25rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' },
  btn: { padding: '0.5rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
  promptCard: { padding: '2rem', backgroundColor: '#fffbeb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '1.5rem' },
  promptText: { fontSize: '1rem', color: '#92400e', marginBottom: '1rem' },
};

const IconTotalJobs = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-10h-4V4h4v4z" />
  </svg>
);

const IconOpenJobs = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
);

const IconStatus = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);

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
      const allRes  = await axiosClient.get(`/api/joblist?companyId=${user.linkedEntityId}&page=0&size=1`);
      setJobCount(allRes.data.totalElements || 0);
      const openRes = await axiosClient.get(`/api/joblist?companyId=${user.linkedEntityId}&status=OPEN&page=0&size=1`);
      setOpenJobs(openRes.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch job stats', err);
    }
  };

  const statusColor = company?.status === 'ACTIVE' ? '#16a34a' : '#6b7280';
  const statusBg   = company?.status === 'ACTIVE' ? '#f0fdf4'  : '#f3f4f6';

  return (
    <div>
      <h1 style={styles.title}>Company Dashboard</h1>

      {!user?.linkedEntityId && (
        <div style={styles.promptCard}>
          <div style={styles.promptText}>You haven't created your company profile yet. Set up your profile to start posting jobs.</div>
          <Link to="/company/profile" style={styles.btn}>Create Company Profile</Link>
        </div>
      )}

      {user?.linkedEntityId && (
        <>
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.cardLabel}>Total Jobs</div>
                <div style={styles.cardValue}>{jobCount}</div>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <IconTotalJobs />
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.cardLabel}>Open Jobs</div>
                <div style={styles.cardValue}>{openJobs}</div>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <IconOpenJobs />
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.cardLabel}>Company Status</div>
                <div style={styles.cardValueSm}>{company?.status || 'N/A'}</div>
              </div>
              <div style={{ ...styles.iconBox, backgroundColor: statusBg, color: statusColor }}>
                <IconStatus />
              </div>
            </div>
          </div>

          {company && (
            <div style={styles.profileCard}>
              <div style={styles.companyName}>{company.name}</div>
              {company.corporateWebsite && <div style={styles.detail}>Website: {company.corporateWebsite}</div>}
              {company.hrContactName    && <div style={styles.detail}>HR Contact: {company.hrContactName} ({company.hrContactEmail})</div>}
              <div style={styles.actions}>
                <Link to="/company/jobs/create" style={styles.btn}>Post New Job</Link>
                <Link to="/company/jobs"        style={styles.btn}>Manage Jobs</Link>
                <Link to="/company/profile"     style={styles.btn}>Edit Profile</Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
