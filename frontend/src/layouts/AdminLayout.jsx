import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Building2, BookOpen, Armchair, Users, ArrowLeft, LogOut, LayoutDashboard } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md text-center">
          <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-400 mb-6">Administrator privileges are required to access this portal.</p>
          <Link to="/" className="inline-block px-5 py-2.5 bg-[#9F2D2D] text-white font-bold rounded-xl text-sm">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#9F2D2D] flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
                isActive('/admin') ? 'bg-[#9F2D2D] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <Link
              to="/admin/libraries"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
                isActive('/admin/libraries') ? 'bg-[#9F2D2D] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Libraries</span>
            </Link>

            <Link
              to="/admin/books"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
                isActive('/admin/books') ? 'bg-[#9F2D2D] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Books</span>
            </Link>

            <Link
              to="/admin/seats"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
                isActive('/admin/seats') ? 'bg-[#9F2D2D] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>Seats</span>
            </Link>

            <Link
              to="/admin/users"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors ${
                isActive('/admin/users') ? 'bg-[#9F2D2D] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Application</span>
          </Link>
          
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center space-x-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
