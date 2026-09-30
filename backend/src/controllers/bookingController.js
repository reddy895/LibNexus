const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Library = require('../models/Library');
const User = require('../models/User');

const updateLibrarySeatStats = async (libraryId) => {
  if (!libraryId) return;
  const seats = await Seat.find({ library: libraryId });
  const totalSeats = seats.length;
  const availableSeats = seats.filter(s => s.status === 'available').length;
  await Library.findByIdAndUpdate(libraryId, { totalSeats, availableSeats });
};

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

    // Check library exists
    const library = await Library.findById(libraryId);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    // Check seat exists
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({
        success: false,
        message: 'Seat not found'
      });
    }

    // Validate seat belongs to library
    if (seat.library.toString() !== libraryId.toString()) {
      return res.status(400).json({
        success: false,
        message: `Seat ${seat.seatNumber} does not belong to library ${library.name}`
      });
    }

    // Check seat current status
    if (seat.status !== 'available') {
      return res.status(409).json({
        success: false,
        message: `Seat ${seat.seatNumber} is currently ${seat.status}`
      });
    }

    // PREVENT DOUBLE BOOKING: Check for overlapping active bookings on the same seat
    const overlappingBooking = await Booking.findOne({
      seat: seatId,
      status: 'active',
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: `Seat ${seat.seatNumber} is already reserved for the selected time window`
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      library: libraryId,
      seat: seatId,
      startTime: start,
      endTime: end,
      status: 'active'
    });

    // Mark seat as reserved
    seat.status = 'reserved';
    await seat.save();

    await updateLibrarySeatStats(libraryId);

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('library', 'name address image')
      .populate('seat', 'seatNumber floor section type status');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user or all bookings
// @route   GET /api/bookings
exports.getBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user && req.user.role === 'user') {
      filter.user = req.user._id;
    } else if (req.query.user) {
      filter.user = req.query.user;
    }

    if (req.query.library) filter.library = req.query.library;
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('library', 'name address image')
      .populate('seat', 'seatNumber floor section type status')
      .sort({ createdAt: -1 });

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
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('library', 'name address image')
      .populate('seat', 'seatNumber floor section type status');

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
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Free seat back to available
    const seat = await Seat.findById(booking.seat);
    if (seat) {
      seat.status = 'available';
      await seat.save();
      await updateLibrarySeatStats(seat.library);
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
