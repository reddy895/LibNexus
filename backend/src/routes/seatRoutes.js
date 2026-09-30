const express = require('express');
const router = express.Router();
const {
  createSeat,
  updateSeat,
  deleteSeat
} = require('../controllers/seatController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validate');

router.post('/', protect, authorize('admin', 'librarian'), createSeat);
router.put('/:id', protect, authorize('admin', 'librarian'), validateObjectId('id'), updateSeat);
router.delete('/:id', protect, authorize('admin', 'librarian'), validateObjectId('id'), deleteSeat);

module.exports = router;
