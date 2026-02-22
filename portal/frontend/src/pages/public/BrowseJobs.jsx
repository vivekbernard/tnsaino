import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Pagination from '../../components/Pagination';

const styles = {
  header: { marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b' },
  filters: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  input: { padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minWidth: '200px' },
  select: { padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  grid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1 },
  jobTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' },
  company: { color: '#2563eb', fontSize: '0.9rem', marginBottom: '0.5rem' },
  meta: { display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#6b7280' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500' },
  open: { backgroundColor: '#dcfce7', color: '#166534' },
  closed: { backgroundColor: '#fee2e2', color: '#991b1b' },
  viewBtn: { padding: '0.5rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', fontSize: '0.9rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('OPEN');

  useEffect(() => {
    fetchJobs();
  }, [page, statusFilter]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams({ page, size: 10 });
      if (statusFilter) params.append('status', statusFilter);
      const res = await axiosClient.get(`/api/joblist?${params}`);
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Browse Jobs</h1>
      </div>

      <div style={styles.filters}>
        <select style={styles.select} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
          <option value="OPEN">Open Jobs</option>
          <option value="">All Statuses</option>
          <option value="CLOSED">Closed Jobs</option>
        </select>
      </div>

      <div style={styles.grid}>
        {jobs.length === 0 && <div style={styles.empty}>No jobs found.</div>}
        {jobs.map((job) => (
          <div key={job.id} style={styles.card}>
            <div style={styles.cardLeft}>
              <div style={styles.jobTitle}>{job.title}</div>
              <div style={styles.company}>{job.companyName || 'Unknown Company'}</div>
              <div style={styles.meta}>
                <span>{job.applicantCount || 0} applicants</span>
                <span style={{ ...styles.badge, ...(job.status === 'OPEN' ? styles.open : styles.closed) }}>
                  {job.status}
                </span>
              </div>
            </div>
            <Link to={`/jobs/${job.id}`} style={styles.viewBtn}>View Details</Link>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
