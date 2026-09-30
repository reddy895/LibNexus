import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import bookService from '../services/bookService';
import MapView from '../components/MapView';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Wifi,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const LibraryDetailsPage = () => {
  const { id } = useParams();
  const [library, setLibrary] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const libData = await libraryService.getLibraryById(id);
        setLibrary(libData);

        // Fetch books for this library
        const booksData = await bookService.getBooks({ libraryId: id });
        setBooks(booksData.books || booksData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load library details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading library details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!library) return <ErrorMessage message="Library not found." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <Link to="/libraries" className="hover:text-white transition-colors">Libraries</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-200 font-medium">{library.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={library.image || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80'}
            alt={library.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Rating & Availability Pills */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{library.rating || 4.8} / 5.0</span>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
              library.availableSeats > 0
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              <Users className="w-4 h-4" />
              <span>{library.availableSeats} / {library.totalSeats} Seats Free</span>
            </div>
          </div>

          {/* Title & Info on Image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-600/80 text-white text-xs font-medium mb-2">
                {library.city}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {library.name}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                {library.address}
              </p>
            </div>

            {/* Main CTA */}
            <Link
              to={`/libraries/${library._id}/seats`}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              Reserve a Seat Now
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-800 bg-slate-900/90 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Location
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'books'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Book Catalog ({books.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                About {library.name}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {library.description || `${library.name} is a modern library facility located in ${library.city}, offering state-of-the-art study spaces, high-speed Wi-Fi, computer labs, and a comprehensive collection of books and research materials.`}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wifi className="w-4 h-4 text-indigo-400" />
                Available Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {library.amenities && library.amenities.length > 0 ? (
                  library.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-xs font-medium"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  ['High-Speed Wi-Fi', 'Power Outlets', 'AC / Climate Control', 'Quiet Study Zone', 'Printing Services', 'Coffee Machine'].map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-xs font-medium"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Location & Interactive Map */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Interactive Map Location
              </h2>
              <div className="h-80 rounded-xl overflow-hidden border border-slate-700/80">
                <MapView libraries={[library]} height="100%" zoom={15} />
              </div>
            </div>
          </div>

          {/* Sidebar Specs */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Quick Specifications
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-200">Operating Hours</span>
                    <span className="text-slate-400">{library.operatingHours || 'Mon-Sat: 8:00 AM - 10:00 PM, Sun: 10:00 AM - 6:00 PM'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-200">Contact Phone</span>
                    <span className="text-slate-400">{library.phone || '+1 (555) 234-5678'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-200">Email Contact</span>
                    <span className="text-slate-400">{library.email || `contact@${library.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-200">Total Capacity</span>
                    <span className="text-slate-400">{library.totalSeats} study seats across 4 zones</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/libraries/${library._id}/seats`}
                className="w-full block text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
              >
                Book a Seat at {library.name}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Books Tab Content */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Books Available at {library.name}
            </h2>
            <span className="text-xs text-slate-400">{books.length} titles in catalog</span>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No books cataloged specifically for this library location yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryDetailsPage;
