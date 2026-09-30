const Library = require('../models/Library');
const Seat = require('../models/Seat');
const Book = require('../models/Book');

// Haversine distance calculator in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

// @desc    Get all libraries with query filters
// @route   GET /api/libraries
exports.getLibraries = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status.toLowerCase();
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { city: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'name') sortOption = { name: 1 };
    else if (req.query.sort === 'seats') sortOption = { availableSeats: -1 };
    else if (req.query.sort === 'books') sortOption = { availableBooks: -1 };

    const libraries = await Library.find(filter).sort(sortOption);

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

    const libraries = await Library.find({});

    const librariesWithDistance = libraries.map(lib => {
      const dist = calculateDistance(lat, lng, lib.latitude, lib.longitude);
      const libObj = lib.toObject();
      libObj.distance = dist;
      return libObj;
    })
    .filter(item => item.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

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
    const library = await Library.findById(req.params.id);
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
    const library = await Library.create(req.body);
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
    const library = await Library.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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

// @desc    Delete library
// @route   DELETE /api/libraries/:id
exports.deleteLibrary = async (req, res, next) => {
  try {
    const library = await Library.findByIdAndDelete(req.params.id);
    if (!library) {
      return res.status(404).json({
        success: false,
        message: 'Library not found'
      });
    }

    await Seat.deleteMany({ library: req.params.id });
    await Book.deleteMany({ library: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
