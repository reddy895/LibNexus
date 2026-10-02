import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Armchair, BookOpen } from 'lucide-react';

const LibraryCard = ({ library, onSelectMap }) => {
  const libId = library._id || library.id;
  const isOpen = (library.status || '').toLowerCase() === 'open';
  const distance = library.distance !== undefined ? library.distance : 0.8;

  return (
    <div className="bg-white border border-[#DFE8DC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group">

      {/* Top Image Box */}
      <div className="relative h-48 bg-[#042F32] overflow-hidden">
        <img
          src={library.image || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'}
          alt={library.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Status Overlay Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
              isOpen
                ? 'bg-[#D6FFCB] text-[#042F32] border border-[#BAF7AB]'
                : 'bg-rose-500 text-white'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${isOpen ? 'bg-[#042F32]' : 'bg-white'}`}></span>
            {isOpen ? 'OPEN NOW' : 'CLOSED'}
          </span>
        </div>

        {/* Distance Overlay Badge */}
        <div className="absolute top-3 right-3 z-10 bg-[#042F32]/90 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-sm border border-[#143F40]">
          <MapPin className="w-3 h-3 text-[#D6FFCB]" />
          <span>{distance} km</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-extrabold text-[#042F32] group-hover:text-[#143F40] transition-colors line-clamp-1 mb-1 font-heading">
          {library.name}
        </h3>

        <div className="flex items-start space-x-1.5 text-xs text-[#143F40]/80 mb-4 line-clamp-2">
          <MapPin className="w-3.5 h-3.5 text-[#143F40]/60 shrink-0 mt-0.5" />
          <span>{library.address}, {library.city || 'Bengaluru'}</span>
        </div>

        {/* Statistics Availability Box */}
        <div className="grid grid-cols-2 gap-3 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg p-3 mb-4 mt-auto">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] font-bold text-[#143F40]/70 uppercase tracking-wider">
              <Armchair className="w-3 h-3 text-[#10B981]" />
              <span>Available Seats</span>
            </div>
            <div className="text-sm font-extrabold text-[#042F32]">
              <span className="text-[#10B981] font-black">{library.availableSeats ?? 0}</span>
              <span className="text-[#143F40]/60 font-normal text-xs"> / {library.totalSeats ?? 0}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center space-x-1 text-[11px] font-bold text-[#143F40]/70 uppercase tracking-wider">
              <BookOpen className="w-3 h-3 text-[#042F32]" />
              <span>Available Books</span>
            </div>
            <div className="text-sm font-extrabold text-[#042F32]">
              {(library.availableBooks ?? 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Bottom Operating Hours & Action Buttons */}
        <div className="pt-3 border-t border-[#DFE8DC] flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-[#143F40]/80 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#143F40]/60" />
            <span>{library.openingTime || '08:00 AM'} - {library.closingTime || '10:00 PM'}</span>
          </div>

          <div className="flex items-center space-x-2">
            {onSelectMap && (
              <button
                onClick={() => onSelectMap(library)}
                className="px-2.5 py-1.5 text-xs font-bold text-[#042F32] bg-[#EEF4EC] hover:bg-[#DFE8DC] rounded-lg transition-colors"
                title="View on Map"
              >
                Map
              </button>
            )}

            <Link
              to={`/libraries/${libId}`}
              className="px-3 py-1.5 text-xs font-bold text-[#042F32] bg-[#D6FFCB] hover:bg-[#BAF7AB] rounded-lg transition-colors shadow-sm font-heading uppercase tracking-wider"
            >
              View Library →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LibraryCard;

