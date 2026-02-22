import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', color: '#475569', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  applied: { backgroundColor: '#dbeafe', color: '#1e40af' },
  shortlisted: { backgroundColor: '#dcfce7', color: '#166534' },
  rejected: { backgroundColor: '#fee2e2', color: '#991b1b' },
  hired: { backgroundColor: '#fef3c7', color: '#92400e' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

const statusStyles = { APPLIED: styles.applied, SHORTLISTED: styles.shortlisted, REJECTED: styles.rejected, HIRED: styles.hired };

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (user?.linkedEntityId) fetchApplications();
  }, [user, page]);

  const fetchApplications = async () => {
    try {
      const res = await axiosClient.get(`/api/jobapplicationlist?candidateId=${user.linkedEntityId}&page=${page}&size=10`);
      setApplications(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>My Applications</h1>
      {applications.length === 0 ? (
        <div style={styles.empty}>No applications yet. Browse jobs to get started!</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Job Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>{app.jobTitle || 'N/A'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(statusStyles[app.status] || {}) }}>{app.status}</span>
                </td>
                <td style={styles.td}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
