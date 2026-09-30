import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  BookOpen,
  Map,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this seat reservation?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      fetchUserBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const activeBookings = bookings.filter((b) => b.status === 'active');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Personal Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Welcome back, {user?.name || 'Member'}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your active library seat bookings, explore new study spaces, and view history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/libraries"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Reserve New Seat
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Reservations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-400">{activeBookings.length}</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Completed Visits
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400">
              {bookings.filter((b) => b.status === 'completed').length}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Member Account Status
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-white uppercase tracking-wider">
              {user?.role || 'Standard User'}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Your Active Seat Bookings
              </h2>
              <Link to="/bookings" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner message="Checking active reservations..." />
            ) : activeBookings.length === 0 ? (
              <div className="text-center py-12 space-y-3 border border-dashed border-slate-800 rounded-xl">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-sm">You have no active seat reservations right now.</p>
                <Link
                  to="/libraries"
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Explore Libraries & Book a Seat
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          ACTIVE RESERVATION
                        </span>
                        <span className="text-xs font-mono text-slate-400">ID: #{booking._id.slice(-6).toUpperCase()}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white">
                        {booking.library?.name || 'Partner Library'}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {booking.library?.address}, {booking.library?.city}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <strong className="text-white">{booking.date}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 font-bold">
                          Seat: {booking.seat?.seatNumber || 'N/A'} ({booking.seat?.zone || 'Zone'})
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-semibold rounded-lg transition-all shrink-0 self-end sm:self-center"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Shortcuts & User Profile Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              Account Profile
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{user?.name}</h4>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Role</span>
                <span className="font-semibold text-indigo-400 uppercase">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Platform Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              Quick Shortcuts
            </h3>

            <Link
              to="/libraries"
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-xs font-medium text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" /> Discover All Libraries
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/books"
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-xs font-medium text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Browse Book Catalog
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/map"
              className="p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl flex items-center justify-between text-xs font-medium text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Map className="w-4 h-4 text-indigo-400" /> Interactive City Map
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
