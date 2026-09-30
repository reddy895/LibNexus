const Book = require('../models/Book');
const Library = require('../models/Library');

// Update library book count stats
const updateLibraryBookStats = async (libraryId) => {
  if (!libraryId) return;
  const books = await Book.find({ library: libraryId });
  const totalBooks = books.reduce((sum, b) => sum + (b.totalCopies || 1), 0);
  const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
  await Library.findByIdAndUpdate(libraryId, { totalBooks, availableBooks });
};

// @desc    Get all books
// @route   GET /api/books
exports.getBooks = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.library) {
      filter.library = req.query.library;
    }

    if (req.query.category && req.query.category !== 'all') {
      filter.category = new RegExp(`^${req.query.category}$`, 'i');
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
        { category: searchRegex }
      ];
    }

    const books = await Book.find(filter)
      .populate('library', 'name address city image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('library', 'name address city image openingTime closingTime');
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new book
// @route   POST /api/books
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    await updateLibraryBookStats(book.library);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await updateLibraryBookStats(book.library);

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await updateLibraryBookStats(book.library);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
