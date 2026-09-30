import React, { useState, useEffect } from 'react';
import libraryService from '../services/libraryService';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Building2, Plus, Edit2, Trash2, MapPin, X, Check } from 'lucide-react';

const AdminLibrariesPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLib, setEditingLib] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    latitude: 40.758,
    longitude: -73.9855,
    operatingHours: '08:00 AM - 10:00 PM',
    phone: '',
    email: '',
    totalSeats: 36,
    description: '',
    image: '',
    amenities: 'WiFi, AC, Power Outlets, Quiet Zone'
  });

  const fetchLibraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getLibraries();
      setLibraries(data.libraries || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch libraries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const openCreateModal = () => {
    setEditingLib(null);
    setFormData({
      name: '',
      address: '',
      city: 'New York',
      latitude: 40.758,
      longitude: -73.9855,
      operatingHours: '08:00 AM - 10:00 PM',
      phone: '+1 (555) 000-0000',
      email: 'contact@library.org',
      totalSeats: 36,
      description: 'Modern public library with study quiet zones and high speed wifi.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      amenities: 'WiFi, AC, Power Outlets, Quiet Zone'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lib) => {
    setEditingLib(lib);
    setFormData({
      name: lib.name || '',
      address: lib.address || '',
      city: lib.city || 'New York',
      latitude: lib.latitude || 40.758,
      longitude: lib.longitude || -73.9855,
      operatingHours: lib.operatingHours || '08:00 AM - 10:00 PM',
      phone: lib.phone || '',
      email: lib.email || '',
      totalSeats: lib.totalSeats || 36,
      description: lib.description || '',
      image: lib.image || '',
      amenities: lib.amenities ? lib.amenities.join(', ') : 'WiFi, AC, Power Outlets'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        totalSeats: parseInt(formData.totalSeats, 10),
        amenities: typeof formData.amenities === 'string' ? formData.amenities.split(',').map((a) => a.trim()) : formData.amenities
      };

      if (editingLib) {
        await adminService.updateLibrary(editingLib._id, payload);
      } else {
        await adminService.createLibrary(payload);
      }

      setIsModalOpen(false);
      fetchLibraries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save library');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this library location? All associated seats will be removed.')) return;
    try {
      await adminService.deleteLibrary(id);
      fetchLibraries();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete library');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-400" />
            Library Locations Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, inspect, and update partner library locations in the network.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Library
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchLibraries} />}

      {loading ? (
        <LoadingSpinner message="Fetching library records..." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Library Name</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Total Seats</th>
                  <th className="p-4">Available Seats</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {libraries.map((lib) => (
                  <tr key={lib._id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img
                        src={lib.image || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      {lib.name}
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{lib.city}</td>
                    <td className="p-4 text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                      {lib.address}
                    </td>
                    <td className="p-4 font-bold text-slate-200">{lib.totalSeats}</td>
                    <td className="p-4 font-bold text-emerald-400">{lib.availableSeats}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(lib)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lib._id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingLib ? 'Edit Library Location' : 'Add New Partner Library'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Library Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Seats</label>
                  <input
                    type="number"
                    required
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  {editingLib ? 'Update Library' : 'Create Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLibrariesPage;
