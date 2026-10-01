import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Building2 } from 'lucide-react';

const BookCard = ({ book }) => {
  const bookId = book._id || book.id;
  const isAvailable = (book.availableCopies ?? 0) > 0;
  const libraryName = book.library ? (book.library.name || 'Library') : 'Library';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group">

      {/* Cover Box */}
      <div className="relative h-52 bg-slate-900 overflow-hidden flex items-center justify-center p-4">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
          alt={book.title}
          className="h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-slate-900/80 backdrop-blur-md text-amber-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
            {book.category || 'General'}
          </span>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="text-base font-extrabold text-gray-900 group-hover:text-[#9F2D2D] transition-colors line-clamp-1 mb-0.5">
          {book.title}
        </h4>
        <p className="text-xs text-gray-500 mb-2 font-medium">By {book.author}</p>

        <div className="flex items-center space-x-1 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-md border border-slate-100">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{libraryName}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
              isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isAvailable ? `${book.availableCopies} Available` : 'All Borrowed'}
          </span>

          <Link
            to={`/books/${bookId}`}
            className="px-3 py-1.5 text-xs font-bold text-[#9F2D2D] hover:bg-[#9F2D2D]/10 rounded-lg transition-colors border border-[#9F2D2D]/30"
          >
            Details
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookCard;
