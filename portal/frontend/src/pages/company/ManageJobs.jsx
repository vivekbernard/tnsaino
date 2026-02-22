import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' },
  createBtn: { padding: '0.5rem 1.25rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', color: '#475569', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  open: { backgroundColor: '#dcfce7', color: '#166534' },
  closed: { backgroundColor: '#fee2e2', color: '#991b1b' },
  actionBtn: { padding: '0.3rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem', textDecoration: 'none', color: '#334155' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

export default function ManageJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (user?.linkedEntityId) fetchJobs();
  }, [user, page]);

  const fetchJobs = async () => {
    try {
      const res = await axiosClient.get(`/api/joblist?companyId=${user.linkedEntityId}&page=${page}&size=10`);
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Jobs</h1>
        <Link to="/company/jobs/create" style={styles.createBtn}>Post New Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div style={styles.empty}>No jobs posted yet.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
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
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(job.status === 'OPEN' ? styles.open : styles.closed) }}>
                    {job.status}
                  </span>
                </td>
                <td style={styles.td}>{job.applicantCount || 0}</td>
                <td style={styles.td}>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td style={styles.td}>
                  <Link to={`/company/jobs/${job.id}/applicants`} style={styles.actionBtn}>View Applicants</Link>
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
