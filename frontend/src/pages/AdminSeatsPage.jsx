import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Armchair, CheckCircle2, AlertCircle, RefreshCw, Save, Check, X, ShieldAlert } from 'lucide-react';

const AdminSeatsPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [formTotalSeats, setFormTotalSeats] = useState('');
  const [formOccupiedSeats, setFormOccupiedSeats] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchLibraries = async () => {
    setLoading(true);
    try {
      const data = await libraryService.getLibraries();
      const list = Array.isArray(data) ? data : data.data || [];
      setLibraries(list);
    } catch (err) {
      console.error('Error fetching libraries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const handleStartEdit = (lib) => {
    setEditingLibrary(lib);
    setFormTotalSeats(lib.totalSeats || 180);
    setFormOccupiedSeats(lib.occupiedSeats ?? 56);
    setValidationError(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingLibrary(null);
    setValidationError(null);
  };

  const handleUpdateSeats = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    const total = parseInt(formTotalSeats, 10);
    const occupied = parseInt(formOccupiedSeats, 10);

    if (isNaN(total) || isNaN(occupied)) {
      setValidationError('Please enter valid numbers for total and occupied seats.');
      return;
    }

    if (occupied > total) {
      setValidationError(`Occupied seats (${occupied}) cannot exceed total seats (${total}).`);
      return;
    }

    if (total < 0 || occupied < 0) {
      setValidationError('Seat numbers cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.updateSeats(editingLibrary._id, occupied, total);
      setSuccessMessage(`Successfully updated seat availability for ${editingLibrary.name}`);
      setEditingLibrary(null);
      await fetchLibraries();
    } catch (err) {
      setValidationError(err.message || 'Failed to update seat occupancy');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate live preview available seats in form
  const previewTotal = parseInt(formTotalSeats, 10) || 0;
  const previewOccupied = parseInt(formOccupiedSeats, 10) || 0;
  const previewAvailable = Math.max(0, previewTotal - previewOccupied);
  const previewPct = previewTotal > 0 ? Math.round((previewOccupied / previewTotal) * 100) : 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E253B] border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#B93434]">Administrator Control</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">Live Seat Availability Management</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Continuously update seat occupancy across public libraries. Available seats automatically calculate as <code className="text-[#E3A72F] font-mono">totalSeats - occupiedSeats</code> and reflect immediately on the public site and map.
          </p>
        </div>

        <button
          onClick={fetchLibraries}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded-lg border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-[#159A70]/20 border border-[#159A70] rounded-xl text-xs text-emerald-200 font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#159A70]" /> {successMessage}
          </span>
          <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Interactive Update Modal / Panel */}
      {editingLibrary && (
        <div className="bg-[#1E253B] border-2 border-[#B93434] rounded-2xl p-6 shadow-sharp-crimson space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B93434]">Editing Library</span>
              <h2 className="text-xl font-black text-white">{editingLibrary.name}</h2>
            </div>
            <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {validationError && (
            <div className="p-3 bg-[#B93434]/20 border border-[#B93434] rounded-lg text-xs text-rose-200 flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-[#B93434] shrink-0" /> {validationError}
            </div>
          )}

          <form onSubmit={handleUpdateSeats} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Total Configured Seats
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formTotalSeats}
                  onChange={(e) => setFormTotalSeats(e.target.value)}
                  placeholder="e.g. 180"
                  className="w-full px-3 py-2.5 bg-[#151A2B] border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-[#E3A72F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Occupied Seats (Currently Seated Readers)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formOccupiedSeats}
                  onChange={(e) => setFormOccupiedSeats(e.target.value)}
                  placeholder="e.g. 56"
                  className="w-full px-3 py-2.5 bg-[#151A2B] border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-[#B93434]"
                />
              </div>

            </div>

            {/* Calculated Output Preview */}
            <div className="bg-[#151A2B] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Automatic Calculation Preview</span>

              <div className="grid grid-cols-3 gap-4 text-center py-2 border-t border-slate-800 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Occupied</p>
                  <p className="text-xl font-black text-[#B93434]">{previewOccupied}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Calculated Available</p>
                  <p className="text-xl font-black text-[#159A70]">{previewAvailable}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Occupancy Rate</p>
                  <p className="text-xl font-black text-[#E3A72F]">{previewPct}%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase rounded-lg border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sharp-crimson transition-transform active:translate-y-0.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {submitting ? 'Saving...' : 'SAVE & PUBLISH AVAILABILITY →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Libraries Seat Management List */}
      {loading ? (
        <LoadingSpinner message="Loading seat configuration table..." />
      ) : (
        <div className="bg-[#1E253B] border border-slate-800 rounded-2xl overflow-hidden shadow-sharp">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Library Occupancy Registry ({libraries.length})
            </h3>
            <span className="text-[11px] text-slate-400 italic">
              Click "Update Occupancy" to adjust live seats
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#151A2B] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Library Name</th>
                  <th className="p-4">Total Seats</th>
                  <th className="p-4">Occupied</th>
                  <th className="p-4">Available</th>
                  <th className="p-4">Occupancy %</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {libraries.map((lib) => {
                  const total = lib.totalSeats || 180;
                  const occupied = lib.occupiedSeats ?? 56;
                  const available = lib.availableSeats ?? Math.max(0, total - occupied);
                  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
                  const timeAgo = lib.updatedAt ? new Date(lib.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

                  return (
                    <tr key={lib._id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="p-4 font-bold text-white">
                        {lib.name}
                        <p className="text-[10px] text-slate-400 font-normal">{lib.address}</p>
                      </td>
                      <td className="p-4 font-bold text-slate-300">{total}</td>
                      <td className="p-4 font-black text-[#B93434]">{occupied}</td>
                      <td className="p-4 font-black text-[#159A70]">{available}</td>
                      <td className="p-4 font-bold text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${pct > 80 ? 'bg-[#B93434] text-white' : pct > 50 ? 'bg-[#E3A72F] text-slate-900' : 'bg-[#159A70] text-white'}`}>
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">{timeAgo}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleStartEdit(lib)}
                          className="px-3 py-1.5 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-bold uppercase rounded transition-colors shadow-sm"
                        >
                          Update Occupancy
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSeatsPage;
