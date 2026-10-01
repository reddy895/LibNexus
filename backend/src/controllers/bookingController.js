const dataService = require('../services/dataService');

// @desc    Create a new seat booking
// @route   POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    let { libraryId, seatId, startTime, endTime } = req.body;
    const userId = req.user ? req.user._id : req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication is required to make a booking'
      });
    }

    if (!libraryId || !seatId) {
      return res.status(400).json({
        success: false,
        message: 'Library ID and Seat ID are required'
      });
    }

    const start = startTime ? new Date(startTime) : new Date();
    const end = endTime ? new Date(endTime) : new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start or end time'
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be before end time'
      });
    }

    try {
      const populatedBooking = await dataService.createBooking({
        userId,
        libraryId,
        seatId,
        start,
        end
      });

      res.status(201).json({
        success: true,
        data: populatedBooking
      });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message
        });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user or all bookings
// @route   GET /api/bookings
exports.getBookings = async (req, res, next) => {
  try {
    const isUserOnly = req.user && req.user.role === 'user';
    const userId = isUserOnly ? req.user._id : req.query.user;

    const bookings = await dataService.getBookings({
      userId,
      libraryId: req.query.library,
      status: req.query.status,
      isUserOnly
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await dataService.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    try {
      const booking = await dataService.cancelBooking(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      });
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message
        });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

