const dataService = require('../services/dataService');

// @desc    Get all libraries with query filters
// @route   GET /api/libraries
exports.getLibraries = async (req, res, next) => {
  try {
    const libraries = await dataService.getLibraries({
      status: req.query.status,
      search: req.query.search,
      sort: req.query.sort
    });

    res.status(200).json({
      success: true,
      count: libraries.length,
      data: libraries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get libraries near coordinates
// @route   GET /api/libraries/nearby
exports.getNearbyLibraries = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat || req.query.latitude || 12.9716);
    const lng = parseFloat(req.query.lng || req.query.longitude || 77.5946);
    const radius = parseFloat(req.query.radius || 50);

    const librariesWithDistance = await dataService.getNearbyLibraries(lat, lng, radius);

    res.status(200).json({
      success: true,
      count: librariesWithDistance.length,
      data: librariesWithDistance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single library by ID
// @route   GET /api/libraries/:id
exports.getLibraryById = async (req, res, next) => {
  try {
    const library = await dataService.getLibraryById(req.params.id);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    res.status(200).json({
      success: true,
      data: library
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create library
// @route   POST /api/libraries
exports.createLibrary = async (req, res, next) => {
  try {
    const adminName = req.user ? req.user.name : 'Library Admin';
    const library = await dataService.createLibrary(req.body, adminName);
    res.status(201).json({
      success: true,
      data: library
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update library
// @route   PUT /api/libraries/:id
exports.updateLibrary = async (req, res, next) => {
  try {
    const adminName = req.user ? req.user.name : 'Library Admin';
    const library = await dataService.updateLibrary(req.params.id, req.body, adminName);

    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    res.status(200).json({
      success: true,
      data: library
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update library seat occupancy (ADMIN)
// @route   PATCH /api/libraries/:id/seats or PUT /api/libraries/:id/seats
exports.updateLibrarySeats = async (req, res, next) => {
  try {
    const { totalSeats, occupiedSeats } = req.body;
    const adminName = req.user ? req.user.name : 'Praveen (Admin)';

    const result = await dataService.updateLibrarySeats(
      req.params.id,
      { totalSeats, occupiedSeats },
      adminName
    );

    res.status(200).json({
      success: true,
      message: 'Library seat availability updated successfully',
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Delete library
// @route   DELETE /api/libraries/:id
exports.deleteLibrary = async (req, res, next) => {
  try {
    const adminName = req.user ? req.user.name : 'Library Admin';
    const library = await dataService.deleteLibrary(req.params.id, adminName);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
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
