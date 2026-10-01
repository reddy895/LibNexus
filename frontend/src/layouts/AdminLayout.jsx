import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Library,
  BookOpen,
  Armchair,
  Sparkles,
  History,
  Settings,
  LogOut,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Libraries', path: '/admin/libraries', icon: Library },
    { label: 'Books Catalog', path: '/admin/books', icon: BookOpen },
    { label: 'Seat Availability', path: '/admin/seats', icon: Armchair, highlight: true },
    { label: 'New Arrivals', path: '/admin/books/new-arrivals', icon: Sparkles },
    { label: 'Activity Log', path: '/admin/activity', icon: History },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#151A2B] text-slate-100 flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1E253B] border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#B93434] text-white flex items-center justify-center font-black text-sm shadow">
                LN
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase font-heading">
                  LIB<span className="text-[#B93434]">ADMIN</span>
                </span>
                <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Management Hub</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-[#B93434] text-white shadow-sm'
                      : item.highlight
                      ? 'text-[#E3A72F] hover:bg-slate-800'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 bg-[#151A2B] p-3 rounded-lg border border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-700"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Praveen Kumar'}</p>
              <p className="text-[10px] text-[#E3A72F] uppercase font-bold tracking-wider">
                {user?.role === 'admin' ? 'System Administrator' : 'Librarian'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold text-center rounded border border-slate-700 flex items-center justify-center gap-1"
            >
              Public Site <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-[#B93434]/20 hover:bg-[#B93434] text-[#B93434] hover:text-white text-[11px] font-bold rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-16 bg-[#1E253B] border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#159A70]" />
            <span>Admin Clearance Level: <strong className="text-white uppercase">{user?.role || 'ADMIN'}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-slate-400">Last Sync: <strong className="text-slate-200">Just Now</strong></span>
            <span className="px-2.5 py-1 rounded bg-[#159A70]/20 text-[#159A70] font-bold border border-[#159A70]/40 uppercase text-[10px]">
              API Live
            </span>
          </div>
        </header>

        {/* Body Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#151A2B]">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
