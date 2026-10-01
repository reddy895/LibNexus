import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Library, BookOpen, MapPin, Search, Shield, LogOut, User, Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isLibrarian, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#151A2B] text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-[#B93434] text-white flex items-center justify-center font-black text-lg shadow-sharp-crimson transition-transform group-hover:scale-105">
              LN
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-heading uppercase">
                LIB<span className="text-[#B93434]">NEXUS</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-mono -mt-1 tracking-widest uppercase">
                Smart Library Network
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/libraries"
              className={`flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                isActive('/libraries') ? 'text-[#E3A72F]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Library className="w-4 h-4 text-[#B93434]" /> Libraries
            </Link>

            <Link
              to="/books"
              className={`flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                isActive('/books') ? 'text-[#E3A72F]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#E3A72F]" /> Books
            </Link>

            <Link
              to="/map"
              className={`flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                isActive('/map') ? 'text-[#E3A72F]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#159A70]" /> Map View
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, ISBN, author..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#1E253B] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#E3A72F] transition-colors"
            />
          </form>

          {/* Right Action Links */}
          <div className="hidden sm:flex items-center space-x-4">
            {isLibrarian && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-extrabold uppercase tracking-wider rounded-md transition-colors shadow-sm"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Portal
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
                <span className="text-xs text-slate-300 font-medium">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-white text-[#151A2B] hover:bg-cream-200 text-xs font-black uppercase tracking-wider rounded-md transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E253B] border-t border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <Link
            to="/libraries"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-white uppercase tracking-wider py-1"
          >
            Libraries Network
          </Link>
          <Link
            to="/books"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-white uppercase tracking-wider py-1"
          >
            Book Catalog
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-white uppercase tracking-wider py-1"
          >
            Interactive Map
          </Link>

          {isLibrarian && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-black text-[#B93434] uppercase tracking-wider py-1"
            >
              🛡️ Admin Portal
            </Link>
          )}

          {!isAuthenticated && (
            <div className="flex gap-2 pt-2 border-t border-slate-700">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-bold text-white bg-slate-800 rounded"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-bold text-slate-900 bg-white rounded"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
