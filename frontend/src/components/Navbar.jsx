import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Search, User, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#9F2D2D] flex items-center justify-center text-white shadow-sm group-hover:bg-[#b83535] transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight block leading-none">LibNexus</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Smart Library Platform</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/libraries"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive('/libraries') ? 'bg-slate-800 text-amber-400' : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Libraries
            </Link>

            <Link
              to="/books"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive('/books') ? 'bg-slate-800 text-amber-400' : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Books
            </Link>

            <Link
              to="/map"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive('/map') ? 'bg-slate-800 text-amber-400' : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Map
            </Link>

            {isAuthenticated && (
              <Link
                to="/bookings"
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive('/bookings') ? 'bg-slate-800 text-amber-400' : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                My Bookings
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-1 ${
                  location.pathname.startsWith('/admin') ? 'bg-[#9F2D2D] text-white' : 'text-amber-400 hover:bg-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-semibold transition-colors border border-slate-700"
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-gray-200">{user.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-200 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-[#9F2D2D] hover:bg-[#b83535] text-white rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/libraries"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
          >
            Libraries
          </Link>
          <Link
            to="/books"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
          >
            Books
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
          >
            Map
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
              >
                My Bookings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-sm font-semibold border border-slate-700 rounded-lg text-white"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-sm font-semibold bg-[#9F2D2D] text-white rounded-lg"
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
