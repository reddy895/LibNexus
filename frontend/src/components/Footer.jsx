import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#151A2B] text-white border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#B93434] text-white flex items-center justify-center font-black text-sm">
                LN
              </div>
              <span className="text-lg font-black tracking-tight text-white uppercase font-heading">
                LIB<span className="text-[#B93434]">NEXUS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Know your library before you arrive. Discover nearby public libraries, inspect current seat occupancy in real time, and search book collections.
            </p>
          </div>

          {/* Column 2: Discovery */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#E3A72F] mb-4">Discovery</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/libraries" className="hover:text-white transition-colors">Bengaluru Libraries</Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-white transition-colors">Book Catalog Search</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">Live Map View</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policy & Information */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#E3A72F] mb-4">Informational Policy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seat counts are updated by library administrators. LibNexus provides live informational updates so readers can check availability before visiting.
            </p>
          </div>

          {/* Column 4: Admin Portal */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#B93434] mb-4">Library Administration</h4>
            <p className="text-xs text-slate-400 mb-3">
              Authorized library staff can log in to the management portal to update occupancy and catalogs.
            </p>
            <Link
              to="/admin/login"
              className="inline-block px-3 py-1.5 bg-[#1E253B] hover:bg-[#2A334E] text-white text-xs font-bold uppercase tracking-wider rounded border border-slate-700 transition-colors"
            >
              Admin Portal →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} LibNexus Platform. All rights reserved.</p>
          <p>Designed for public libraries & readers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
