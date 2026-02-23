import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';

import Login from './pages/public/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllCandidates from './pages/admin/AllCandidates';
import AllCompanies from './pages/admin/AllCompanies';
import AllJobs from './pages/admin/AllJobs';
import SoftDeletedView from './pages/admin/SoftDeletedView';
import CandidateDetail from './pages/admin/CandidateDetail';
import CompanyDetail from './pages/admin/CompanyDetail';
import JobDetail from './pages/admin/JobDetail';
import AllUsers from './pages/admin/AllUsers';
import UserDetail from './pages/admin/UserDetail';

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/candidates" element={<RequireAuth><AllCandidates /></RequireAuth>} />
        <Route path="/candidates/:id" element={<RequireAuth><CandidateDetail /></RequireAuth>} />
        <Route path="/companies" element={<RequireAuth><AllCompanies /></RequireAuth>} />
        <Route path="/companies/:id" element={<RequireAuth><CompanyDetail /></RequireAuth>} />
        <Route path="/jobs" element={<RequireAuth><AllJobs /></RequireAuth>} />
        <Route path="/jobs/:id" element={<RequireAuth><JobDetail /></RequireAuth>} />
        <Route path="/users" element={<RequireAuth><AllUsers /></RequireAuth>} />
        <Route path="/users/:id" element={<RequireAuth><UserDetail /></RequireAuth>} />
        <Route path="/deleted" element={<RequireAuth><SoftDeletedView /></RequireAuth>} />
      </Route>
    </Routes>
  );
}
