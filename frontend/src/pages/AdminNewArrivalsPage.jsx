import React, { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Sparkles, Star, Plus, Check, X } from 'lucide-react';

const AdminNewArrivalsPage = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks();
      const list = Array.isArray(data) ? data : data.data || [];
      setAllBooks(list);
      setNewArrivals(list.filter(b => b.isNewArrival));
    } catch (err) {
      setError(err.message || 'Failed to fetch new arrivals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const toggleStatus = async (book) => {
    try {
      await bookService.updateBook(book._id, { isNewArrival: !book.isNewArrival });
      await fetchBooks();
    } catch (err) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#042F32] border border-[#143F40] p-6 rounded-2xl shadow-sharp">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D6FFCB]">Spotlight Feature</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">New Arrival Highlights</h1>
          <p className="text-xs text-[#B6C8C5] mt-1">
            Toggle which newly acquired catalog books appear on the public platform homepage and new arrivals showcase.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#143F40] rounded-xl border border-teal-800/50 text-xs font-bold text-[#D6FFCB]">
          ★ {newArrivals.length} Active New Arrivals
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Fetching new arrival highlights..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBooks.map((book) => {
            const isHighlighted = book.isNewArrival;
            return (
              <div
                key={book._id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                  isHighlighted
                    ? 'bg-white border-[#D6FFCB] shadow-sharp-mint'
                    : 'bg-[#F7FAF5] border-[#042F32]/10 opacity-75'
                }`}
              >
                <div className="flex gap-4">
                  <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded shadow shrink-0" />
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] font-black uppercase text-[#042F32] bg-[#D6FFCB]/40 px-1.5 py-0.5 rounded">{book.category}</span>
                    <h3 className="font-extrabold text-sm text-[#042F32] leading-tight line-clamp-2 font-heading">{book.title}</h3>
                    <p className="text-xs text-[#042F32]/70">{book.author}</p>
                    <p className="text-[10px] text-[#042F32]/50 font-mono">{book.library?.name || 'Central Library'}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleStatus(book)}
                  className={`w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-colors ${
                    isHighlighted
                      ? 'bg-[#D6FFCB] text-[#042F32] hover:bg-[#bbf4ae] shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  {isHighlighted ? '★ HIGHLIGHTED AS NEW ARRIVAL' : '+ Mark as New Arrival'}
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default AdminNewArrivalsPage;
