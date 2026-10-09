import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AdminLayout from './components/layout/AdminLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FacultyManagement from './pages/FacultyManagement';
import AcademicsManagement from './pages/AcademicsManagement';
import PyqManagement from './pages/PyqManagement';
import BlogManagement from './pages/BlogManagement';
import GalleryManagement from './pages/GalleryManagement';
import CampusUpdatesManagement from './pages/CampusUpdatesManagement';
import NoticeManagement from './pages/NoticeManagement';
import ProfileSettings from './pages/ProfileSettings';

/**
 * ProtectedRoute — Ensures only authenticated admin users can access the dashboard.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Verifying admin credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
   <BrowserRouter basename="/admin">
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="faculty" element={<FacultyManagement />} />
              <Route path="academics" element={<AcademicsManagement />} />
              <Route path="pyqs" element={<PyqManagement />} />
              <Route path="blogs" element={<BlogManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="campus-updates" element={<CampusUpdatesManagement />} />
              <Route path="notices" element={<NoticeManagement />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
