import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-[#9F2D2D] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">LibNexus</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Find Your Space to Learn. Discover libraries, check real-time study seat availability, and reserve desks before you arrive.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/libraries" className="hover:text-white transition-colors">Explore Libraries</Link></li>
              <li><Link to="/books" className="hover:text-white transition-colors">Book Catalog</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Interactive City Map</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
              <li><Link to="/bookings" className="hover:text-white transition-colors">Seat Reservations</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Member Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">System Notice</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Real-time seat occupancy counts are updated dynamically via REST API. Default fallback location set to Bengaluru Academic District.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div>&copy; 2026 LibNexus Platform. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 font-medium text-gray-400">
            Tagline: <span className="text-amber-400">Find Your Space to Learn.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
