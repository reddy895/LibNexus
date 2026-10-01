const User = require('../models/User');
const Library = require('../models/Library');
const Book = require('../models/Book');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const demoData = require('../data/demoData');

const isDbEnabled = () => process.env.DATABASE_ENABLED === 'true';

const dataService = {
  isDbEnabled,

  // --- USER / AUTH ---
  async findUserByEmail(email) {
    if (isDbEnabled()) {
      return User.findOne({ email }).select('+password');
    }
    return demoData.findUserByEmail(email);
  },

  async findUserById(id) {
    if (isDbEnabled()) {
      return User.findById(id).select('-password');
    }
    return demoData.findUserById(id);
  },

  async createUser(userData) {
    if (isDbEnabled()) {
      return User.create(userData);
    }
    return demoData.createUser(userData);
  },

  async findUsers() {
    if (isDbEnabled()) {
      return User.find({}).select('-password').sort({ createdAt: -1 });
    }
    return demoData.findUsers();
  },

  async updateUserRole(id, role) {
    if (isDbEnabled()) {
      return User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    }
    return demoData.updateUserRole(id, role);
  },

  // --- LIBRARIES ---
  async getLibraries({ status, search, sort }) {
    if (isDbEnabled()) {
      const filter = {};
      if (status) filter.status = status.toLowerCase();
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { name: searchRegex },
          { address: searchRegex },
          { city: searchRegex }
        ];
      }
      let sortOption = { createdAt: -1 };
      if (sort === 'name') sortOption = { name: 1 };
      else if (sort === 'seats') sortOption = { availableSeats: -1 };
      else if (sort === 'books') sortOption = { availableBooks: -1 };

      return Library.find(filter).sort(sortOption);
    }
    return demoData.getLibraries({ status, search, sort });
  },

  async getNearbyLibraries(lat, lng, radius = 50) {
    if (isDbEnabled()) {
      const libraries = await Library.find({});
      return libraries
        .map(lib => {
          const dist = demoData.calculateDistance(lat, lng, lib.latitude, lib.longitude);
          const libObj = lib.toObject();
          libObj.distance = dist;
          return libObj;
        })
        .filter(item => item.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }
    return demoData.getNearbyLibraries(lat, lng, radius);
  },

  async getLibraryById(id) {
    if (isDbEnabled()) {
      return Library.findById(id);
    }
    return demoData.getLibraryById(id);
  },

  async createLibrary(data) {
    if (isDbEnabled()) {
      return Library.create(data);
    }
    return demoData.createLibrary(data);
  },

  async updateLibrary(id, data) {
    if (isDbEnabled()) {
      return Library.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    return demoData.updateLibrary(id, data);
  },

  async deleteLibrary(id) {
    if (isDbEnabled()) {
      const library = await Library.findByIdAndDelete(id);
      if (library) {
        await Seat.deleteMany({ library: id });
        await Book.deleteMany({ library: id });
      }
      return library;
    }
    return demoData.deleteLibrary(id);
  },

  // --- BOOKS ---
  async getBooks({ library, category, search }) {
    if (isDbEnabled()) {
      const filter = {};
      if (library) filter.library = library;
      if (category && category !== 'all') filter.category = new RegExp(`^${category}$`, 'i');
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { title: searchRegex },
          { author: searchRegex },
          { isbn: searchRegex },
          { category: searchRegex }
        ];
      }
      return Book.find(filter).populate('library', 'name address city image').sort({ createdAt: -1 });
    }
    return demoData.getBooks({ library, category, search });
  },

  async getBookById(id) {
    if (isDbEnabled()) {
      return Book.findById(id).populate('library', 'name address city image openingTime closingTime');
    }
    return demoData.getBookById(id);
  },

  async createBook(data) {
    if (isDbEnabled()) {
      const book = await Book.create(data);
      await this.updateLibraryBookStats(book.library);
      return book;
    }
    return demoData.createBook(data);
  },

  async updateBook(id, data) {
    if (isDbEnabled()) {
      const book = await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (book) await this.updateLibraryBookStats(book.library);
      return book;
    }
    return demoData.updateBook(id, data);
  },

  async deleteBook(id) {
    if (isDbEnabled()) {
      const book = await Book.findByIdAndDelete(id);
      if (book) await this.updateLibraryBookStats(book.library);
      return book;
    }
    return demoData.deleteBook(id);
  },

  // --- SEATS ---
  async getSeatsByLibrary(libraryId, { floor, status } = {}) {
    if (isDbEnabled()) {
      const filter = { library: libraryId };
      if (floor) filter.floor = parseInt(floor, 10);
      if (status) filter.status = status.toLowerCase();
      return Seat.find(filter).sort({ floor: 1, seatNumber: 1 });
    }
    return demoData.getSeatsByLibrary(libraryId, { floor, status });
  },

  async getAvailableSeatsByLibrary(libraryId) {
    if (isDbEnabled()) {
      return Seat.find({ library: libraryId, status: 'available' }).sort({ floor: 1, seatNumber: 1 });
    }
    return demoData.getAvailableSeatsByLibrary(libraryId);
  },

  async createSeat(data) {
    if (isDbEnabled()) {
      const seat = await Seat.create(data);
      await this.updateLibrarySeatStats(seat.library);
      return seat;
    }
    return demoData.createSeat(data);
  },

  async updateSeat(id, data) {
    if (isDbEnabled()) {
      const seat = await Seat.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (seat) await this.updateLibrarySeatStats(seat.library);
      return seat;
    }
    return demoData.updateSeat(id, data);
  },

  async deleteSeat(id) {
    if (isDbEnabled()) {
      const seat = await Seat.findByIdAndDelete(id);
      if (seat) await this.updateLibrarySeatStats(seat.library);
      return seat;
    }
    return demoData.deleteSeat(id);
  },

  // --- BOOKINGS ---
  async createBooking({ userId, libraryId, seatId, start, end }) {
    if (isDbEnabled()) {
      const library = await Library.findById(libraryId);
      if (!library) {
        const err = new Error('Library not found');
        err.statusCode = 404;
        throw err;
      }

      const seat = await Seat.findById(seatId);
      if (!seat) {
        const err = new Error('Seat not found');
        err.statusCode = 404;
        throw err;
      }

      if (seat.library.toString() !== libraryId.toString()) {
        const err = new Error(`Seat ${seat.seatNumber} does not belong to library ${library.name}`);
        err.statusCode = 400;
        throw err;
      }

      if (seat.status !== 'available') {
        const err = new Error(`Seat ${seat.seatNumber} is currently ${seat.status}`);
        err.statusCode = 409;
        throw err;
      }

      const overlappingBooking = await Booking.findOne({
        seat: seatId,
        status: 'active',
        $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }]
      });

      if (overlappingBooking) {
        const err = new Error(`Seat ${seat.seatNumber} is already reserved for the selected time window`);
        err.statusCode = 409;
        throw err;
      }

      const booking = await Booking.create({
        user: userId,
        library: libraryId,
        seat: seatId,
        startTime: start,
        endTime: end,
        status: 'active'
      });

      seat.status = 'reserved';
      await seat.save();
      await this.updateLibrarySeatStats(libraryId);

      return Booking.findById(booking._id)
        .populate('user', 'name email')
        .populate('library', 'name address image')
        .populate('seat', 'seatNumber floor section type status');
    }
    return demoData.createBooking({ userId, libraryId, seatId, start, end });
  },

  async getBookings({ userId, libraryId, status, isUserOnly } = {}) {
    if (isDbEnabled()) {
      const filter = {};
      if (isUserOnly && userId) filter.user = userId;
      else if (userId) filter.user = userId;
      if (libraryId) filter.library = libraryId;
      if (status) filter.status = status;

      return Booking.find(filter)
        .populate('user', 'name email')
        .populate('library', 'name address image')
        .populate('seat', 'seatNumber floor section type status')
        .sort({ createdAt: -1 });
    }
    return demoData.getBookings({ userId, libraryId, status, isUserOnly });
  },

  async getBookingById(id) {
    if (isDbEnabled()) {
      return Booking.findById(id)
        .populate('user', 'name email')
        .populate('library', 'name address image')
        .populate('seat', 'seatNumber floor section type status');
    }
    return demoData.getBookingById(id);
  },

  async cancelBooking(id) {
    if (isDbEnabled()) {
      const booking = await Booking.findById(id);
      if (!booking) return null;
      if (booking.status === 'cancelled') {
        const err = new Error('Booking is already cancelled');
        err.statusCode = 400;
        throw err;
      }
      booking.status = 'cancelled';
      await booking.save();

      const seat = await Seat.findById(booking.seat);
      if (seat) {
        seat.status = 'available';
        await seat.save();
        await this.updateLibrarySeatStats(seat.library);
      }
      return booking;
    }
    return demoData.cancelBooking(id);
  },

  // --- ADMIN STATS ---
  async getAdminStats() {
    if (isDbEnabled()) {
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

      return {
        totalLibraries,
        activeLibraries,
        totalBooks,
        availableBooks,
        totalSeats,
        availableSeats,
        activeBookings,
        registeredUsers
      };
    }
    return demoData.getAdminStats();
  },

  // --- STAT HELPERS ---
  async updateLibraryBookStats(libraryId) {
    if (!libraryId) return;
    const books = await Book.find({ library: libraryId });
    const totalBooks = books.reduce((sum, b) => sum + (b.totalCopies || 1), 0);
    const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
    await Library.findByIdAndUpdate(libraryId, { totalBooks, availableBooks });
  },

  async updateLibrarySeatStats(libraryId) {
    if (!libraryId) return;
    const seats = await Seat.find({ library: libraryId });
    const totalSeats = seats.length;
    const availableSeats = seats.filter(s => s.status === 'available').length;
    await Library.findByIdAndUpdate(libraryId, { totalSeats, availableSeats });
  }
};

module.exports = dataService;
