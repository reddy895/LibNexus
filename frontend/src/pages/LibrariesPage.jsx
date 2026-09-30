import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import libraryService from '../services/libraryService';
import LibraryCard from '../components/LibraryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { Search, Filter, MapPin, Sparkles, SlidersHorizontal } from 'lucide-react';

const CITIES = ['All Cities', 'New York', 'San Francisco', 'Chicago', 'Boston', 'Seattle', 'Austin'];

const AMENITIES_LIST = [
  'WiFi',
  'AC',
  'Power Outlets',
  'Quiet Zone',
  'Cafe',
  'Printer',
  'Discussion Rooms',
];

const LibrariesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const fetchLibraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCity !== 'All Cities') params.city = selectedCity;
      if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');
      if (sortBy) params.sort = sortBy;

      const data = await libraryService.getLibraries(params);
      setLibraries(data.libraries || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch libraries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, [selectedCity, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLibraries();
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Discovery Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Find Your Next Study Sanctuary
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Explore premium public and university libraries, check real-time seat availability, and reserve your space instantly.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by library name, city, or address..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold text-white text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Search Libraries
            </button>
          </form>
        </div>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-1.5 border rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
              showFilters || selectedAmenities.length > 0
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters {selectedAmenities.length > 0 && `(${selectedAmenities.length})`}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="rating">Sort: Highest Rated</option>
            <option value="availableSeats">Sort: Most Seats Free</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Expanded Amenity Filters */}
      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter by Amenities
            </span>
            {selectedAmenities.length > 0 && (
              <button
                onClick={() => setSelectedAmenities([])}
                className="text-xs text-indigo-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={fetchLibraries}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Apply Amenities Filter
            </button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && <ErrorMessage message={error} onRetry={fetchLibraries} />}

      {/* Content Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching libraries..." />
      ) : libraries.length === 0 ? (
        <EmptyState
          title="No Libraries Found"
          message="We couldn't find any libraries matching your search criteria. Try adjusting your search query or filters."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCity('All Cities');
            setSelectedAmenities([]);
            setSortBy('rating');
            fetchLibraries();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraries.map((library) => (
            <LibraryCard key={library._id} library={library} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibrariesPage;
