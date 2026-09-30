import React from 'react';
import { Armchair, Zap, AlertCircle, ShieldAlert } from 'lucide-react';

const SeatGrid = ({ seats, selectedSeat, onSelectSeat }) => {
  if (!seats || seats.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
        <Armchair className="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-700">No seats available for this floor section.</p>
      </div>
    );
  }

  // Legend Swatches
  return (
    <div className="space-y-6">
      
      {/* Legend Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 inline-block"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600 inline-block"></span>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-700 border border-slate-800 inline-block"></span>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-600 inline-block"></span>
            <span>Reserved</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gray-300 border border-gray-400 inline-block"></span>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Visual Canvas Corridor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-inner text-white">
        <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-800 pb-2">
          🪟 WINDOW BAY & QUIET READING ZONE 🪟
        </div>

        {/* Seat Grid Canvas */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {seats.map((seat) => {
            const seatId = seat._id || seat.id;
            const status = (seat.status || 'available').toLowerCase();
            const isSelected = selectedSeat && (selectedSeat._id || selectedSeat.id) === seatId;
            const isAvailable = status === 'available';

            let nodeStyles = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30 hover:scale-105';
            let icon = <Armchair className="w-4 h-4" />;

            if (isSelected) {
              nodeStyles = 'bg-amber-500 border-amber-400 text-slate-950 font-extrabold ring-4 ring-amber-500/40 scale-105';
              icon = <Zap className="w-4 h-4" />;
            } else if (status === 'occupied') {
              nodeStyles = 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-60';
              icon = <Armchair className="w-4 h-4" />;
            } else if (status === 'reserved') {
              nodeStyles = 'bg-rose-950/60 border-rose-600 text-rose-400 cursor-not-allowed';
              icon = <AlertCircle className="w-4 h-4" />;
            } else if (status === 'maintenance') {
              nodeStyles = 'bg-slate-800/40 border-slate-700 text-slate-600 cursor-not-allowed';
              icon = <ShieldAlert className="w-4 h-4" />;
            }

            return (
              <button
                key={seatId}
                disabled={!isAvailable && !isSelected}
                onClick={() => isAvailable && onSelectSeat(seat)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition-all duration-150 ${nodeStyles}`}
                title={`Seat ${seat.seatNumber} (${status})`}
              >
                {icon}
                <span className="text-xs font-bold">{seat.seatNumber}</span>
              </button>
            );
          })}
        </div>

        <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mt-6 border-t border-slate-800 pt-3">
          🚪 MAIN ENTRANCE & AISLE 🚪
        </div>
      </div>

    </div>
  );
};

export default SeatGrid;
