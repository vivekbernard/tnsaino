import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const styles = {
  container: { maxWidth: '800px' },
  back: { color: '#2563eb', cursor: 'pointer', marginBottom: '1rem', display: 'inline-block', fontSize: '0.9rem' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  title: { fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' },
  company: { color: '#2563eb', fontSize: '1.1rem', marginBottom: '1rem' },
  meta: { display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#6b7280' },
  badge: { padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500', backgroundColor: '#dcfce7', color: '#166534' },
  section: { marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' },
  text: { color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  applyBtn: { padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
  disabledBtn: { padding: '0.75rem 2rem', backgroundColor: '#9ca3af', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'not-allowed', marginTop: '1rem' },
  message: { marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useAuth();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axiosClient.get(`/api/job?id=${id}`);
      setJob(res.data);
    } catch (err) {
      console.error('Failed to fetch job', err);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setMessage(null);
    try {
      await axiosClient.put('/api/jobapplication', {
        id: crypto.randomUUID(),
        jobId: job.id,
        candidateId: user.linkedEntityId,
      });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit application' });
    }
    setApplying(false);
  };

  if (!job) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <span style={styles.back} onClick={() => navigate(-1)}>Back to Jobs</span>
      <div style={styles.card}>
        <h1 style={styles.title}>{job.title}</h1>
        <div style={styles.company}>{job.companyName || 'Unknown Company'}</div>
        <div style={styles.meta}>
          <span style={styles.badge}>{job.status}</span>
          <span>{job.applicantCount || 0} applicants</span>
        </div>

        {job.jobDescription && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Job Description</h3>
            <p style={styles.text}>{job.jobDescription}</p>
          </div>
        )}

        {job.requiredProfessionalExperience && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Professional Experience Required</h3>
            <p style={styles.text}>{job.requiredProfessionalExperience}</p>
          </div>
        )}

        {job.requiredEducationalExperience && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Educational Experience Required</h3>
            <p style={styles.text}>{job.requiredEducationalExperience}</p>
          </div>
        )}

        {isAuthenticated && role === 'CANDIDATE' && job.status === 'OPEN' && (
          <button
            style={applying ? styles.disabledBtn : styles.applyBtn}
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}

        {!isAuthenticated && job.status === 'OPEN' && (
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>
            <a href="/login">Login</a> as a candidate to apply for this job.
          </p>
        )}

        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
