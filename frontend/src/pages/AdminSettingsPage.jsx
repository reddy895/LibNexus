import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Shield, User, Mail, Database } from 'lucide-react';

const AdminSettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl">

      <div className="bg-[#1E253B] border border-slate-800 p-6 rounded-2xl">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">System Configuration</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">Administrator Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Profile details, system parameters, and database sync status.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-[#1E253B] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sharp">
        <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-[#B93434]" /> Admin Account Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px]">Full Name</label>
            <p className="text-white font-extrabold text-sm mt-1">{user?.name || 'Praveen Kumar'}</p>
          </div>

          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px]">Email Address</label>
            <p className="text-white font-extrabold text-sm mt-1">{user?.email || 'admin@libnexus.com'}</p>
          </div>

          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px]">Role</label>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#B93434] text-white font-black uppercase text-[10px]">
              {user?.role || 'admin'}
            </span>
          </div>

          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px]">Clearance</label>
            <p className="text-[#159A70] font-bold text-xs mt-1">Full System Access (Level 1)</p>
          </div>
        </div>
      </div>

      {/* System Policy */}
      <div className="bg-[#1E253B] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sharp">
        <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#E3A72F]" /> System Architecture & Rules
        </h2>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-[#151A2B] rounded-xl border border-slate-800">
            <p className="font-bold text-[#E3A72F]">Seat Occupancy Calculation Rule:</p>
            <p className="text-[#159A70] font-mono mt-1">availableSeats = Math.max(0, totalSeats - occupiedSeats)</p>
          </div>

          <div className="p-3 bg-[#151A2B] rounded-xl border border-slate-800">
            <p className="font-bold text-white">Public Seat Interaction:</p>
            <p className="text-slate-400 mt-1">
              Seats are strictly informational for public readers. Users cannot book or reserve seats online.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminSettingsPage;
