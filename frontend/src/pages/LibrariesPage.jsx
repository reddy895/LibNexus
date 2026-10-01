import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import OccupancyBadge from '../components/OccupancyBadge';
import { Search, MapPin, Clock, BookOpen, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="bg-[#151A2B] text-white p-8 rounded-2xl border-2 border-[#151A2B] shadow-sharp flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Discovery Network</span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading mt-1">Bengaluru Libraries</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Inspect live seat availability, search catalog sizes, and check operating hours across public libraries before visiting.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#1E253B] p-4 rounded-xl border border-slate-700 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">Total Libraries</p>
            <p className="text-xl font-black text-[#E3A72F]">{libraries.length}</p>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Status</p>
            <p className="text-xl font-black text-[#159A70]">Live Updates</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-2 border-[#151A2B] p-4 rounded-xl shadow-sharp-subtle flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Search Input */}
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search library name, address, city..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F5F1] border border-[#E4DFD5] rounded-lg text-xs text-[#151A2B] placeholder-slate-400 focus:outline-none focus:border-[#151A2B]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#B93434]" />
            <span className="text-xs font-bold text-slate-600 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F7F5F1] border border-[#E4DFD5] rounded-lg text-xs font-bold text-[#151A2B] focus:outline-none"
            >
              <option value="all">All Libraries</option>
              <option value="open">Open Now Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E3A72F]" />
            <span className="text-xs font-bold text-slate-600 uppercase">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 bg-[#F7F5F1] border border-[#E4DFD5] rounded-lg text-xs font-bold text-[#151A2B] focus:outline-none"
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
        <div className="bg-white border-2 border-[#151A2B] p-12 text-center rounded-xl shadow-sharp">
          <p className="text-lg font-bold text-slate-600">No matching libraries found.</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or adjusting filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraries.map((lib) => {
            const total = lib.totalSeats || 180;
            const occupied = lib.occupiedSeats ?? 56;
            const available = lib.availableSeats ?? Math.max(0, total - occupied);
            const isOpen = (lib.status || '').toLowerCase() === 'open';

            return (
              <div key={lib._id} className="bg-white border-2 border-[#151A2B] rounded-xl overflow-hidden shadow-sharp-subtle card-hover flex flex-col justify-between">
                <div>
                  <div className="h-48 relative overflow-hidden bg-slate-100">
                    <img src={lib.image} alt={lib.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#151A2B] text-white text-[10px] font-black uppercase tracking-wider">
                      {lib.city || 'Bengaluru'}
                    </span>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${isOpen ? 'bg-[#159A70] text-white' : 'bg-[#B93434] text-white'}`}>
                      {isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#151A2B] leading-tight">{lib.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B93434] shrink-0" /> {lib.address}
                      </p>
                    </div>

                    <OccupancyBadge
                      totalSeats={total}
                      occupiedSeats={occupied}
                      availableSeats={available}
                      updatedAt={lib.updatedAt}
                    />

                    <div className="flex justify-between items-center text-xs text-slate-600 pt-1 font-semibold border-t border-[#E4DFD5]">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#E3A72F]" /> {lib.totalBooks ? lib.totalBooks.toLocaleString() : '12,000+'} books
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {lib.openingTime} - {lib.closingTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/libraries/${lib._id}`}
                    className="block w-full text-center py-2.5 bg-[#151A2B] hover:bg-[#1E253B] text-white font-black text-xs uppercase tracking-wider rounded-lg transition-colors"
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
