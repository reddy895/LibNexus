import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import MapView from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { MapPin, Search, Sparkles, Filter, Navigation } from 'lucide-react';

const MapPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

  const filteredLibraries = libraries.filter((lib) => {
    const matchesSearch =
      lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lib.city && lib.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lib.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || (lib.status || '').toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-[#F7FAF5]">

      {/* Header: Carbon Teal Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#042F32] text-white p-6 rounded-2xl border-2 border-[#042F32] shadow-sharp">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#143F40] border border-[#1B4F51] text-[#D6FFCB] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D6FFCB]" /> Interactive City Map
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">Bengaluru Library Network Map</h1>
          <p className="text-xs sm:text-sm text-[#B6C8C5] mt-1">
            Visual location discovery, real-time seat counts, and map layer switching with zero API key dependencies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center bg-[#143F40] border border-[#1B4F51] rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === 'all' ? 'bg-[#D6FFCB] text-[#042F32]' : 'text-[#B6C8C5] hover:text-white'
              }`}
            >
              All ({libraries.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                statusFilter === 'open' ? 'bg-[#D6FFCB] text-[#042F32]' : 'text-[#B6C8C5] hover:text-white'
              }`}
            >
              Open Now
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#B6C8C5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area or library..."
              className="w-full pl-9 pr-3 py-2 bg-[#143F40] border border-[#1B4F51] rounded-xl text-xs text-white placeholder-[#B6C8C5] focus:outline-none focus:border-[#D6FFCB]"
            />
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Rendering interactive library map..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px] lg:h-[680px]">

          {/* Left Sidebar: Library List */}
          <div className="lg:col-span-4 bg-white border-2 border-[#042F32] rounded-2xl p-4 flex flex-col overflow-hidden h-[450px] lg:h-full shadow-sharp">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#143F40]/80 font-heading flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#042F32]" /> Locations ({filteredLibraries.length})
              </h3>
              <span className="text-[10px] font-bold text-[#10B981] bg-[#D6FFCB]/60 px-2 py-0.5 rounded border border-[#BAF7AB]">
                Live Seat Badges
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {filteredLibraries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#143F40]/70 italic">
                  No libraries match your search or status filter.
                </div>
              ) : (
                filteredLibraries.map((library) => {
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
                          ? 'bg-[#042F32] text-white border-[#042F32] shadow-md scale-[1.01]'
                          : 'bg-[#F7FAF5] border-[#DFE8DC] text-[#042F32] hover:border-[#042F32]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-sm leading-tight font-heading">{library.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase shrink-0 ${isOpen ? 'bg-[#D6FFCB] text-[#042F32] border border-[#BAF7AB]' : 'bg-rose-500 text-white'}`}>
                          {isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </div>

                      <p className={`text-xs flex items-center gap-1 mt-1 ${isSelected ? 'text-[#B6C8C5]' : 'text-[#143F40]/80'}`}>
                        <MapPin className="w-3 h-3 text-[#D6FFCB] shrink-0" />
                        <span className="truncate">{library.address}</span>
                      </p>

                      <div className="mt-3 pt-2 border-t border-[#DFE8DC]/40 text-xs flex justify-between items-center font-semibold">
                        <span className={isSelected ? 'text-[#D6FFCB]' : 'text-[#10B981]'}>
                          🪑 {available} / {total} seats free
                        </span>
                        <span className={isSelected ? 'text-[#B6C8C5]' : 'text-[#143F40]/70'}>
                          📚 {library.totalBooks ? library.totalBooks.toLocaleString() : '12k+'} books
                        </span>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-[#143F40] flex gap-2">
                          <Link
                            to={`/libraries/${library._id}`}
                            className="w-full py-1.5 bg-[#D6FFCB] hover:bg-[#BAF7AB] text-[#042F32] text-xs font-black uppercase text-center rounded transition-colors font-heading"
                          >
                            VIEW DETAILS →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Column: Leaflet Map */}
          <div className="lg:col-span-8 bg-white border-2 border-[#042F32] rounded-2xl overflow-hidden h-[500px] lg:h-full shadow-sharp">
            <MapView
              libraries={filteredLibraries}
              center={selectedLibrary ? [selectedLibrary.latitude, selectedLibrary.longitude] : [12.9716, 77.5946]}
              onSelectLibrary={(lib) => setSelectedLibrary(lib)}
              selectedLibraryId={selectedLibrary?._id}
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




