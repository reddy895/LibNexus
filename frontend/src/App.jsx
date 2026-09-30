import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & User Pages
import LandingPage from './pages/LandingPage';
import LibrariesPage from './pages/LibrariesPage';
import LibraryDetailsPage from './pages/LibraryDetailsPage';
import BookSelectionPage from './pages/BookSelectionPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import MapPage from './pages/MapPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/BookingsPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLibrariesPage from './pages/AdminLibrariesPage';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminSeatsPage from './pages/AdminSeatsPage';
import AdminUsersPage from './pages/AdminUsersPage';

import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Wrapper for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Checking authentication status..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route Wrapper for Admins only
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Verifying administrator clearance..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main User App Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="libraries" element={<LibrariesPage />} />
            <Route path="libraries/:id" element={<LibraryDetailsPage />} />
            <Route path="libraries/:id/seats" element={<BookSelectionPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailsPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="bookings"
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Panel Routes */}
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
            <Route path="seats" element={<AdminSeatsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
