import React, { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import libraryService from '../services/libraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BookOpen, Plus, Search, Edit3, Trash2, Sparkles, Check, X, Filter } from 'lucide-react';

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('Programming');
  const [publisher, setPublisher] = useState("O'Reilly Media");
  const [publicationYear, setPublicationYear] = useState('2024');
  const [libraryId, setLibraryId] = useState('');
  const [totalCopies, setTotalCopies] = useState('5');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const bData = await bookService.getBooks();
      const bList = Array.isArray(bData) ? bData : bData.data || [];
      setBooks(bList);

      const lData = await libraryService.getLibraries();
      const lList = Array.isArray(lData) ? lData : lData.data || [];
      setLibraries(lList);
      if (lList.length > 0 && !libraryId) setLibraryId(lList[0]._id);
    } catch (err) {
      setError(err.message || 'Failed to fetch catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreateBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookService.createBook({
        title,
        author,
        isbn,
        category,
        publisher,
        publicationYear: parseInt(publicationYear, 10),
        library: libraryId,
        totalCopies: parseInt(totalCopies, 10),
        availableCopies: parseInt(totalCopies, 10),
        coverImage,
        description,
        isNewArrival
      });

      setShowAddModal(false);
      // Reset form
      setTitle('');
      setAuthor('');
      setIsbn('');
      setDescription('');
      setIsNewArrival(false);

      await fetchBooks();
    } catch (err) {
      setError(err.message || 'Failed to create book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book from the catalog?')) {
      try {
        await bookService.deleteBook(id);
        await fetchBooks();
      } catch (err) {
        setError(err.message || 'Failed to delete book');
      }
    }
  };

  const toggleNewArrival = async (book) => {
    try {
      await bookService.updateBook(book._id, { isNewArrival: !book.isNewArrival });
      await fetchBooks();
    } catch (err) {
      setError(err.message || 'Failed to update new arrival status');
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E253B] border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E3A72F]">Catalog Administration</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">Book Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add physical books, assign to libraries, manage inventory, and highlight new arrivals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sharp-crimson transition-transform active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> ADD NEW BOOK →
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E253B] border-2 border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">ADD NEW BOOK TO CATALOG</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Designing Data-Intensive Applications"
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Martin Kleppmann"
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">ISBN Number</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="e.g. 978-1449373320"
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="History">History</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Psychology">Psychology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-[#E3A72F] uppercase mb-1">Assign Library *</label>
                  <select
                    required
                    value={libraryId}
                    onChange={(e) => setLibraryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                  >
                    {libraries.map((lib) => (
                      <option key={lib._id} value={lib._id}>{lib.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Total Copies Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Synopsis / Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief synopsis..."
                  className="w-full px-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#E3A72F]"
                />
              </div>

              <label className="flex items-center gap-2 p-3 bg-[#151A2B] rounded-lg border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="rounded text-[#B93434]"
                />
                <span className="text-xs font-bold text-[#E3A72F] uppercase">Mark as New Arrival Highlight</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#B93434] hover:bg-[#9B2A2A] text-white text-xs font-black uppercase rounded shadow"
                >
                  {submitting ? 'Adding...' : 'ADD BOOK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-[#1E253B] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog books..."
            className="w-full pl-9 pr-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
        <span className="text-xs font-bold text-slate-400">{filteredBooks.length} Books Found</span>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <LoadingSpinner message="Loading catalog inventory..." />
      ) : (
        <div className="bg-[#1E253B] border border-slate-800 rounded-2xl overflow-hidden shadow-sharp">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#151A2B] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Book Title & Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Assigned Library</th>
                  <th className="p-4">Copies</th>
                  <th className="p-4">New Arrival</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={book.coverImage} alt={book.title} className="w-10 h-12 object-cover rounded shadow shrink-0" />
                        <div>
                          <p className="font-bold text-white leading-tight">{book.title}</p>
                          <p className="text-[11px] text-slate-400">{book.author}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ISBN: {book.isbn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#E3A72F]">{book.category}</td>
                    <td className="p-4 text-slate-300">{book.library?.name || 'Central Library'}</td>
                    <td className="p-4 text-slate-300 font-bold">{book.availableCopies} / {book.totalCopies}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleNewArrival(book)}
                        className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                          book.isNewArrival
                            ? 'bg-[#E3A72F] text-slate-900'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {book.isNewArrival ? '★ NEW' : 'Regular'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="p-1.5 bg-[#B93434]/20 hover:bg-[#B93434] text-[#B93434] hover:text-white rounded transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBooksPage;
