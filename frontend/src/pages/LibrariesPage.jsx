import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import OccupancyBadge from '../components/OccupancyBadge';
import { Search, MapPin, Clock, BookOpen, Filter, SlidersHorizontal } from 'lucide-react';

const LibrariesPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('updated');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      try {
        const data = await libraryService.getLibraries({
          search: searchQuery,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sort: sortOption
        });
        const list = Array.isArray(data) ? data : data.data || [];
        setLibraries(list);
      } catch (err) {
        setError(err.message || 'Failed to load libraries');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraries();
  }, [searchQuery, statusFilter, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F7FAF5]">

      {/* Header: Carbon Teal Container */}
      <div className="bg-[#042F32] text-white p-8 rounded-2xl border-2 border-[#042F32] shadow-sharp flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D6FFCB]">Discovery Network</span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading mt-1">Bengaluru Libraries</h1>
          <p className="text-xs sm:text-sm text-[#B6C8C5] mt-1 max-w-xl">
            Inspect live seat availability, search catalog sizes, and check operating hours across public libraries before visiting.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#143F40] p-4 rounded-xl border border-[#1B4F51] text-xs">
          <div>
            <p className="text-[#B6C8C5] font-bold uppercase text-[10px]">Total Libraries</p>
            <p className="text-xl font-black text-[#D6FFCB]">{libraries.length}</p>
          </div>
          <div className="border-l border-[#1B4F51] pl-3">
            <p className="text-[#B6C8C5] font-bold uppercase text-[10px]">Status</p>
            <p className="text-xl font-black text-[#D6FFCB]">Live Updates</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-2 border-[#042F32] p-4 rounded-xl shadow-sharp-subtle flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Search Input */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-[#143F40]/60 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search library name, address, city..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg text-xs text-[#042F32] placeholder-[#143F40]/60 focus:outline-none focus:border-[#042F32]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#042F32]" />
            <span className="text-xs font-bold text-[#143F40] uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg text-xs font-bold text-[#042F32] focus:outline-none"
            >
              <option value="all">All Libraries</option>
              <option value="open">Open Now Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#042F32]" />
            <span className="text-xs font-bold text-[#143F40] uppercase">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg text-xs font-bold text-[#042F32] focus:outline-none"
            >
              <option value="updated">Recently Updated</option>
              <option value="name">Alphabetical</option>
              <option value="seats">Most Available Seats</option>
              <option value="books">Largest Book Catalog</option>
            </select>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Fetching live library availability..." />
      ) : libraries.length === 0 ? (
        <div className="bg-white border-2 border-[#042F32] p-12 text-center rounded-xl shadow-sharp">
          <p className="text-lg font-bold text-[#042F32]">No matching libraries found.</p>
          <p className="text-xs text-[#143F40]/80 mt-1">Try clearing your search query or adjusting filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraries.map((lib) => {
            const total = lib.totalSeats || 180;
            const occupied = lib.occupiedSeats ?? 56;
            const available = lib.availableSeats ?? Math.max(0, total - occupied);
            const isOpen = (lib.status || '').toLowerCase() === 'open';

            return (
              <div key={lib._id} className="bg-white border-2 border-[#042F32] rounded-xl overflow-hidden shadow-sharp-subtle card-hover flex flex-col justify-between">
                <div>
                  <div className="h-48 relative overflow-hidden bg-[#042F32]">
                    <img src={lib.image} alt={lib.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#042F32] text-white text-[10px] font-black uppercase tracking-wider">
                      {lib.city || 'Bengaluru'}
                    </span>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${isOpen ? 'bg-[#D6FFCB] text-[#042F32]' : 'bg-rose-500 text-white'}`}>
                      {isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#042F32] leading-tight font-heading">{lib.name}</h3>
                      <p className="text-xs text-[#143F40]/80 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#042F32] shrink-0" /> {lib.address}
                      </p>
                    </div>

                    <OccupancyBadge
                      totalSeats={total}
                      occupiedSeats={occupied}
                      availableSeats={available}
                      updatedAt={lib.updatedAt}
                    />

                    <div className="flex justify-between items-center text-xs text-[#143F40] pt-1 font-semibold border-t border-[#DFE8DC]">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#042F32]" /> {lib.totalBooks ? lib.totalBooks.toLocaleString() : '12,000+'} books
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#143F40]/60" /> {lib.openingTime} - {lib.closingTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/libraries/${lib._id}`}
                    className="block w-full text-center py-2.5 bg-[#042F32] hover:bg-[#143F40] text-[#D6FFCB] font-black text-xs uppercase tracking-wider rounded-lg transition-colors font-heading"
                  >
                    VIEW LIBRARY →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default LibrariesPage;

