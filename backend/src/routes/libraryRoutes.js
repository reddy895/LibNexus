const express = require('express');
const router = express.Router();
const {
  getLibraries,
  getNearbyLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary
} = require('../controllers/libraryController');
const { getSeatsByLibrary, getAvailableSeatsByLibrary } = require('../controllers/seatController');
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

router.get('/:libraryId/seats', validateObjectId('libraryId'), getSeatsByLibrary);
router.get('/:libraryId/seats/available', validateObjectId('libraryId'), getAvailableSeatsByLibrary);

module.exports = router;
