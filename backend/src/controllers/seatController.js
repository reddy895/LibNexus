const Seat = require('../models/Seat');
const Library = require('../models/Library');

// Recalculate library available seats
const updateLibrarySeatStats = async (libraryId) => {
  if (!libraryId) return;
  const seats = await Seat.find({ library: libraryId });
  const totalSeats = seats.length;
  const availableSeats = seats.filter(s => s.status === 'available').length;
  await Library.findByIdAndUpdate(libraryId, { totalSeats, availableSeats });
};

// @desc    Get seats for library
// @route   GET /api/libraries/:libraryId/seats
exports.getSeatsByLibrary = async (req, res, next) => {
  try {
    const { libraryId } = req.params;
    const filter = { library: libraryId };

    if (req.query.floor) {
      filter.floor = parseInt(req.query.floor, 10);
    }
    if (req.query.status) {
      filter.status = req.query.status.toLowerCase();
    }

    const seats = await Seat.find(filter).sort({ floor: 1, seatNumber: 1 });

    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available seats for library
// @route   GET /api/libraries/:libraryId/seats/available
exports.getAvailableSeatsByLibrary = async (req, res, next) => {
  try {
    const { libraryId } = req.params;
    const seats = await Seat.find({ library: libraryId, status: 'available' }).sort({ floor: 1, seatNumber: 1 });

    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create seat
// @route   POST /api/seats
exports.createSeat = async (req, res, next) => {
  try {
    const seat = await Seat.create(req.body);
    await updateLibrarySeatStats(seat.library);

    res.status(201).json({
      success: true,
      data: seat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update seat status/details
// @route   PUT /api/seats/:id
exports.updateSeat = async (req, res, next) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: 'Seat not found'
      });
    }

    await updateLibrarySeatStats(seat.library);

    res.status(200).json({
      success: true,
      data: seat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete seat
// @route   DELETE /api/seats/:id
exports.deleteSeat = async (req, res, next) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) {
      return res.status(404).json({
        success: false,
        message: 'Seat not found'
      });
    }

    await updateLibrarySeatStats(seat.library);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
