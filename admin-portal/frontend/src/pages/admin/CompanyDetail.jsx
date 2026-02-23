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
  linkValue: { color: '#2563eb', textDecoration: 'none', fontSize: '0.95rem', padding: '0.4rem 0', display: 'inline-block' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem' },
  textarea: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  active: { backgroundColor: '#dcfce7', color: '#166534' },
  disabled: { backgroundColor: '#fee2e2', color: '#991b1b' },
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

const fields = [
  { key: 'name', label: 'Company Name', required: true },
  { key: 'corporateWebsite', label: 'Corporate Website', isLink: true },
  { key: 'hrContactName', label: 'HR Contact Name' },
  { key: 'hrContactEmail', label: 'HR Contact Email', type: 'email' },
  { key: 'legalContactName', label: 'Legal Contact Name' },
  { key: 'legalContactEmail', label: 'Legal Contact Email', type: 'email' },
  { key: 'logoUrl', label: 'Logo URL', isLink: true },
  { key: 'details', label: 'Details', fullWidth: true, multiline: true },
];

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchCompany(); }, [id]);

  const fetchCompany = async () => {
    try {
      const res = await axiosClient.get(`/api/company?id=${id}`);
      setCompany(res.data);
      setForm({
        name: res.data.name || '', corporateWebsite: res.data.corporateWebsite || '',
        hrContactName: res.data.hrContactName || '', hrContactEmail: res.data.hrContactEmail || '',
        legalContactName: res.data.legalContactName || '', legalContactEmail: res.data.legalContactEmail || '',
        logoUrl: res.data.logoUrl || '', details: res.data.details || '',
      });
    } catch (err) {
      console.error('Failed to fetch company', err);
    }
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosClient.put('/api/company', {
        id: company.id, userId: company.userId, ...form, status: company.status,
        createdAt: company.createdAt,
      });
      setMessage({ type: 'success', text: 'Company updated successfully!' });
      setEditing(false);
      fetchCompany();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update company' });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(null);
    fetchCompany();
  };

  const renderViewValue = (field) => {
    const val = company[field.key];
    if (!val) return <div style={styles.valueEmpty}>Not provided</div>;
    if (field.isLink) return <a href={val} target="_blank" rel="noopener noreferrer" style={styles.linkValue}>{val}</a>;
    if (field.multiline) return <div style={{ ...styles.value, whiteSpace: 'pre-wrap' }}>{val}</div>;
    return <div style={styles.value}>{val}</div>;
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;
  if (!company) return <div style={{ padding: '2rem', textAlign: 'center', color: '#991b1b' }}>Company not found.</div>;

  return (
    <div>
      <button style={styles.backBtn} onClick={() => navigate('/companies')}>&larr; Back to All Companies</button>
      <h1 style={styles.title}>{editing ? 'Edit Company' : 'Company Details'}</h1>
      <div style={styles.card}>
        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}

        {!editing ? (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{company.name}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ ...styles.badge, ...(company.status === 'ACTIVE' ? styles.active : styles.disabled) }}>
                  {company.status}
                </span>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Company Information</h2>
              <div style={styles.grid}>
                {fields.map((f) => (
                  <div key={f.key} style={{ ...styles.field, ...(f.fullWidth ? styles.fullWidth : {}) }}>
                    <label style={styles.label}>{f.label}</label>
                    {renderViewValue(f)}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Metadata</h2>
              <div style={styles.metaRow}>
                <div style={styles.metaItem}>Company ID: {company.id}</div>
                <div style={styles.metaItem}>User ID: {company.userId || 'N/A'}</div>
                <div style={styles.metaItem}>Created: {company.createdAt || 'N/A'}</div>
                <div style={styles.metaItem}>Updated: {company.updatedAt || 'N/A'}</div>
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit Company</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.grid}>
              {fields.map((f) => (
                <div key={f.key} style={{ ...styles.field, ...(f.fullWidth ? styles.fullWidth : {}) }}>
                  <label style={styles.label}>{f.label}{f.required ? ' *' : ''}</label>
                  {f.multiline ? (
                    <textarea style={styles.textarea} name={f.key} value={form[f.key]} onChange={handleChange} />
                  ) : (
                    <input style={styles.input} type={f.type || 'text'} name={f.key} value={form[f.key]} onChange={handleChange} required={f.required} />
                  )}
                </div>
              ))}
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
