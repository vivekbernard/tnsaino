import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';

const styles = {
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500' },
  active: { backgroundColor: '#dcfce7', color: '#166534' },
  disabled: { backgroundColor: '#fee2e2', color: '#991b1b' },
  roleBadge: { padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#eff6ff', color: '#1d4ed8' },
  viewBtn: { padding: '0.3rem 0.7rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.4rem' },
  deleteBtn: { padding: '0.3rem 0.7rem', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' },
  empty: { padding: '3rem', textAlign: 'center', color: '#6b7280' },
};

export default function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/userlist?page=${page}&size=10`);
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to soft-delete this user?')) return;
    try {
      await axiosClient.delete(`/api/user?id=${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div>
      <h1 style={styles.title}>All Users</h1>
      {loading ? (
        <Spinner text="Loading users..." />
      ) : users.length === 0 ? (
        <div style={styles.empty}>No users found.</div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.username}</td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge}>{u.role}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...(u.status === 'ACTIVE' ? styles.active : styles.disabled) }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={styles.td}>{u.createdAt ? u.createdAt.slice(0, 10) : 'N/A'}</td>
                  <td style={styles.td}>
                    <button style={styles.viewBtn} onClick={() => navigate(`/users/${u.id}`)}>View</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
