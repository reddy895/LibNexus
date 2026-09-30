const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validate');

router
  .route('/')
  .get(getBooks)
  .post(protect, authorize('admin', 'librarian'), createBook);

router
  .route('/:id')
  .get(validateObjectId('id'), getBookById)
  .put(protect, authorize('admin', 'librarian'), validateObjectId('id'), updateBook)
  .delete(protect, authorize('admin', 'librarian'), validateObjectId('id'), deleteBook);

module.exports = router;
