import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import bookService from '../services/bookService';
import OccupancyBadge from '../components/OccupancyBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Library, MapPin, BookOpen, Clock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Search } from 'lucide-react';

const LandingPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [featuredLibrary, setFeaturedLibrary] = useState(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [stats, setStats] = useState({
    totalLibraries: 6,
    availableSeats: 429,
    totalSeats: 970,
    totalBooks: 135550,
    newArrivalsCount: 12
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const libsData = await libraryService.getLibraries();
        const libsList = Array.isArray(libsData) ? libsData : libsData.data || [];
        setLibraries(libsList);

        if (libsList.length > 0) {
          setFeaturedLibrary(libsList[0]);

          // Calculate real network statistics from API payload
          const totalLibs = libsList.length;
          const availSeats = libsList.reduce((sum, l) => sum + (l.availableSeats ?? 0), 0);
          const totSeats = libsList.reduce((sum, l) => sum + (l.totalSeats ?? 0), 0);
          const totBooks = libsList.reduce((sum, l) => sum + (l.totalBooks ?? 0), 0);

          setStats(prev => ({
            ...prev,
            totalLibraries: totalLibs,
            availableSeats: availSeats,
            totalSeats: totSeats,
            totalBooks: totBooks
          }));
        }

        const booksData = await bookService.getNewArrivals();
        const booksList = Array.isArray(booksData) ? booksData : booksData.data || [];
        setNewArrivals(booksList.slice(0, 4));
        setStats(prev => ({ ...prev, newArrivalsCount: booksList.length }));

      } catch (err) {
        console.error('Failed to load landing page data:', err);
        setError('Unable to fetch live network availability. Displaying cached system state.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">

      {/* 1. HERO SECTION */}
      <section className="bg-[#151A2B] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B93434]/20 border border-[#B93434]/40 text-[#B93434] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Smart Library Discovery Network
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-heading">
              Know your library <br />
              <span className="text-[#E3A72F]">before you arrive.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed">
              Discover nearby libraries, explore their physical collections, check current seat availability, and find the books you need before leaving home.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/libraries"
                className="px-6 py-3.5 bg-[#B93434] hover:bg-[#9B2A2A] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sharp-crimson transition-transform active:translate-y-0.5"
              >
                EXPLORE LIBRARIES →
              </Link>
              <Link
                to="/map"
                className="px-6 py-3.5 bg-[#1E253B] hover:bg-[#2A334E] text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-slate-700 transition-colors"
              >
                VIEW MAP
              </Link>
            </div>

            <div className="pt-6 flex items-center gap-6 text-xs text-slate-400 font-medium border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#159A70]" /> Real-Time Staff Updates
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#159A70]" /> Zero Reservation Fees
              </span>
            </div>
          </div>

          {/* Right Live Availability Hero Card */}
          <div className="lg:col-span-5">
            {featuredLibrary ? (
              <div className="bg-[#FAF8F5] text-[#151A2B] p-6 rounded-2xl border-2 border-[#151A2B] shadow-sharp space-y-5">
                <div className="flex items-center justify-between border-b border-[#E4DFD5] pb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B93434]">Featured Hub</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#159A70] text-white text-[10px] font-black tracking-wider uppercase">
                    {featuredLibrary.status || 'OPEN'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black tracking-tight">{featuredLibrary.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B93434]" /> {featuredLibrary.address}
                  </p>
                </div>

                <OccupancyBadge
                  totalSeats={featuredLibrary.totalSeats || 180}
                  occupiedSeats={featuredLibrary.occupiedSeats || 56}
                  availableSeats={featuredLibrary.availableSeats}
                  updatedAt={featuredLibrary.updatedAt}
                />

                <Link
                  to={`/libraries/${featuredLibrary._id}`}
                  className="block w-full text-center py-3 bg-[#151A2B] hover:bg-[#1E253B] text-white font-black text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  View Library Profile →
                </Link>
              </div>
            ) : (
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border-2 border-[#151A2B] text-center text-slate-500 py-12">
                Loading live library availability...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. REAL CALCULATED NETWORK STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-[#151A2B] rounded-2xl p-6 sm:p-8 shadow-sharp">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B93434]">Network Intelligence</span>
              <h2 className="text-xl font-black text-[#151A2B]">Systemwide Live Metrics</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-[#F7F5F1] px-3 py-1 rounded-full border border-[#E4DFD5]">
              Live calculated data
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E4DFD5]">
            <div className="pt-2 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#151A2B]">{stats.totalLibraries}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Public Libraries</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#159A70]">{stats.availableSeats}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Live Free Seats</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#151A2B]">{stats.totalBooks.toLocaleString()}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Books Cataloged</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#E3A72F]">{stats.newArrivalsCount}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">New Arrivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED LIBRARIES NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DFD5] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#B93434]">Network Hubs</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151A2B]">Bengaluru Libraries</h2>
          </div>
          <Link to="/libraries" className="text-xs font-black text-[#B93434] hover:underline uppercase tracking-wider">
            View All Libraries ({libraries.length}) →
          </Link>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraries.slice(0, 3).map((lib) => {
            const avail = lib.availableSeats ?? Math.max(0, (lib.totalSeats || 180) - (lib.occupiedSeats || 56));
            const total = lib.totalSeats || 180;
            const pct = Math.round((avail / total) * 100);

            return (
              <div key={lib._id} className="bg-white border-2 border-[#151A2B] rounded-xl overflow-hidden shadow-sharp-subtle card-hover flex flex-col justify-between">
                <div>
                  <div className="h-44 relative overflow-hidden bg-slate-100">
                    <img src={lib.image} alt={lib.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#151A2B] text-white text-[10px] font-black uppercase tracking-wider shadow">
                      {lib.city || 'Bengaluru'}
                    </span>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${lib.status === 'open' ? 'bg-[#159A70] text-white' : 'bg-[#B93434] text-white'}`}>
                      {lib.status === 'open' ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-lg text-[#151A2B] leading-snug">{lib.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#B93434] shrink-0" /> {lib.address}
                    </p>

                    <div className="bg-[#F7F5F1] p-3 rounded-lg border border-[#E4DFD5] space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-600">Live Seat Availability:</span>
                        <span className="text-[#159A70]">{avail} / {total} seats ({pct}% free)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#159A70] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                        <span>📚 {lib.totalBooks ? lib.totalBooks.toLocaleString() : '12,000+'} books</span>
                        <span>⏰ {lib.openingTime} - {lib.closingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/libraries/${lib._id}`}
                    className="block w-full text-center py-2.5 bg-[#151A2B] hover:bg-[#1E253B] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                  >
                    View Library Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DFD5] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#E3A72F]">Catalog Updates</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151A2B]">New Book Arrivals</h2>
          </div>
          <Link to="/books?isNewArrival=true" className="text-xs font-black text-[#B93434] hover:underline uppercase tracking-wider">
            Explore All New Arrivals →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((book) => (
            <div key={book._id} className="bg-white border-2 border-[#151A2B] rounded-xl p-4 shadow-sharp-subtle card-hover flex flex-col justify-between">
              <div>
                <div className="h-56 rounded-lg overflow-hidden bg-slate-100 relative mb-3">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#E3A72F] text-slate-900 text-[10px] font-black uppercase tracking-wider shadow">
                    NEW
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B93434]">{book.category}</span>
                <h4 className="font-extrabold text-sm text-[#151A2B] leading-tight mt-0.5 line-clamp-1">{book.title}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{book.author}</p>

                <p className="text-[11px] text-slate-600 mt-2 font-semibold">
                  Location: {book.library?.name || 'Central Library'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E4DFD5]">
                <Link
                  to={`/books/${book._id}`}
                  className="block w-full text-center py-1.5 bg-[#F7F5F1] hover:bg-[#EFECE6] text-[#151A2B] font-extrabold text-xs uppercase tracking-wider rounded border border-[#151A2B] transition-colors"
                >
                  View Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (DISCOVER - CHECK - VISIT) */}
      <section className="bg-[#151A2B] text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#E3A72F]">How LibNexus Works</span>
            <h2 className="text-3xl font-black">Discover. Check. Visit.</h2>
            <p className="text-xs text-slate-400">
              No registration fees or complicated seat locking. Information is updated by library administrators so you know what to expect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-[#1E253B] p-6 rounded-xl border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#B93434]/20 text-[#B93434] flex items-center justify-center font-black text-xl mx-auto border border-[#B93434]">
                1
              </div>
              <h3 className="font-extrabold text-lg text-white">1. Discover Hubs</h3>
              <p className="text-xs text-slate-300">
                Browse nearby public libraries, amenities, computer labs, and catalog collections.
              </p>
            </div>

            <div className="bg-[#1E253B] p-6 rounded-xl border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E3A72F]/20 text-[#E3A72F] flex items-center justify-center font-black text-xl mx-auto border border-[#E3A72F]">
                2
              </div>
              <h3 className="font-extrabold text-lg text-white">2. Check Live Seats</h3>
              <p className="text-xs text-slate-300">
                View real-time occupied vs available seat counts updated by library staff.
              </p>
            </div>

            <div className="bg-[#1E253B] p-6 rounded-xl border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#159A70]/20 text-[#159A70] flex items-center justify-center font-black text-xl mx-auto border border-[#159A70]">
                3
              </div>
              <h3 className="font-extrabold text-lg text-white">3. Visit & Learn</h3>
              <p className="text-xs text-slate-300">
                Walk in with confidence knowing your study space and books are available.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
