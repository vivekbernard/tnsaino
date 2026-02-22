import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Pagination from '../../components/Pagination';

const styles = {
  header: { marginBottom: '1.5rem' },
  back: { color: '#2563eb', cursor: 'pointer', marginBottom: '0.5rem', display: 'inline-block', fontSize: '0.9rem' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' },
  jobInfo: { fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', color: '#475569', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  applied: { backgroundColor: '#dbeafe', color: '#1e40af' },
  shortlisted: { backgroundColor: '#dcfce7', color: '#166534' },
  rejected: { backgroundColor: '#fee2e2', color: '#991b1b' },
  hired: { backgroundColor: '#fef3c7', color: '#92400e' },
  select: { padding: '0.3rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.8rem' },
  empty: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
};

const statusStyles = { APPLIED: styles.applied, SHORTLISTED: styles.shortlisted, REJECTED: styles.rejected, HIRED: styles.hired };

export default function ViewApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchJob();
    fetchApplicants();
  }, [jobId, page]);

  const fetchJob = async () => {
    try {
      const res = await axiosClient.get(`/api/job?id=${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.error('Failed to fetch job', err);
    }
  };

  const fetchApplicants = async () => {
    try {
      const res = await axiosClient.get(`/api/jobapplicationlist?jobId=${jobId}&page=${page}&size=10`);
      setApplicants(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch applicants', err);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await axiosClient.put(`/api/jobapplication/status?id=${appId}&status=${newStatus}`);
      fetchApplicants();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <span style={styles.back} onClick={() => navigate('/company/jobs')}>Back to Jobs</span>
        <h1 style={styles.title}>Applicants</h1>
        {job && <div style={styles.jobInfo}>For: {job.title}</div>}
      </div>

      {applicants.length === 0 ? (
        <div style={styles.empty}>No applicants yet.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Candidate Name</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Applied At</th>
              <th style={styles.th}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>{app.candidateName || 'N/A'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...(statusStyles[app.status] || {}) }}>{app.status}</span>
                </td>
                <td style={styles.td}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}</td>
                <td style={styles.td}>
                  <select
                    style={styles.select}
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="HIRED">Hired</option>
                  </select>
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
