import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & User Pages
import LandingPage from './pages/LandingPage';
import LibrariesPage from './pages/LibrariesPage';
import LibraryDetailsPage from './pages/LibraryDetailsPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import MapPage from './pages/MapPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Portal Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLibrariesPage from './pages/AdminLibrariesPage';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminNewArrivalsPage from './pages/AdminNewArrivalsPage';
import AdminSeatsPage from './pages/AdminSeatsPage';
import AdminActivityPage from './pages/AdminActivityPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Wrapper for Admin Portal (Requires Admin or Librarian role)
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Verifying administrative clearance..." />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin' && user.role !== 'librarian') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Platform Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="libraries" element={<LibrariesPage />} />
            <Route path="libraries/:id" element={<LibraryDetailsPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailsPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Admin Portal Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Platform Portal */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="libraries" element={<AdminLibrariesPage />} />
            <Route path="books" element={<AdminBooksPage />} />
            <Route path="books/new-arrivals" element={<AdminNewArrivalsPage />} />
            <Route path="seats" element={<AdminSeatsPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
