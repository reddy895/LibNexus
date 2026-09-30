const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers, updateUserRole } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validate');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', validateObjectId('id'), updateUserRole);

module.exports = router;
