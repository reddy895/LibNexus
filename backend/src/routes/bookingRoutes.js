const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validate');

router
  .route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.get('/:id', protect, validateObjectId('id'), getBookingById);
router.put('/:id/cancel', protect, validateObjectId('id'), cancelBooking);

module.exports = router;
