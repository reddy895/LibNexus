import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Users,
  Building2,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const statsData = await adminService.getStats();
        setStats(statsData);

        const bookingsData = await adminService.getAllBookings();
        setRecentBookings(bookingsData.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching system telemetry..." />;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Platform Governance
          </span>
          <h1 className="text-3xl font-extrabold text-white">System Admin Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time insights across libraries, catalog items, seat bookings, and user accounts.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalUsers || 0}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Active accounts registered</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Partner Libraries</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalLibraries || 0}</div>
          <span className="text-[11px] text-purple-400 font-medium">Locations in network</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Book Catalog</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalBooks || 0}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Total titles indexed</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Seat Bookings</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalBookings || 0}</div>
          <span className="text-[11px] text-amber-400 font-medium">Reservations processed</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/libraries"
          className="p-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all shadow-sm space-y-2 group"
        >
          <Building2 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-white text-base">Manage Libraries</h3>
          <p className="text-xs text-slate-400">Add, edit or configure partner library locations.</p>
        </Link>

        <Link
          to="/admin/books"
          className="p-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all shadow-sm space-y-2 group"
        >
          <BookOpen className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-white text-base">Manage Catalog</h3>
          <p className="text-xs text-slate-400">Add books, edit copies, update categories.</p>
        </Link>

        <Link
          to="/admin/seats"
          className="p-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all shadow-sm space-y-2 group"
        >
          <Calendar className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-white text-base">Manage Seats</h3>
          <p className="text-xs text-slate-400">View floor plans and toggle seat status.</p>
        </Link>

        <Link
          to="/admin/users"
          className="p-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all shadow-sm space-y-2 group"
        >
          <Users className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-white text-base">Manage Accounts</h3>
          <p className="text-xs text-slate-400">Promote users, manage roles and access.</p>
        </Link>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Recent Platform Bookings
          </h2>
          <span className="text-xs text-slate-400">Latest system activity</span>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No bookings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Library</th>
                  <th className="p-3">Seat Code</th>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{b.user?.name || b.user?.email || 'User'}</td>
                    <td className="p-3 text-slate-300">{b.library?.name || 'Library'}</td>
                    <td className="p-3 font-mono text-indigo-400 font-bold">{b.seat?.seatNumber || 'N/A'}</td>
                    <td className="p-3 text-slate-300">{b.date} ({b.startTime} - {b.endTime})</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
