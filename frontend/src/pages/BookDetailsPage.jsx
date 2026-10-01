import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import bookService from '../services/bookService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BookOpen, MapPin, ArrowLeft, CheckCircle2, Building, Calendar, Info, FileText } from 'lucide-react';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const data = await bookService.getBookById(id);
        const b = data.data || data;
        setBook(b);
      } catch (err) {
        setError(err.message || 'Book profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading book catalog details..." />;
  if (error || !book) return <ErrorMessage message={error || 'Book not found'} />;

  const isAvail = (book.availableCopies || 0) > 0;
  const libName = book.library?.name || 'Central Knowledge Hub & Library';
  const libAddress = book.library?.address || 'Academic Square';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Back Link */}
      <div>
        <Link to="/books" className="inline-flex items-center gap-1 text-xs font-bold text-[#B93434] hover:underline uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to Book Catalog
        </Link>
      </div>

      {/* Main Book Profile Card */}
      <div className="bg-white border-2 border-[#151A2B] rounded-2xl p-6 sm:p-8 shadow-sharp grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Cover Image */}
        <div className="md:col-span-4">
          <div className="h-80 rounded-xl overflow-hidden bg-slate-100 border border-[#E4DFD5] relative shadow-sharp-subtle">
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            {book.isNewArrival && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded bg-[#E3A72F] text-slate-900 text-xs font-black uppercase tracking-wider shadow">
                NEW ARRIVAL
              </span>
            )}
          </div>
        </div>

        {/* Copy details */}
        <div className="md:col-span-8 space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#B93434]">{book.category}</span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#151A2B]">{book.title}</h1>
            <p className="text-sm font-extrabold text-slate-600">By {book.author}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${isAvail ? 'bg-[#159A70] text-white' : 'bg-[#B93434] text-white'}`}>
              {isAvail ? `${book.availableCopies} COPIES AVAILABLE` : 'ALL COPIES CHECKED OUT'}
            </span>
            <span className="text-xs font-mono text-slate-500">ISBN: {book.isbn}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-[#F7F5F1] p-4 rounded-xl border border-[#E4DFD5]">
            {book.description || 'No detailed synopsis provided for this catalog item.'}
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700 pt-2 border-t border-[#E4DFD5]">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[10px]">Publisher</p>
              <p className="font-bold text-[#151A2B]">{book.publisher || "O'Reilly Media"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[10px]">Publication Year</p>
              <p className="font-bold text-[#151A2B]">{book.publicationYear || 2022}</p>
            </div>
          </div>

          {/* Location Box */}
          <div className="bg-[#151A2B] text-white p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Physical Location</span>
              <span className="text-xs font-bold text-slate-300">Total Copies: {book.totalCopies || 3}</span>
            </div>
            <h3 className="font-black text-base text-white">{libName}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B93434] shrink-0" /> {libAddress}
            </p>
            {book.library?._id && (
              <Link
                to={`/libraries/${book.library._id}`}
                className="inline-block px-4 py-2 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase tracking-wider rounded transition-colors"
              >
                Inspect Library Location & Seats →
              </Link>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default BookDetailsPage;
