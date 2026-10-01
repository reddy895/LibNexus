const express = require('express');
const router = express.Router();
const {
  getLibraries,
  getNearbyLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  updateLibrarySeats,
  deleteLibrary
} = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validate');

router.get('/nearby', getNearbyLibraries);

router
  .route('/')
  .get(getLibraries)
  .post(protect, authorize('admin', 'librarian'), createLibrary);

router
  .route('/:id')
  .get(validateObjectId('id'), getLibraryById)
  .put(protect, authorize('admin', 'librarian'), validateObjectId('id'), updateLibrary)
  .delete(protect, authorize('admin'), validateObjectId('id'), deleteLibrary);

router.patch('/:id/seats', protect, authorize('admin', 'librarian'), validateObjectId('id'), updateLibrarySeats);
router.put('/:id/seats', protect, authorize('admin', 'librarian'), validateObjectId('id'), updateLibrarySeats);

module.exports = router;
