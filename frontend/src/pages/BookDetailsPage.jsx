import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import bookService from '../services/bookService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { MapPin, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F7FAF5]">

      {/* Back Link */}
      <div>
        <Link to="/books" className="inline-flex items-center gap-1 text-xs font-bold text-[#042F32] hover:underline uppercase tracking-wider font-heading">
          <ArrowLeft className="w-4 h-4" /> Back to Book Catalog
        </Link>
      </div>

      {/* Main Book Profile Card */}
      <div className="bg-white border-2 border-[#042F32] rounded-2xl p-6 sm:p-8 shadow-sharp grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Cover Image */}
        <div className="md:col-span-4">
          <div className="h-80 rounded-xl overflow-hidden bg-[#042F32] border border-[#DFE8DC] relative shadow-sharp-subtle">
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            {book.isNewArrival && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded bg-[#D6FFCB] text-[#042F32] text-xs font-black uppercase tracking-wider shadow border border-[#BAF7AB]">
                NEW ARRIVAL
              </span>
            )}
          </div>
        </div>

        {/* Copy details */}
        <div className="md:col-span-8 space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#042F32]">{book.category}</span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#042F32]">{book.title}</h1>
            <p className="text-sm font-extrabold text-[#143F40]/80">By {book.author}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${isAvail ? 'bg-[#D6FFCB] text-[#042F32] border border-[#BAF7AB]' : 'bg-rose-500 text-white'}`}>
              {isAvail ? `${book.availableCopies} COPIES AVAILABLE` : 'ALL COPIES CHECKED OUT'}
            </span>
            <span className="text-xs font-mono text-[#143F40]/70">ISBN: {book.isbn}</span>
          </div>

          <p className="text-xs sm:text-sm text-[#143F40]/80 leading-relaxed font-medium bg-[#F7FAF5] p-4 rounded-xl border border-[#DFE8DC]">
            {book.description || 'No detailed synopsis provided for this catalog item.'}
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[#143F40] pt-2 border-t border-[#DFE8DC]">
            <div>
              <p className="text-[#143F40]/70 font-bold uppercase text-[10px]">Publisher</p>
              <p className="font-bold text-[#042F32]">{book.publisher || "O'Reilly Media"}</p>
            </div>
            <div>
              <p className="text-[#143F40]/70 font-bold uppercase text-[10px]">Publication Year</p>
              <p className="font-bold text-[#042F32]">{book.publicationYear || 2022}</p>
            </div>
          </div>

          {/* Location Box: Carbon Teal */}
          <div className="bg-[#042F32] text-white p-5 rounded-xl border border-[#143F40] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D6FFCB]">Physical Location</span>
              <span className="text-xs font-bold text-[#B6C8C5]">Total Copies: {book.totalCopies || 3}</span>
            </div>
            <h3 className="font-black text-base text-white font-heading">{libName}</h3>
            <p className="text-xs text-[#B6C8C5] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D6FFCB] shrink-0" /> {libAddress}
            </p>
            {book.library?._id && (
              <Link
                to={`/libraries/${book.library._id}`}
                className="inline-block px-4 py-2 bg-[#D6FFCB] hover:bg-[#BAF7AB] text-[#042F32] text-xs font-black uppercase tracking-wider rounded transition-colors font-heading"
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

