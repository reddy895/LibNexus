import React, { useState, useEffect } from 'react';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Library, Plus, Edit3, Trash2, MapPin, Clock, Phone, Mail, X } from 'lucide-react';

const AdminLibrariesPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [latitude, setLatitude] = useState('12.9716');
  const [longitude, setLongitude] = useState('77.5946');
  const [openingTime, setOpeningTime] = useState('08:00 AM');
  const [closingTime, setClosingTime] = useState('10:00 PM');
  const [totalSeats, setTotalSeats] = useState('180');
  const [occupiedSeats, setOccupiedSeats] = useState('56');
  const [status, setStatus] = useState('open');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const fetchLibraries = async () => {
    setLoading(true);
    try {
      const data = await libraryService.getLibraries();
      const list = Array.isArray(data) ? data : data.data || [];
      setLibraries(list);
    } catch (err) {
      setError(err.message || 'Failed to load libraries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const handleCreateLibrary = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await libraryService.createLibrary({
        name,
        address,
        city,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        openingTime,
        closingTime,
        totalSeats: parseInt(totalSeats, 10),
        occupiedSeats: parseInt(occupiedSeats, 10),
        status,
        image,
        description
      });

      setShowAddModal(false);
      await fetchLibraries();
    } catch (err) {
      setError(err.message || 'Failed to create library');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLibrary = async (id) => {
    if (window.confirm('Deactivating/Deleting this library will remove it from public discovery. Proceed?')) {
      try {
        await libraryService.deleteLibrary(id);
        await fetchLibraries();
      } catch (err) {
        setError(err.message || 'Failed to delete library');
      }
    }
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E253B] border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#B93434]">Network Hubs</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">Library Network Registry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure library metadata, geographic coordinates, opening hours, and default seat capacities.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sharp-crimson transition-transform active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> ADD NEW LIBRARY →
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Add Library Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E253B] border-2 border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">REGISTER NEW PUBLIC LIBRARY</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLibrary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Library Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Indiranagar Knowledge Hub"
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 100 Feet Road, Indiranagar"
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Latitude</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Longitude</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Occupied Seats</label>
                  <input
                    type="number"
                    value={occupiedSeats}
                    onChange={(e) => setOccupiedSeats(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase rounded"
                >
                  {submitting ? 'Saving...' : 'CREATE LIBRARY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading library registry..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraries.map((lib) => (
            <div key={lib._id} className="bg-[#1E253B] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sharp-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#159A70] text-white">
                    {lib.status || 'OPEN'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {lib._id.slice(-6)}</span>
                </div>

                <h3 className="font-extrabold text-lg text-white">{lib.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B93434]" /> {lib.address}
                </p>

                <div className="bg-[#151A2B] p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300 font-bold">
                    <span>Seats:</span>
                    <span className="text-[#159A70]">{lib.availableSeats || 0} Available / {lib.totalSeats || 180} Total</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Operating Hours:</span>
                    <span>{lib.openingTime} - {lib.closingTime}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => handleDeleteLibrary(lib._id)}
                  className="p-2 bg-[#B93434]/20 hover:bg-[#B93434] text-[#B93434] hover:text-white rounded text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminLibrariesPage;
