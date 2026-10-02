import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import bookService from '../services/bookService';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search, Filter, MapPin } from 'lucide-react';

const BooksPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialNewArrivals = searchParams.get('isNewArrival') === 'true';

  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(initialNewArrivals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await bookService.getBooks({
          search: searchQuery,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          library: libraryFilter !== 'all' ? libraryFilter : undefined,
          isNewArrival: newArrivalsOnly ? true : undefined
        });
        const list = Array.isArray(data) ? data : data.data || [];
        setBooks(list);

        const libsData = await libraryService.getLibraries();
        const libsList = Array.isArray(libsData) ? libsData : libsData.data || [];
        setLibraries(libsList);
      } catch (err) {
        setError(err.message || 'Failed to load book catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, categoryFilter, libraryFilter, newArrivalsOnly]);

  const categories = ['Programming', 'Artificial Intelligence', 'Computer Science', 'Data Science', 'History', 'Self-Help', 'Psychology'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F7FAF5]">

      {/* Header: Carbon Teal Container */}
      <div className="bg-[#042F32] text-white p-8 rounded-2xl border-2 border-[#042F32] shadow-sharp flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D6FFCB]">Catalog Discovery</span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading mt-1">Book Search & Collections</h1>
          <p className="text-xs sm:text-sm text-[#B6C8C5] mt-1 max-w-xl">
            Search physical books across all Bengaluru public libraries, check availability, and discover new arrival additions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#143F40] p-4 rounded-xl border border-[#1B4F51] text-xs">
          <div>
            <p className="text-[#B6C8C5] font-bold uppercase text-[10px]">Catalog Books</p>
            <p className="text-xl font-black text-[#D6FFCB]">{books.length}</p>
          </div>
          <div className="border-l border-[#1B4F51] pl-3">
            <p className="text-[#B6C8C5] font-bold uppercase text-[10px]">New Arrivals</p>
            <p className="text-xl font-black text-[#D6FFCB]">{books.filter(b => b.isNewArrival).length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border-2 border-[#042F32] p-4 rounded-xl shadow-sharp-subtle flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#143F40]/60 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, author, ISBN..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg text-xs text-[#042F32] placeholder-[#143F40]/60 focus:outline-none focus:border-[#042F32]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#042F32]" />
            <span className="text-xs font-bold text-[#143F40] uppercase">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg text-xs font-bold text-[#042F32] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#042F32]" />
            <span className="text-xs font-bold text-[#143F40] uppercase">Library:</span>
            <select
              value={libraryFilter}
              onChange={(e) => setLibraryFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg text-xs font-bold text-[#042F32] focus:outline-none"
            >
              <option value="all">All Libraries</option>
              {libraries.map((lib) => (
                <option key={lib._id} value={lib._id}>{lib.name}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 px-3 py-1.5 bg-[#F7FAF5] border border-[#DFE8DC] rounded-lg cursor-pointer text-xs font-bold text-[#042F32]">
            <input
              type="checkbox"
              checked={newArrivalsOnly}
              onChange={(e) => setNewArrivalsOnly(e.target.checked)}
              className="rounded text-[#042F32] focus:ring-0"
            />
            <span>New Arrivals Only</span>
          </label>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Searching book catalog..." />
      ) : books.length === 0 ? (
        <div className="bg-white border-2 border-[#042F32] p-12 text-center rounded-xl shadow-sharp">
          <p className="text-lg font-bold text-[#042F32]">No books found matching your criteria.</p>
          <p className="text-xs text-[#143F40]/80 mt-1">Try broadening your search query or removing category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const libName = book.library?.name || 'Central Knowledge Hub';
            const isAvail = (book.availableCopies || 0) > 0;

            return (
              <div key={book._id} className="bg-white border-2 border-[#042F32] rounded-xl p-4 shadow-sharp-subtle card-hover flex flex-col justify-between">
                <div>
                  <div className="h-56 rounded-lg overflow-hidden bg-[#042F32] relative mb-3">
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    {book.isNewArrival && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#D6FFCB] text-[#042F32] text-[10px] font-black uppercase tracking-wider shadow border border-[#BAF7AB]">
                        NEW
                      </span>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${isAvail ? 'bg-[#D6FFCB] text-[#042F32]' : 'bg-rose-500 text-white'}`}>
                      {isAvail ? 'AVAILABLE' : 'CHECKED OUT'}
                    </span>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider text-[#042F32]">{book.category}</span>
                  <h3 className="font-extrabold text-sm text-[#042F32] leading-snug mt-0.5 line-clamp-1 font-heading">{book.title}</h3>
                  <p className="text-xs text-[#143F40]/80 font-medium mt-0.5">{book.author}</p>

                  <div className="mt-3 pt-2 border-t border-[#DFE8DC] text-[11px] text-[#143F40] space-y-1">
                    <p className="font-semibold text-[#042F32] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#042F32] shrink-0" /> <span className="truncate">{libName}</span>
                    </p>
                    <p className="text-[#143F40]/70 font-mono text-[10px]">ISBN: {book.isbn}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/books/${book._id}`}
                    className="block w-full text-center py-2 bg-[#042F32] hover:bg-[#143F40] text-[#D6FFCB] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors font-heading"
                  >
                    VIEW BOOK DETAILS →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default BooksPage;

