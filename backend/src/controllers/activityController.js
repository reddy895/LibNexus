const dataService = require('../services/dataService');

// @desc    Get recent administrative activity logs
// @route   GET /api/activity
exports.getActivityLogs = async (req, res, next) => {
  try {
    const logs = await dataService.getActivityLogs();
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};
