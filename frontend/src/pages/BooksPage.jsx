import React, { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import libraryService from '../services/libraryService';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { Search, BookOpen, Filter, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Computer Science & Software',
  'Artificial Intelligence & Data',
  'Science & Physics',
  'Mathematics & Logic',
  'Business & Entrepreneurship',
  'Philosophy & Psychology',
  'Literature & Classics',
  'History & Politics'
];

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLibrary, setSelectedLibrary] = useState('All Libraries');

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const data = await libraryService.getLibraries();
        setLibraries(data.libraries || data);
      } catch (err) {
        console.error('Failed to load libraries list:', err);
      }
    };
    fetchLibraries();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedLibrary !== 'All Libraries') params.libraryId = selectedLibrary;

      const data = await bookService.getBooks(params);
      setBooks(data.books || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, selectedLibrary]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Book Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Explore Thousands of Titles & Resources
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Browse books across all partner libraries, verify copy availability, and locate physical volumes in reading rooms.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, topic, or ISBN..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold text-white text-sm rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Search Catalog
            </button>
          </form>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 sm:ml-4">
            <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Library Location:</span>
          </div>
          <select
            value={selectedLibrary}
            onChange={(e) => setSelectedLibrary(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All Libraries">All Libraries</option>
            {libraries.map((lib) => (
              <option key={lib._id} value={lib._id}>{lib.name} ({lib.city})</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 self-end sm:self-center">
          {books.length} titles listed
        </span>
      </div>

      {/* Error State */}
      {error && <ErrorMessage message={error} onRetry={fetchBooks} />}

      {/* Books Content */}
      {loading ? (
        <LoadingSpinner message="Searching book database..." />
      ) : books.length === 0 ? (
        <EmptyState
          title="No Books Found"
          message="No titles matched your search query or category filter. Try resetting your search parameters."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All Categories');
            setSelectedLibrary('All Libraries');
            fetchBooks();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
