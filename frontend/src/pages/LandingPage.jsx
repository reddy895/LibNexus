import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { libraryService } from '../services/api';
import LibraryCard from '../components/LibraryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, MapPin, Armchair, BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [featuredLibraries, setFeaturedLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await libraryService.getLibraries({ limit: 3 });
        if (res.success) {
          setFeaturedLibraries(res.data);
        }
      } catch (err) {
        console.error('[LandingPage] Error fetching libraries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* EDITORIAL HERO SECTION */}
      <section className="relative bg-[#0F172A] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Library Discovery Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Find Your Space <br />
              <span className="text-[#9F2D2D]">to Learn.</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Discover libraries, explore collections, check seat availability, and reserve your perfect study space before you arrive.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/libraries"
                className="px-6 py-3.5 bg-[#9F2D2D] hover:bg-[#852525] text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <span>Explore Libraries</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/map"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-gray-200 font-extrabold rounded-xl text-sm border border-slate-700 transition-colors flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>View Map</span>
              </Link>
            </div>
          </div>

          {/* Hero Architectural Image Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                alt="Central Knowledge Hub Architectural Hall"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-white text-base">Central Knowledge Hub</h3>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white font-bold text-[10px] rounded-full">OPEN</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">452 University Avenue, Academic Square</p>
                <div className="flex items-center justify-between text-xs font-bold text-gray-200 pt-2 border-t border-slate-800">
                  <span className="text-emerald-400">142 Available Seats</span>
                  <span className="text-amber-400">32,150 Books</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORM STATISTICS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900">58+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Partner Libraries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#9F2D2D]">12k+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Study Desks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900">185k+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Cataloged Books</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-600">99.4%</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Live Accuracy</div>
          </div>
        </div>
      </section>

      {/* FEATURED LIBRARIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#9F2D2D] block mb-1">
              Top Discovery Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Featured Libraries</h2>
          </div>
          <Link to="/libraries" className="text-xs font-extrabold text-[#9F2D2D] hover:underline">
            View All Libraries &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching featured libraries..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredLibraries.map((lib) => (
              <LibraryCard key={lib._id || lib.id} library={lib} />
            ))}
          </div>
        )}
      </section>

      {/* PLATFORM FEATURES */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black">Built for Serious Readers & Researchers</h2>
            <p className="text-gray-400 text-sm mt-2">Eliminate guesswork before heading to any public or academic library.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Armchair className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold mb-2">Real-Time Desk Tracking</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Check live floor occupancy, power outlets, and silent zone availability before leaving home.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold mb-2">Instant Book Discovery</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Search titles, authors, and categories across libraries to locate physical book availability.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[#9F2D2D]/30 text-rose-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold mb-2">Double Booking Prevention</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Guaranteed seat reservations with verified server time-locks and conflict prevention.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
