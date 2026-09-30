const Library = require('../models/Library');
const Book = require('../models/Book');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get aggregate stats for Admin Dashboard
// @route   GET /api/admin/stats
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalLibraries = await Library.countDocuments({});
    const activeLibraries = await Library.countDocuments({ status: 'open' });

    const books = await Book.find({});
    const totalBooks = books.reduce((sum, b) => sum + (b.totalCopies || 1), 0);
    const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);

    const seats = await Seat.find({});
    const totalSeats = seats.length;
    const availableSeats = seats.filter(s => s.status === 'available').length;

    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const registeredUsers = await User.countDocuments({});

    res.status(200).json({
      success: true,
      data: {
        totalLibraries,
        activeLibraries,
        totalBooks,
        availableBooks,
        totalSeats,
        availableSeats,
        activeBookings,
        registeredUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for Admin
// @route   GET /api/admin/users
exports.getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
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

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
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
