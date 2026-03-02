import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', color: '#475569', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  open: { backgroundColor: '#dcfce7', color: '#166534' },
  closed: { backgroundColor: '#fee2e2', color: '#991b1b' },
  viewBtn: { padding: '0.3rem 0.75rem', border: '1px solid #93c5fd', borderRadius: '4px', backgroundColor: '#eff6ff', cursor: 'pointer', fontSize: '0.8rem', color: '#1d4ed8', marginRight: '0.5rem' },
  dangerBtn: { padding: '0.3rem 0.75rem', border: '1px solid #fca5a5', borderRadius: '4px', backgroundColor: '#fef2f2', cursor: 'pointer', fontSize: '0.8rem', color: '#991b1b' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

export default function AllJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJobs(); }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/joblist?page=${page}&size=10`);
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to soft-delete this job?')) return;
    try {
      await axiosClient.delete(`/api/job?id=${id}`);
      fetchJobs();
    } catch (err) {
      console.error('Failed to delete job', err);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>All Jobs</h1>
      {loading ? (
        <Spinner text="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <div style={styles.empty}>No jobs found.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Applicants</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td style={styles.td}>{job.title}</td>
                <td style={styles.td}>{job.companyName || '-'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(job.status === 'OPEN' ? styles.open : styles.closed) }}>
                    {job.status}
                  </span>
                </td>
                <td style={styles.td}>{job.applicantCount || 0}</td>
                <td style={styles.td}>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td style={styles.td}>
                  <button style={styles.viewBtn} onClick={() => navigate(`/jobs/${job.id}`)}>View</button>
                  <button style={styles.dangerBtn} onClick={() => handleDelete(job.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
