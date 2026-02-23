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
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  active: { backgroundColor: '#dcfce7', color: '#166534' },
  disabled: { backgroundColor: '#fee2e2', color: '#991b1b' },
  roleBadge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#eff6ff', color: '#1d4ed8' },
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
  input: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: '#fff', boxSizing: 'border-box' },
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchUser(); }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axiosClient.get(`/api/user?id=${id}`);
      setUser(res.data);
      setForm({
        username: res.data.username || '',
        role: res.data.role || 'CANDIDATE',
        status: res.data.status || 'ACTIVE',
      });
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axiosClient.put('/api/user', {
        id: user.id,
        username: form.username,
        role: form.role,
        status: form.status,
        linkedEntityId: user.linkedEntityId,
        createdAt: user.createdAt,
        passwordHash: user.passwordHash,
      });
      setMessage({ type: 'success', text: 'User updated successfully!' });
      setEditing(false);
      fetchUser();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update user' });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(null);
    fetchUser();
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center', color: '#991b1b' }}>User not found.</div>;

  return (
    <div>
      <button style={styles.backBtn} onClick={() => navigate('/users')}>&larr; Back to All Users</button>
      <h1 style={styles.title}>{editing ? 'Edit User' : 'User Details'}</h1>
      <div style={styles.card}>
        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}

        {!editing ? (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{user.username}</div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={styles.roleBadge}>{user.role}</span>
                <span style={{ ...styles.badge, ...(user.status === 'ACTIVE' ? styles.active : styles.disabled) }}>
                  {user.status}
                </span>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Account Information</h2>
              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>Username</label>
                  <div style={styles.value}>{user.username}</div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Role</label>
                  <div style={styles.value}>{user.role}</div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Status</label>
                  <div style={styles.value}>{user.status}</div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Linked Entity ID</label>
                  {user.linkedEntityId
                    ? <div style={styles.value}>{user.linkedEntityId}</div>
                    : <div style={styles.valueEmpty}>Not linked</div>}
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Metadata</h2>
              <div style={styles.metaRow}>
                <div style={styles.metaItem}>User ID: {user.id}</div>
                <div style={styles.metaItem}>Created: {user.createdAt || 'N/A'}</div>
                {user.deletedAt && <div style={styles.metaItem}>Deleted: {user.deletedAt}</div>}
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit User</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Username *</label>
                <input
                  style={styles.input}
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Role *</label>
                <select style={styles.select} name="role" value={form.role} onChange={handleChange}>
                  <option value="CANDIDATE">CANDIDATE</option>
                  <option value="COMPANY">COMPANY</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Status *</label>
                <select style={styles.select} name="status" value={form.status} onChange={handleChange}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Linked Entity ID</label>
                <div style={{ ...styles.value, color: '#6b7280', fontSize: '0.85rem' }}>
                  {user.linkedEntityId || 'Not linked'} (read-only)
                </div>
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
