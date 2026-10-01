const dataService = require('../services/dataService');

// @desc    Get seats for library
// @route   GET /api/libraries/:libraryId/seats
exports.getSeatsByLibrary = async (req, res, next) => {
  try {
    const { libraryId } = req.params;
    const seats = await dataService.getSeatsByLibrary(libraryId, {
      floor: req.query.floor,
      status: req.query.status
    });

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
    const seats = await dataService.getAvailableSeatsByLibrary(libraryId);

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
    const seat = await dataService.createSeat(req.body);

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
    const seat = await dataService.updateSeat(req.params.id, req.body);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: 'Seat not found'
      });
    }

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
    const seat = await dataService.deleteSeat(req.params.id);
    if (!seat) {
      return res.status(404).json({
        success: false,
        message: 'Seat not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

