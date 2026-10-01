const dataService = require('../services/dataService');

// @desc    Get aggregate stats for Admin Dashboard
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const stats = await dataService.getAdminStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for Admin
// @route   GET /api/admin/users
exports.getAdminUsers = async (req, res, next) => {
  try {
    const users = await dataService.findUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'librarian', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await dataService.updateUserRole(req.params.id, role);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

