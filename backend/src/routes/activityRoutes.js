const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin', 'librarian'), getActivityLogs);

module.exports = router;
