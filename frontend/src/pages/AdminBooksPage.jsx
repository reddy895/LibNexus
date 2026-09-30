import React, { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import libraryService from '../services/libraryService';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BookOpen, Plus, Edit2, Trash2, X, Tag } from 'lucide-react';

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Computer Science & Software',
    isbn: '',
    publishedYear: 2023,
    libraryId: '',
    totalCopies: 5,
    availableCopies: 5,
    description: '',
    coverImage: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const booksRes = await bookService.getBooks({ limit: 100 });
      setBooks(booksRes.books || booksRes);

      const libRes = await libraryService.getLibraries();
      const libList = libRes.libraries || libRes;
      setLibraries(libList);
      if (libList.length > 0 && !formData.libraryId) {
        setFormData((prev) => ({ ...prev, libraryId: libList[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch catalog items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      category: 'Computer Science & Software',
      isbn: `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      publishedYear: 2023,
      libraryId: libraries[0]?._id || '',
      totalCopies: 5,
      availableCopies: 5,
      description: 'An essential textbook resource in computing.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      category: book.category || 'Computer Science & Software',
      isbn: book.isbn || '',
      publishedYear: book.publishedYear || 2023,
      libraryId: book.library?._id || book.library || libraries[0]?._id || '',
      totalCopies: book.totalCopies || 5,
      availableCopies: book.availableCopies || 5,
      description: book.description || '',
      coverImage: book.coverImage || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        publishedYear: parseInt(formData.publishedYear, 10),
        totalCopies: parseInt(formData.totalCopies, 10),
        availableCopies: parseInt(formData.availableCopies, 10)
      };

      if (editingBook) {
        await adminService.updateBook(editingBook._id, payload);
      } else {
        await adminService.createBook(payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book from the catalog?')) return;
    try {
      await adminService.deleteBook(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Book Catalog Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add new titles, adjust stock quantities, and manage book allocations per library.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Book
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchData} />}

      {loading ? (
        <LoadingSpinner message="Fetching book catalog..." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Title & Cover</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Holding Library</th>
                  <th className="p-4">Copies Free</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img
                        src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-7 h-10 rounded object-cover border border-slate-700"
                      />
                      <div>
                        <span className="block font-bold text-white">{book.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ISBN: {book.isbn}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{book.author}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                        {book.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{book.library?.name || 'Partner Library'}</td>
                    <td className="p-4 font-bold text-emerald-400">
                      {book.availableCopies} / {book.totalCopies}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(book)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingBook ? 'Edit Book Details' : 'Add New Book to Catalog'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Holding Library</label>
                  <select
                    value={formData.libraryId}
                    onChange={(e) => setFormData({ ...formData, libraryId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    {libraries.map((lib) => (
                      <option key={lib._id} value={lib._id}>{lib.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">ISBN</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Copies</label>
                  <input
                    type="number"
                    required
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Available Copies</label>
                  <input
                    type="number"
                    required
                    value={formData.availableCopies}
                    onChange={(e) => setFormData({ ...formData, availableCopies: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooksPage;
