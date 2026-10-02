import React from 'react';

const OccupancyBadge = ({ totalSeats = 180, occupiedSeats = 56, availableSeats, updatedAt, showBar = true, compact = false }) => {
  const total = Number(totalSeats) || 1;
  const occupied = Math.min(total, Math.max(0, Number(occupiedSeats) || 0));
  const available = availableSeats !== undefined ? Number(availableSeats) : Math.max(0, total - occupied);
  const occupancyPercentage = Math.round((occupied / total) * 100);
  const availablePercentage = 100 - occupancyPercentage;

  // Green/Mint for low occupancy (>50% free), Amber for moderate (20-50% free), Rose for high (<20% free)
  let statusColor = 'bg-[#D6FFCB] text-[#042F32] font-bold border border-[#BAF7AB]';
  let barColor = 'bg-[#10B981]';
  let badgeText = 'LOW OCCUPANCY';

  if (availablePercentage < 20) {
    statusColor = 'bg-rose-500 text-white font-bold';
    barColor = 'bg-rose-500';
    badgeText = 'HIGH OCCUPANCY';
  } else if (availablePercentage < 50) {
    statusColor = 'bg-amber-400 text-[#042F32] font-bold';
    barColor = 'bg-amber-500';
    badgeText = 'MODERATE OCCUPANCY';
  }

  const timeAgo = updatedAt
    ? new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${statusColor}`}>
          {available} Free
        </span>
        <span className="text-xs text-[#143F40]/80 font-medium">({occupancyPercentage}% occupied)</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#DFE8DC] rounded-xl p-4 shadow-sharp-subtle space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#042F32]">Live Availability</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${statusColor}`}>
          {badgeText}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 text-center border-y border-[#DFE8DC]">
        <div>
          <p className="text-[10px] uppercase font-bold text-[#143F40]/70">Available</p>
          <p className="text-xl font-black text-[#042F32]">{available}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-[#143F40]/70">Occupied</p>
          <p className="text-xl font-black text-[#143F40]">{occupied}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-[#143F40]/70">Total Seats</p>
          <p className="text-xl font-black text-[#143F40]/80">{total}</p>
        </div>
      </div>

      {showBar && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-[#042F32]">
            <span>{availablePercentage}% Seats Available</span>
            <span className="text-[#143F40]/70 text-[11px]">Updated {timeAgo}</span>
          </div>
          <div className="w-full h-2.5 bg-[#EEF4EC] rounded-full overflow-hidden border border-[#DFE8DC]">
            <div
              className={`h-full ${barColor} progress-bar-fill rounded-full`}
              style={{ width: `${availablePercentage}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#143F40]/80 italic text-center pt-1 border-t border-[#DFE8DC]">
        ℹ️ Informational only — Seat occupancy is updated in real time by library staff.
      </p>
    </div>
  );
};

export default OccupancyBadge;

