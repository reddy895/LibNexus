import React, { useState, useEffect } from 'react';
import libraryService from '../services/libraryService';
import seatService from '../services/seatService';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Calendar, Building2, Zap, Eye, Wrench, CheckCircle } from 'lucide-react';

const AdminSeatsPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState('');
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const data = await libraryService.getLibraries();
        const list = data.libraries || data;
        setLibraries(list);
        if (list.length > 0) setSelectedLibraryId(list[0]._id);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load libraries');
      }
    };
    fetchLibraries();
  }, []);

  const fetchSeats = async () => {
    if (!selectedLibraryId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await seatService.getSeatsByLibrary(selectedLibraryId);
      setSeats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch seats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [selectedLibraryId]);

  const handleToggleMaintenance = async (seat) => {
    const newStatus = seat.status === 'maintenance' ? 'available' : 'maintenance';
    try {
      await adminService.updateSeatStatus(seat._id, { status: newStatus });
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update seat status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            Library Floor Seat Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure seat zones, view live floor plans, and flag seats for maintenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedLibraryId}
            onChange={(e) => setSelectedLibraryId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {libraries.map((lib) => (
              <option key={lib._id} value={lib._id}>{lib.name} ({lib.city})</option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSeats} />}

      {loading ? (
        <LoadingSpinner message="Fetching seat map..." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
              Total Seats ({seats.length})
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Operational ({seats.filter(s => s.status !== 'maintenance').length})
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Maintenance ({seats.filter(s => s.status === 'maintenance').length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {seats.map((seat) => {
              const isMaintenance = seat.status === 'maintenance';
              return (
                <div
                  key={seat._id}
                  className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                    isMaintenance
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white">{seat.seatNumber}</span>
                    <div className="flex items-center gap-1 text-[10px]">
                      {seat.hasPower && <Zap className="w-3 h-3 text-amber-400" />}
                      {seat.hasWindowView && <Eye className="w-3 h-3 text-sky-400" />}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 block truncate">{seat.zone}</span>

                  <button
                    onClick={() => handleToggleMaintenance(seat)}
                    className={`w-full py-1 text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1 ${
                      isMaintenance
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-700 hover:bg-rose-600/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isMaintenance ? (
                      <>
                        <CheckCircle className="w-3 h-3" /> Enable
                      </>
                    ) : (
                      <>
                        <Wrench className="w-3 h-3" /> Maintenance
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeatsPage;
