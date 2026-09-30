import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import bookService from '../services/bookService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  BookOpen,
  User,
  Tag,
  Hash,
  Calendar,
  Building2,
  CheckCircle,
  MapPin,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBookInfo();
  }, [id]);

  if (loading) return <LoadingSpinner message="Fetching book details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <Link to="/books" className="hover:text-white transition-colors">Book Catalog</Link>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-200 font-medium">{book.title}</span>
      </nav>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Cover Art */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 aspect-[3/4] shadow-xl bg-slate-800">
              <img
                src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {isAvailable ? `${book.availableCopies} Available Copies` : 'All Copies On Loan'}
                </span>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" /> {book.category}
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{book.title}</h1>
              <p className="text-base text-slate-300 font-medium flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-indigo-400" /> By {book.author}
              </p>
            </div>

            {/* Quick Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                <span className="text-xs text-slate-400 block">Published Year</span>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {book.publishedYear || 2022}
                </span>
              </div>

              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                <span className="text-xs text-slate-400 block">ISBN Number</span>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                  <Hash className="w-3.5 h-3.5 text-indigo-400" /> {book.isbn || 'N/A'}
                </span>
              </div>

              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                <span className="text-xs text-slate-400 block">Stock Copies</span>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> {book.availableCopies} / {book.totalCopies} Free
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Synopsis & Description
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {book.description || `An essential reading material in ${book.category}. Available for reference and checkout at partner libraries.`}
              </p>
            </div>

            {/* Holding Library Section */}
            {book.library && (
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" /> Physical Location & Holding Library
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="text-base font-bold text-white">{book.library.name}</h5>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {book.library.address}, {book.library.city}
                    </p>
                  </div>
                  <Link
                    to={`/libraries/${book.library._id}/seats`}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 text-center"
                  >
                    Reserve Seat at this Library
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
