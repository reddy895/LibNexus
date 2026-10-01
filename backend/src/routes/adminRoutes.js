const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers, updateUserRole } = require('../controllers/adminController');
const { createLibrary, updateLibrary, updateLibrarySeats, deleteLibrary } = require('../controllers/libraryController');
const { createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { getActivityLogs } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validate');

router.use(protect);
router.use(authorize('admin', 'librarian'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', validateObjectId('id'), updateUserRole);

router.post('/libraries', createLibrary);
router.put('/libraries/:id', validateObjectId('id'), updateLibrary);
router.delete('/libraries/:id', validateObjectId('id'), deleteLibrary);
router.patch('/libraries/:id/seats', validateObjectId('id'), updateLibrarySeats);
router.put('/libraries/:id/seats', validateObjectId('id'), updateLibrarySeats);
router.put('/seats/:id', validateObjectId('id'), updateLibrarySeats);

router.post('/books', createBook);
router.put('/books/:id', validateObjectId('id'), updateBook);
router.delete('/books/:id', validateObjectId('id'), deleteBook);

router.get('/activity', getActivityLogs);

module.exports = router;
