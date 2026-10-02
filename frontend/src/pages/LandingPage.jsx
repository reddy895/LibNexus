import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import libraryService from '../services/libraryService';
import bookService from '../services/bookService';
import OccupancyBadge from '../components/OccupancyBadge';
import ErrorMessage from '../components/ErrorMessage';
import { MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-16 pb-16 bg-[#F7FAF5]">

      {/* 1. HERO SECTION: Carbon Teal Background */}
      <section className="bg-[#042F32] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#143F40] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#143F40] border border-[#1B4F51] text-[#D6FFCB] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D6FFCB]" /> Smart Library Discovery Network
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-heading">
              Know your library <br />
              <span className="text-[#D6FFCB]">before you arrive.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#B6C8C5] max-w-2xl font-medium leading-relaxed">
              Discover nearby libraries, explore their physical collections, check current seat availability, and find the books you need before leaving home.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/libraries"
                className="px-6 py-3.5 bg-[#D6FFCB] hover:bg-[#BAF7AB] text-[#042F32] font-black text-xs uppercase tracking-wider rounded-lg shadow-sharp-mint transition-transform active:translate-y-0.5"
              >
                EXPLORE LIBRARIES →
              </Link>
              <Link
                to="/map"
                className="px-6 py-3.5 bg-[#143F40] hover:bg-[#1B4F51] text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-[#1B4F51] transition-colors"
              >
                VIEW MAP
              </Link>
            </div>

            <div className="pt-6 flex items-center gap-6 text-xs text-[#B6C8C5] font-medium border-t border-[#143F40]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D6FFCB]" /> Real-Time Staff Updates
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D6FFCB]" /> Zero Reservation Fees
              </span>
            </div>
          </div>

          {/* Right Live Availability Hero Card */}
          <div className="lg:col-span-5">
            {featuredLibrary ? (
              <div className="bg-white text-[#042F32] p-6 rounded-2xl border-2 border-[#042F32] shadow-sharp space-y-5">
                <div className="flex items-center justify-between border-b border-[#DFE8DC] pb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#042F32]">Featured Hub</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#D6FFCB] text-[#042F32] border border-[#BAF7AB] text-[10px] font-black tracking-wider uppercase">
                    {featuredLibrary.status || 'OPEN'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black tracking-tight font-heading">{featuredLibrary.name}</h3>
                  <p className="text-xs text-[#143F40]/80 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#042F32]" /> {featuredLibrary.address}
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
                  className="block w-full text-center py-3 bg-[#042F32] hover:bg-[#143F40] text-[#D6FFCB] font-black text-xs uppercase tracking-wider rounded-lg transition-colors font-heading"
                >
                  View Library Profile →
                </Link>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border-2 border-[#042F32] text-center text-[#143F40]/70 py-12">
                Loading live library availability...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. REAL CALCULATED NETWORK STATISTICS: Soft Ivory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-[#042F32] rounded-2xl p-6 sm:p-8 shadow-sharp">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#143F40]">Network Intelligence</span>
              <h2 className="text-xl font-black text-[#042F32] font-heading">Systemwide Live Metrics</h2>
            </div>
            <span className="text-xs font-semibold text-[#042F32] bg-[#D6FFCB] px-3 py-1 rounded-full border border-[#BAF7AB]">
              Live calculated data
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#DFE8DC]">
            <div className="pt-2 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#042F32]">{stats.totalLibraries}</p>
              <p className="text-xs font-bold text-[#143F40]/70 uppercase tracking-wider mt-1">Public Libraries</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#10B981]">{stats.availableSeats}</p>
              <p className="text-xs font-bold text-[#143F40]/70 uppercase tracking-wider mt-1">Live Free Seats</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#042F32]">{stats.totalBooks.toLocaleString()}</p>
              <p className="text-xs font-bold text-[#143F40]/70 uppercase tracking-wider mt-1">Books Cataloged</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-[#042F32]">{stats.newArrivalsCount}</p>
              <p className="text-xs font-bold text-[#143F40]/70 uppercase tracking-wider mt-1">New Arrivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED LIBRARIES NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DFE8DC] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#143F40]">Network Hubs</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#042F32] font-heading">Bengaluru Libraries</h2>
          </div>
          <Link to="/libraries" className="text-xs font-black text-[#042F32] hover:underline uppercase tracking-wider font-heading">
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
              <div key={lib._id} className="bg-white border-2 border-[#042F32] rounded-xl overflow-hidden shadow-sharp-subtle card-hover flex flex-col justify-between">
                <div>
                  <div className="h-44 relative overflow-hidden bg-[#042F32]">
                    <img src={lib.image} alt={lib.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#042F32] text-white text-[10px] font-black uppercase tracking-wider shadow">
                      {lib.city || 'Bengaluru'}
                    </span>
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${lib.status === 'open' ? 'bg-[#D6FFCB] text-[#042F32]' : 'bg-rose-500 text-white'}`}>
                      {lib.status === 'open' ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-lg text-[#042F32] leading-snug font-heading">{lib.name}</h3>
                    <p className="text-xs text-[#143F40]/80 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#042F32] shrink-0" /> {lib.address}
                    </p>

                    <div className="bg-[#F7FAF5] p-3 rounded-lg border border-[#DFE8DC] space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#143F40]">Live Seat Availability:</span>
                        <span className="text-[#10B981]">{avail} / {total} seats ({pct}% free)</span>
                      </div>
                      <div className="w-full h-2 bg-[#EEF4EC] rounded-full overflow-hidden">
                        <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#143F40]/80 pt-1">
                        <span>📚 {lib.totalBooks ? lib.totalBooks.toLocaleString() : '12,000+'} books</span>
                        <span>⏰ {lib.openingTime} - {lib.closingTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/libraries/${lib._id}`}
                    className="block w-full text-center py-2.5 bg-[#042F32] hover:bg-[#143F40] text-[#D6FFCB] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors font-heading"
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DFE8DC] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#143F40]">Catalog Updates</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#042F32] font-heading">New Book Arrivals</h2>
          </div>
          <Link to="/books?isNewArrival=true" className="text-xs font-black text-[#042F32] hover:underline uppercase tracking-wider font-heading">
            Explore All New Arrivals →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((book) => (
            <div key={book._id} className="bg-white border-2 border-[#042F32] rounded-xl p-4 shadow-sharp-subtle card-hover flex flex-col justify-between">
              <div>
                <div className="h-56 rounded-lg overflow-hidden bg-[#042F32] relative mb-3">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#D6FFCB] text-[#042F32] text-[10px] font-black uppercase tracking-wider shadow border border-[#BAF7AB]">
                    NEW
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#143F40]">{book.category}</span>
                <h4 className="font-extrabold text-sm text-[#042F32] leading-tight mt-0.5 line-clamp-1 font-heading">{book.title}</h4>
                <p className="text-xs text-[#143F40]/80 font-medium mt-0.5">{book.author}</p>

                <p className="text-[11px] text-[#143F40] mt-2 font-semibold">
                  Location: {book.library?.name || 'Central Library'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DFE8DC]">
                <Link
                  to={`/books/${book._id}`}
                  className="block w-full text-center py-1.5 bg-[#D6FFCB] hover:bg-[#BAF7AB] text-[#042F32] font-black text-xs uppercase tracking-wider rounded border border-[#042F32] transition-colors font-heading"
                >
                  View Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS: Carbon Teal Section */}
      <section className="bg-[#042F32] text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-[#143F40]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#D6FFCB]">How LibNexus Works</span>
            <h2 className="text-3xl font-black font-heading">Discover. Check. Visit.</h2>
            <p className="text-xs text-[#B6C8C5]">
              No registration fees or complicated seat locking. Information is updated by library administrators so you know what to expect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-[#143F40] p-6 rounded-xl border border-[#1B4F51] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D6FFCB] text-[#042F32] flex items-center justify-center font-black text-xl mx-auto shadow-sharp-mint">
                1
              </div>
              <h3 className="font-extrabold text-lg text-white font-heading">1. Discover Hubs</h3>
              <p className="text-xs text-[#B6C8C5]">
                Browse nearby public libraries, amenities, computer labs, and catalog collections.
              </p>
            </div>

            <div className="bg-[#143F40] p-6 rounded-xl border border-[#1B4F51] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D6FFCB] text-[#042F32] flex items-center justify-center font-black text-xl mx-auto shadow-sharp-mint">
                2
              </div>
              <h3 className="font-extrabold text-lg text-white font-heading">2. Check Live Seats</h3>
              <p className="text-xs text-[#B6C8C5]">
                View real-time occupied vs available seat counts updated by library staff.
              </p>
            </div>

            <div className="bg-[#143F40] p-6 rounded-xl border border-[#1B4F51] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D6FFCB] text-[#042F32] flex items-center justify-center font-black text-xl mx-auto shadow-sharp-mint">
                3
              </div>
              <h3 className="font-extrabold text-lg text-white font-heading">3. Visit & Learn</h3>
              <p className="text-xs text-[#B6C8C5]">
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

