import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import bookService from '../services/bookService';
import OccupancyBadge from '../components/OccupancyBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MapView from '../components/MapView';
import { MapPin, Clock, Phone, Mail, BookOpen, Sparkles, CheckCircle2, ArrowLeft, Info } from 'lucide-react';

const LibraryDetailsPage = () => {
  const { id } = useParams();
  const [library, setLibrary] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const libData = await libraryService.getLibraryById(id);
        const lib = libData.data || libData;
        setLibrary(lib);

        const booksData = await bookService.getBooks({ library: id });
        const bookList = Array.isArray(booksData) ? booksData : booksData.data || [];
        setBooks(bookList);
      } catch (err) {
        console.error('Error fetching library details:', err);
        setError(err.message || 'Failed to load library profile');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading live library profile & seat status..." />;
  if (error || !library) return <ErrorMessage message={error || 'Library profile not found'} />;

  const isOpen = (library.status || '').toLowerCase() === 'open';
  const total = library.totalSeats || 180;
  const occupied = library.occupiedSeats ?? 56;
  const available = library.availableSeats ?? Math.max(0, total - occupied);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Back Link */}
      <div>
        <Link to="/libraries" className="inline-flex items-center gap-1 text-xs font-bold text-[#B93434] hover:underline uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to All Libraries
        </Link>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-[#151A2B] text-white rounded-2xl border-2 border-[#151A2B] shadow-sharp overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${isOpen ? 'bg-[#159A70] text-white' : 'bg-[#B93434] text-white'}`}>
              {isOpen ? 'OPEN NOW' : 'CLOSED'}
            </span>
            <span className="text-xs font-bold text-slate-400">{library.city || 'Bengaluru'} Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-heading leading-tight">{library.name}</h1>

          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#B93434] shrink-0" /> {library.address}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-300 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E3A72F]" /> Hours: {library.openingTime} - {library.closingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" /> {library.phone || '+91 80 2345 6789'}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" /> {library.email || 'contact@libnexus.org'}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 h-64 lg:h-auto bg-slate-800 relative">
          <img src={library.image} alt={library.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Details, Books, Facilities */}
        <div className="lg:col-span-8 space-y-8">

          {/* About Section */}
          <div className="bg-white border-2 border-[#151A2B] rounded-xl p-6 shadow-sharp-subtle space-y-3">
            <h2 className="text-lg font-black text-[#151A2B] uppercase tracking-wider border-b border-[#E4DFD5] pb-2">
              About The Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {library.description || 'Modern public library facility equipped with silent reading zones, computer labs, research archives, and ergonomic desks.'}
            </p>
          </div>

          {/* Book Collection */}
          <div className="bg-white border-2 border-[#151A2B] rounded-xl p-6 shadow-sharp-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4DFD5] pb-2">
              <div>
                <h2 className="text-lg font-black text-[#151A2B] uppercase tracking-wider">Catalog Collection</h2>
                <p className="text-xs text-slate-500">{books.length} titles available in physical inventory</p>
              </div>
              <Link to={`/books?library=${id}`} className="text-xs font-bold text-[#B93434] hover:underline uppercase">
                View All Catalog →
              </Link>
            </div>

            {books.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 italic">No books listed for this library location.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {books.slice(0, 4).map((book) => (
                  <div key={book._id} className="p-3 bg-[#F7F5F1] rounded-lg border border-[#E4DFD5] flex gap-3">
                    <img src={book.coverImage} alt={book.title} className="w-16 h-20 object-cover rounded shadow-sm shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-[#B93434]">{book.category}</span>
                      <h4 className="font-bold text-xs text-[#151A2B] leading-tight line-clamp-1">{book.title}</h4>
                      <p className="text-[11px] text-slate-500">{book.author}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-white text-[9px] font-bold border border-slate-300">
                        Copies: {book.availableCopies} free
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Facilities */}
          <div className="bg-white border-2 border-[#151A2B] rounded-xl p-6 shadow-sharp-subtle space-y-3">
            <h2 className="text-lg font-black text-[#151A2B] uppercase tracking-wider border-b border-[#E4DFD5] pb-2">
              Amenities & Facilities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {(library.facilities || ['Wi-Fi', 'AC', 'Silent Zone', 'Power Outlets']).map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#F7F5F1] rounded-lg border border-[#E4DFD5] text-xs font-bold text-[#151A2B]">
                  <CheckCircle2 className="w-4 h-4 text-[#159A70] shrink-0" /> {fac}
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white border-2 border-[#151A2B] rounded-xl p-6 shadow-sharp-subtle space-y-4">
            <h2 className="text-lg font-black text-[#151A2B] uppercase tracking-wider border-b border-[#E4DFD5] pb-2">
              Location & Access
            </h2>
            <MapView libraries={[library]} center={[library.latitude, library.longitude]} zoom={14} height="320px" />
          </div>

        </div>

        {/* Right Column: Live Availability Card */}
        <div className="lg:col-span-4 space-y-6">

          <div className="bg-[#151A2B] text-white p-6 rounded-2xl border-2 border-[#151A2B] shadow-sharp space-y-6 sticky top-24">
            <div className="border-b border-slate-700 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Real-Time Status</span>
              <h3 className="text-xl font-black mt-0.5">Seat Occupancy</h3>
            </div>

            <OccupancyBadge
              totalSeats={total}
              occupiedSeats={occupied}
              availableSeats={available}
              updatedAt={library.updatedAt}
            />

            <div className="bg-[#1E253B] p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#E3A72F] font-bold">
                <Info className="w-4 h-4 shrink-0" /> Visit Policy
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Seat availability is updated live by library staff. Walk in during opening hours ({library.openingTime} - {library.closingTime}). Seats are available on a first-come basis.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LibraryDetailsPage;
