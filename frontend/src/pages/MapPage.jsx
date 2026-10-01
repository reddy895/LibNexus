import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import MapView from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import OccupancyBadge from '../components/OccupancyBadge';
import { MapPin, Search, Star, BookOpen, Clock, Sparkles } from 'lucide-react';

const MapPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      try {
        const data = await libraryService.getLibraries();
        const list = Array.isArray(data) ? data : data.data || [];
        setLibraries(list);
        if (list.length > 0) setSelectedLibrary(list[0]);
      } catch (err) {
        setError(err.message || 'Failed to load libraries for map');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  const filteredLibraries = libraries.filter(
    (lib) =>
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lib.city && lib.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lib.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151A2B] text-white p-6 rounded-2xl border-2 border-[#151A2B] shadow-sharp">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3A72F]/20 text-[#E3A72F] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive City Map
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">Bengaluru Library Network Map</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Discover library locations visually, inspect live seat availability, and explore regional study hubs.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by area or library..."
            className="w-full pl-9 pr-3 py-2 bg-[#1E253B] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E3A72F]"
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Rendering interactive library map..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">

          {/* Left Sidebar: Library List */}
          <div className="lg:col-span-4 bg-white border-2 border-[#151A2B] rounded-2xl p-4 flex flex-col overflow-hidden h-full shadow-sharp">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-1">
              Locations ({filteredLibraries.length})
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {filteredLibraries.map((library) => {
                const isSelected = selectedLibrary?._id === library._id;
                const total = library.totalSeats || 180;
                const occupied = library.occupiedSeats ?? 56;
                const available = library.availableSeats ?? Math.max(0, total - occupied);
                const isOpen = (library.status || '').toLowerCase() === 'open';

                return (
                  <div
                    key={library._id}
                    onClick={() => setSelectedLibrary(library)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#151A2B] text-white border-[#151A2B] shadow-md'
                        : 'bg-[#F7F5F1] border-[#E4DFD5] text-[#151A2B] hover:border-[#151A2B]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-sm leading-tight">{library.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase shrink-0 ${isOpen ? 'bg-[#159A70] text-white' : 'bg-[#B93434] text-white'}`}>
                        {isOpen ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>

                    <p className={`text-xs flex items-center gap-1 mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      <MapPin className="w-3 h-3 text-[#B93434] shrink-0" />
                      <span className="truncate">{library.address}</span>
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/40 text-xs flex justify-between items-center font-semibold">
                      <span className={isSelected ? 'text-[#E3A72F]' : 'text-[#159A70]'}>
                        🪑 {available} / {total} seats free
                      </span>
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                        📚 {library.totalBooks ? library.totalBooks.toLocaleString() : '12k+'} books
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-700 flex gap-2">
                        <Link
                          to={`/libraries/${library._id}`}
                          className="w-full py-1.5 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase text-center rounded transition-colors"
                        >
                          VIEW DETAILS →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Column: Leaflet Map */}
          <div className="lg:col-span-8 bg-white border-2 border-[#151A2B] rounded-2xl overflow-hidden h-full shadow-sharp">
            <MapView
              libraries={filteredLibraries}
              center={selectedLibrary ? [selectedLibrary.latitude, selectedLibrary.longitude] : [12.9716, 77.5946]}
              onSelectLibrary={(lib) => setSelectedLibrary(lib)}
              height="100%"
              zoom={13}
            />
          </div>

        </div>
      )}

    </div>
  );
};

export default MapPage;
