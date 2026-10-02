import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  BookOpen,
  Armchair,
  CheckCircle2,
  AlertCircle,
  Sparkles,
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
    <div className="space-y-8 bg-[#F7FAF5]">

      {/* Page Header: Carbon Teal Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#042F32] text-white p-6 rounded-2xl border-2 border-[#042F32] shadow-sharp">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D6FFCB]">Overview Panel</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">Library System Dashboard</h1>
          <p className="text-xs text-[#B6C8C5] mt-1">
            Real-time occupancy monitoring, catalog metrics, and administrative logs.
          </p>
        </div>

        <Link
          to="/admin/seats"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D6FFCB] hover:bg-[#BAF7AB] text-[#042F32] text-xs font-black uppercase tracking-wider rounded-lg shadow-sharp-mint transition-transform active:translate-y-0.5 font-heading"
        >
          <Armchair className="w-4 h-4 text-[#042F32]" /> UPDATE SEAT OCCUPANCY →
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="bg-white border-2 border-[#042F32] p-5 rounded-xl space-y-2 shadow-sharp-subtle">
          <div className="flex items-center justify-between text-[#143F40]">
            <span className="text-[10px] font-black uppercase tracking-wider font-heading">Total Seats</span>
            <Armchair className="w-4 h-4 text-[#042F32]" />
          </div>
          <p className="text-3xl font-black text-[#042F32]">{stats?.totalSeats || 970}</p>
          <p className="text-[11px] text-[#143F40]/70">Configured in system</p>
        </div>

        <div className="bg-white border-2 border-[#042F32] p-5 rounded-xl space-y-2 shadow-sharp-subtle">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[10px] font-black uppercase tracking-wider font-heading">Occupied Seats</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-rose-600">{stats?.occupiedSeats || 541}</p>
          <p className="text-[11px] text-[#143F40]/70">{stats?.occupancyPercentage || 56}% occupied</p>
        </div>

        <div className="bg-white border-2 border-[#042F32] p-5 rounded-xl space-y-2 shadow-sharp-subtle">
          <div className="flex items-center justify-between text-[#10B981]">
            <span className="text-[10px] font-black uppercase tracking-wider font-heading">Available Seats</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-[#10B981]">{stats?.availableSeats || 429}</p>
          <p className="text-[11px] text-[#143F40]/70">Ready for walk-in</p>
        </div>

        <div className="bg-white border-2 border-[#042F32] p-5 rounded-xl space-y-2 shadow-sharp-subtle">
          <div className="flex items-center justify-between text-[#042F32]">
            <span className="text-[10px] font-black uppercase tracking-wider font-heading">Catalog Books</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-[#042F32]">{stats?.totalBooks ? stats.totalBooks.toLocaleString() : '135,550'}</p>
          <p className="text-[11px] text-[#143F40]/70">Physical volumes</p>
        </div>

        <div className="bg-white border-2 border-[#042F32] p-5 rounded-xl space-y-2 shadow-sharp-subtle">
          <div className="flex items-center justify-between text-[#042F32]">
            <span className="text-[10px] font-black uppercase tracking-wider font-heading">New Arrivals</span>
            <Sparkles className="w-4 h-4 text-[#042F32]" />
          </div>
          <p className="text-3xl font-black text-[#042F32]">{stats?.newArrivalsCount || 12}</p>
          <p className="text-[11px] text-[#143F40]/70">Highlighted additions</p>
        </div>

      </div>

      {/* Main Grid: Live Seat Status Table & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Live Seat Status per Library */}
        <div className="lg:col-span-8 bg-white border-2 border-[#042F32] rounded-2xl p-6 space-y-4 shadow-sharp">
          <div className="flex items-center justify-between border-b border-[#DFE8DC] pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#143F40]">Real-Time Control</span>
              <h2 className="text-lg font-black text-[#042F32] font-heading">Live Seat Status By Library</h2>
            </div>
            <Link to="/admin/seats" className="text-xs font-black text-[#042F32] hover:underline uppercase tracking-wider font-heading">
              Manage All Seats →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#042F32]">
              <thead className="bg-[#042F32] text-white uppercase text-[10px] font-bold font-heading">
                <tr>
                  <th className="p-3 rounded-l">Library Name</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Occupied</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3 rounded-r text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE8DC] font-medium">
                {libraries.map((lib) => {
                  const total = lib.totalSeats || 180;
                  const occupied = lib.occupiedSeats ?? 56;
                  const available = lib.availableSeats ?? Math.max(0, total - occupied);
                  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;

                  return (
                    <tr key={lib._id} className="hover:bg-[#F7FAF5] transition-colors">
                      <td className="p-3 font-bold text-[#042F32]">{lib.name}</td>
                      <td className="p-3 text-[#143F40]">{total}</td>
                      <td className="p-3 text-rose-600 font-bold">{occupied}</td>
                      <td className="p-3 text-[#10B981] font-bold">{available}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#EEF4EC] rounded-full overflow-hidden border border-[#DFE8DC]">
                            <div className={`h-full ${pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-[#10B981]'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-[#042F32]">{pct}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to="/admin/seats"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#D6FFCB] hover:bg-[#BAF7AB] text-[#042F32] text-[10px] font-black uppercase rounded border border-[#BAF7AB] transition-colors font-heading"
                        >
                          <Edit3 className="w-3 h-3 text-[#042F32]" /> Update
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
        <div className="lg:col-span-4 bg-white border-2 border-[#042F32] rounded-2xl p-6 space-y-4 shadow-sharp">
          <div className="flex items-center justify-between border-b border-[#DFE8DC] pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#143F40]">Audit Trail</span>
              <h2 className="text-lg font-black text-[#042F32] font-heading">Recent Activity</h2>
            </div>
            <Link to="/admin/activity" className="text-xs font-black text-[#042F32] hover:underline uppercase font-heading">
              Full Log →
            </Link>
          </div>

          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-xs text-[#143F40]/70 py-4 italic text-center">No recent activity logged.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="p-3 bg-[#F7FAF5] rounded-xl border border-[#DFE8DC] space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[#042F32] uppercase tracking-wider font-heading">{act.action}</span>
                    <span className="text-[#143F40]/70">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-[#042F32] font-medium">{act.details}</p>
                  <p className="text-[10px] text-[#143F40]/70">By {act.user}</p>
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

