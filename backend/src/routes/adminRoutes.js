const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers, updateUserRole } = require('../controllers/adminController');
const { getBookings } = require('../controllers/bookingController');
const { createLibrary, updateLibrary, deleteLibrary } = require('../controllers/libraryController');
const { createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { updateSeat } = require('../controllers/seatController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validate');

router.use(protect);
router.use(authorize('admin', 'librarian'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', validateObjectId('id'), updateUserRole);

router.get('/bookings', getBookings);
router.post('/libraries', createLibrary);
router.put('/libraries/:id', validateObjectId('id'), updateLibrary);
router.delete('/libraries/:id', validateObjectId('id'), deleteLibrary);

router.post('/books', createBook);
router.put('/books/:id', validateObjectId('id'), updateBook);
router.delete('/books/:id', validateObjectId('id'), deleteBook);

router.put('/seats/:id/status', validateObjectId('id'), updateSeat);

module.exports = router;

