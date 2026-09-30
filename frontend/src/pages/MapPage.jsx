import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import MapView from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { MapPin, Search, Star, Users, Calendar, Sparkles, Navigation } from 'lucide-react';

const MapPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await libraryService.getLibraries();
        const list = data.libraries || data;
        setLibraries(list);
        if (list.length > 0) setSelectedLibrary(list[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load libraries for map');
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  const filteredLibraries = libraries.filter(
    (lib) =>
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lib.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Map View
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Citywide Library Network</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover library locations visually, check live seat availability, and find nearby study hubs.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city or library..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Rendering interactive map..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
          {/* Left Sidebar: Library List */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              Locations ({filteredLibraries.length})
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {filteredLibraries.map((library) => {
                const isSelected = selectedLibrary?._id === library._id;
                return (
                  <div
                    key={library._id}
                    onClick={() => setSelectedLibrary(library)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500/60 shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-white">{library.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-indigo-400 border border-slate-700">
                        {library.city}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span className="truncate">{library.address}</span>
                    </p>

                    <div className="flex items-center justify-between mt-3 text-xs pt-2 border-t border-slate-800">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {library.rating || 4.8}
                      </span>

                      <span className={`font-medium ${library.availableSeats > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {library.availableSeats} / {library.totalSeats} seats free
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-indigo-500/20 flex gap-2">
                        <Link
                          to={`/libraries/${library._id}/seats`}
                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold text-center rounded-lg transition-colors"
                        >
                          Book Seat
                        </Link>
                        <Link
                          to={`/libraries/${library._id}`}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium text-center rounded-lg transition-colors border border-slate-700"
                        >
                          Details
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Column: Leaflet Map Container */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-full">
            <MapView
              libraries={filteredLibraries}
              selectedLibrary={selectedLibrary}
              onSelectLibrary={(lib) => setSelectedLibrary(lib)}
              height="100%"
              zoom={12}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
