import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  card: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { marginBottom: '1rem' },
  fullWidth: { gridColumn: '1 / -1' },
  label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' },
  value: { fontSize: '0.95rem', color: '#1e293b', padding: '0.4rem 0' },
  valueEmpty: { fontSize: '0.9rem', color: '#9ca3af', fontStyle: 'italic', padding: '0.4rem 0' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  textarea: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '100px', resize: 'vertical' },
  select: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: '#fff' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  open: { backgroundColor: '#dcfce7', color: '#166534' },
  closed: { backgroundColor: '#fee2e2', color: '#991b1b' },
  backBtn: { padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem' },
  editBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  saveBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  cancelBtn: { padding: '0.6rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  section: { marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' },
  sectionTitle: { fontSize: '1rem', fontWeight: '600', color: '#475569', marginBottom: '1rem' },
  metaRow: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  metaItem: { fontSize: '0.8rem', color: '#6b7280' },
  message: { marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  success: { backgroundColor: '#dcfce7', color: '#166534' },
  error: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axiosClient.get(`/api/job?id=${id}`);
      setJob(res.data);
      setForm({
        title: res.data.title || '',
        jobDescription: res.data.jobDescription || '',
        requiredProfessionalExperience: res.data.requiredProfessionalExperience || '',
        requiredEducationalExperience: res.data.requiredEducationalExperience || '',
        status: res.data.status || 'OPEN',
      });
    } catch (err) {
      console.error('Failed to fetch job', err);
    }
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosClient.put('/api/job', {
        id: job.id, companyId: job.companyId, companyName: job.companyName, ...form,
      });
      setMessage({ type: 'success', text: 'Job updated successfully!' });
      setEditing(false);
      fetchJob();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update job' });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(null);
    fetchJob();
  };

  const renderValue = (val, multiline) => {
    if (!val) return <div style={styles.valueEmpty}>Not provided</div>;
    if (multiline) return <div style={{ ...styles.value, whiteSpace: 'pre-wrap' }}>{val}</div>;
    return <div style={styles.value}>{val}</div>;
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;
  if (!job) return <div style={{ padding: '2rem', textAlign: 'center', color: '#991b1b' }}>Job not found.</div>;

  const statusStyle = job.status === 'OPEN' ? styles.open : styles.closed;

  return (
    <div>
      <button style={styles.backBtn} onClick={() => navigate('/jobs')}>&larr; Back to All Jobs</button>
      <h1 style={styles.title}>{editing ? 'Edit Job' : 'Job Details'}</h1>
      <div style={styles.card}>
        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}

        {!editing ? (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{job.title}</div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{job.companyName}</div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ ...styles.badge, ...statusStyle }}>{job.status}</span>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Job Information</h2>
              <div style={styles.grid}>
                <div style={{ ...styles.field, ...styles.fullWidth }}>
                  <label style={styles.label}>Job Description</label>
                  {renderValue(job.jobDescription, true)}
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Required Professional Experience</label>
                  {renderValue(job.requiredProfessionalExperience, true)}
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Required Educational Experience</label>
                  {renderValue(job.requiredEducationalExperience, true)}
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Metadata</h2>
              <div style={styles.metaRow}>
                <div style={styles.metaItem}>Job ID: {job.id}</div>
                <div style={styles.metaItem}>Company ID: {job.companyId}</div>
                <div style={styles.metaItem}>Created: {job.createdAt || 'N/A'}</div>
                <div style={styles.metaItem}>Updated: {job.updatedAt || 'N/A'}</div>
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit Job</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Title *</label>
                <input style={styles.input} name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Status</label>
                <select style={styles.select} name="status" value={form.status} onChange={handleChange}>
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
              <div style={{ ...styles.field, ...styles.fullWidth }}>
                <label style={styles.label}>Job Description</label>
                <textarea style={styles.textarea} name="jobDescription" value={form.jobDescription} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Required Professional Experience</label>
                <textarea style={{ ...styles.textarea, minHeight: '60px' }} name="requiredProfessionalExperience" value={form.requiredProfessionalExperience} onChange={handleChange} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Required Educational Experience</label>
                <textarea style={{ ...styles.textarea, minHeight: '60px' }} name="requiredEducationalExperience" value={form.requiredEducationalExperience} onChange={handleChange} />
              </div>
            </div>
            <div style={styles.actions}>
              <button type="submit" style={styles.saveBtn}>Save Changes</button>
              <button type="button" style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
