import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { History, ShieldCheck, User, Clock } from 'lucide-react';

const AdminActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await adminService.getActivityLogs();
        const list = Array.isArray(data) ? data : data.data || [];
        setActivities(list);
      } catch (err) {
        setError(err.message || 'Failed to fetch activity logs');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E253B] border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Security & Compliance</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">Administrative Activity Log</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit history of all administrator seat occupancy updates, book catalog additions, and library settings changes.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#151A2B] rounded-xl border border-slate-700 text-xs font-bold text-slate-300">
          📋 {activities.length} Recorded Actions
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Loading audit trail logs..." />
      ) : (
        <div className="bg-[#1E253B] border border-slate-800 rounded-2xl overflow-hidden shadow-sharp space-y-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#151A2B]">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Chronological Action Trail
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Real-time Logging Enabled</span>
          </div>

          <div className="divide-y divide-slate-800">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 p-8 text-center italic">No administrative actions logged yet.</p>
            ) : (
              activities.map((act) => (
                <div key={act._id} className="p-4 hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#B93434]/20 border border-[#B93434]/50 text-[#B93434] text-[10px] font-black uppercase tracking-wider">
                        {act.action}
                      </span>
                      <span className="text-xs font-bold text-white">{act.details}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#E3A72F]" /> {act.user}</span>
                      {act.libraryId && <span className="font-mono text-[10px] text-slate-500">(Ref: {act.libraryId.slice(-6)})</span>}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400 font-mono shrink-0 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(act.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminActivityPage;
