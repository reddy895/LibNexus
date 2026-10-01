import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Library,
  BookOpen,
  Armchair,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  History,
  ArrowRight,
  Edit3
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const statsData = await adminService.getStats();
        setStats(statsData.data || statsData);

        const libsData = await libraryService.getLibraries();
        const libsList = Array.isArray(libsData) ? libsData : libsData.data || [];
        setLibraries(libsList);

        const actData = await adminService.getActivityLogs();
        const actList = Array.isArray(actData) ? actData : actData.data || [];
        setActivities(actList.slice(0, 5));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Gathering systemwide library metrics..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E253B] border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Overview Panel</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">Library System Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time occupancy monitoring, catalog metrics, and administrative logs.
          </p>
        </div>

        <Link
          to="/admin/seats"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sharp-crimson transition-transform active:translate-y-0.5"
        >
          <Armchair className="w-4 h-4" /> UPDATE SEAT OCCUPANCY →
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="bg-[#1E253B] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Seats</span>
            <Armchair className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalSeats || 970}</p>
          <p className="text-[11px] text-slate-400">Configured in system</p>
        </div>

        <div className="bg-[#1E253B] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#B93434]">
            <span className="text-[10px] font-black uppercase tracking-wider">Occupied Seats</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-[#B93434]">{stats?.occupiedSeats || 541}</p>
          <p className="text-[11px] text-slate-400">{stats?.occupancyPercentage || 56}% occupied</p>
        </div>

        <div className="bg-[#1E253B] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#159A70]">
            <span className="text-[10px] font-black uppercase tracking-wider">Available Seats</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-[#159A70]">{stats?.availableSeats || 429}</p>
          <p className="text-[11px] text-slate-400">Ready for walk-in</p>
        </div>

        <div className="bg-[#1E253B] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[#E3A72F]">
            <span className="text-[10px] font-black uppercase tracking-wider">Catalog Books</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalBooks ? stats.totalBooks.toLocaleString() : '135,550'}</p>
          <p className="text-[11px] text-slate-400">Physical volumes</p>
        </div>

        <div className="bg-[#1E253B] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-black uppercase tracking-wider">New Arrivals</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-amber-400">{stats?.newArrivalsCount || 12}</p>
          <p className="text-[11px] text-slate-400">Highlighted additions</p>
        </div>

      </div>

      {/* Main Grid: Live Seat Status Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Live Seat Status per Library */}
        <div className="lg:col-span-8 bg-[#1E253B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B93434]">Real-Time Control</span>
              <h2 className="text-lg font-black text-white">Live Seat Status By Library</h2>
            </div>
            <Link to="/admin/seats" className="text-xs font-black text-[#E3A72F] hover:underline uppercase tracking-wider">
              Manage All Seats →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#151A2B] text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l">Library Name</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Occupied</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3 rounded-r text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {libraries.map((lib) => {
                  const total = lib.totalSeats || 180;
                  const occupied = lib.occupiedSeats ?? 56;
                  const available = lib.availableSeats ?? Math.max(0, total - occupied);
                  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;

                  return (
                    <tr key={lib._id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="p-3 font-bold text-white">{lib.name}</td>
                      <td className="p-3 text-slate-400">{total}</td>
                      <td className="p-3 text-[#B93434] font-bold">{occupied}</td>
                      <td className="p-3 text-[#159A70] font-bold">{available}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full ${pct > 80 ? 'bg-[#B93434]' : pct > 50 ? 'bg-[#E3A72F]' : 'bg-[#159A70]'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold">{pct}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to="/admin/seats"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-[#B93434] text-white text-[10px] font-bold uppercase rounded border border-slate-700 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Update
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-4 bg-[#1E253B] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Audit Trail</span>
              <h2 className="text-lg font-black text-white">Recent Activity</h2>
            </div>
            <Link to="/admin/activity" className="text-xs font-bold text-[#E3A72F] hover:underline uppercase">
              Full Log →
            </Link>
          </div>

          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 italic text-center">No recent activity logged.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="p-3 bg-[#151A2B] rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[#B93434] uppercase tracking-wider">{act.action}</span>
                    <span className="text-slate-500">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-white font-medium">{act.details}</p>
                  <p className="text-[10px] text-slate-400">By {act.user}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
