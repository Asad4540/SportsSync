import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import Home from './pages/public/Home';
import Sports from './pages/public/Sports';

// User Pages
import Dashboard from './pages/user/Dashboard';
import TournamentDetail from './pages/user/TournamentDetail';
import RegisterTeam from './pages/user/RegisterTeam';
import MyRegistrations from './pages/user/MyRegistrations';
import Profile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTournaments from './pages/admin/ManageTournaments';
import TournamentForm from './pages/admin/TournamentForm';
import ManageRegistrations from './pages/admin/ManageRegistrations';
import RegistrationDetail from './pages/admin/RegistrationDetail';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';

import './App.css';

/**
 * App - Main application component with routing
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Public Routes (no layout) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes (MainLayout) */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/tournaments/:id" element={<TournamentDetail />} />
            <Route path="/register-team/:id" element={<RegisterTeam />} />
            <Route path="/my-registrations" element={<MyRegistrations />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes (AdminLayout) */}
          <Route element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tournaments" element={<ManageTournaments />} />
            <Route path="/admin/tournaments/new" element={<TournamentForm />} />
            <Route path="/admin/tournaments/edit/:id" element={<TournamentForm />} />
            <Route path="/admin/registrations" element={<ManageRegistrations />} />
            <Route path="/admin/registrations/:id" element={<RegistrationDetail />} />
            <Route path="/admin/announcements" element={<ManageAnnouncements />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
