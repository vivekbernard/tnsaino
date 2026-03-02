import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import BrowseJobs from './pages/public/BrowseJobs';
import JobDetail from './pages/public/JobDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import EditProfile from './pages/candidate/EditProfile';
import MyApplications from './pages/candidate/MyApplications';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import CreateJob from './pages/company/CreateJob';
import ManageJobs from './pages/company/ManageJobs';
import ViewApplicants from './pages/company/ViewApplicants';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate routes */}
        <Route path="/candidate/dashboard" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/candidate/profile" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}><EditProfile /></ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}><MyApplications /></ProtectedRoute>
        } />

        {/* Company routes */}
        <Route path="/company/dashboard" element={
          <ProtectedRoute allowedRoles={['COMPANY']}><CompanyDashboard /></ProtectedRoute>
        } />
        <Route path="/company/profile" element={
          <ProtectedRoute allowedRoles={['COMPANY']}><CompanyProfile /></ProtectedRoute>
        } />
        <Route path="/company/jobs/create" element={
          <ProtectedRoute allowedRoles={['COMPANY']}><CreateJob /></ProtectedRoute>
        } />
        <Route path="/company/jobs" element={
          <ProtectedRoute allowedRoles={['COMPANY']}><ManageJobs /></ProtectedRoute>
        } />
        <Route path="/company/jobs/:jobId/applicants" element={
          <ProtectedRoute allowedRoles={['COMPANY']}><ViewApplicants /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}
