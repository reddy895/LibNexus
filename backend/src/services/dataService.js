const User = require('../models/User');
const Library = require('../models/Library');
const Book = require('../models/Book');
const ActivityLog = require('../models/ActivityLog');
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
      let sortOption = { updatedAt: -1 };
      if (sort === 'name') sortOption = { name: 1 };
      else if (sort === 'seats') sortOption = { availableSeats: -1 };
      else if (sort === 'books') sortOption = { totalBooks: -1 };

      const libraries = await Library.find(filter).sort(sortOption);
      return libraries.map(lib => {
        const obj = lib.toObject();
        obj.availableSeats = Math.max(0, (obj.totalSeats || 0) - (obj.occupiedSeats || 0));
        obj.occupancyPercentage = obj.totalSeats > 0 ? Math.round(((obj.occupiedSeats || 0) / obj.totalSeats) * 100) : 0;
        return obj;
      });
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
          libObj.availableSeats = Math.max(0, (libObj.totalSeats || 0) - (libObj.occupiedSeats || 0));
          libObj.occupancyPercentage = libObj.totalSeats > 0 ? Math.round(((libObj.occupiedSeats || 0) / libObj.totalSeats) * 100) : 0;
          return libObj;
        })
        .filter(item => item.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }
    return demoData.getNearbyLibraries(lat, lng, radius);
  },

  async getLibraryById(id) {
    if (isDbEnabled()) {
      const lib = await Library.findById(id);
      if (!lib) return null;
      const obj = lib.toObject();
      obj.availableSeats = Math.max(0, (obj.totalSeats || 0) - (obj.occupiedSeats || 0));
      obj.occupancyPercentage = obj.totalSeats > 0 ? Math.round(((obj.occupiedSeats || 0) / obj.totalSeats) * 100) : 0;
      return obj;
    }
    return demoData.getLibraryById(id);
  },

  async createLibrary(data, adminName) {
    if (isDbEnabled()) {
      const totalSeats = parseInt(data.totalSeats || 180, 10);
      const occupiedSeats = parseInt(data.occupiedSeats || 0, 10);
      const availableSeats = Math.max(0, totalSeats - occupiedSeats);

      const lib = await Library.create({
        ...data,
        totalSeats,
        occupiedSeats,
        availableSeats
      });

      await this.logActivity(adminName || 'Admin', 'Created new library', `Added library "${lib.name}"`, lib._id);

      return lib;
    }
    return demoData.createLibrary(data, adminName);
  },

  async updateLibrary(id, data, adminName) {
    if (isDbEnabled()) {
      const lib = await Library.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true, runValidators: true });
      if (lib) {
        await this.logActivity(adminName || 'Admin', 'Updated library details', `Updated "${lib.name}" info`, id);
      }
      return lib;
    }
    return demoData.updateLibrary(id, data, adminName);
  },

  async updateLibrarySeats(id, { totalSeats, occupiedSeats }, adminName) {
    if (isDbEnabled()) {
      const lib = await Library.findById(id);
      if (!lib) {
        const err = new Error('Library not found');
        err.statusCode = 404;
        throw err;
      }

      const tSeats = totalSeats !== undefined ? parseInt(totalSeats, 10) : lib.totalSeats;
      const oSeats = occupiedSeats !== undefined ? parseInt(occupiedSeats, 10) : lib.occupiedSeats;

      if (isNaN(tSeats) || isNaN(oSeats)) {
        const err = new Error('Total seats and occupied seats must be valid numbers');
        err.statusCode = 400;
        throw err;
      }

      if (oSeats > tSeats) {
        const err = new Error(`Occupied seats (${oSeats}) cannot exceed total seats (${tSeats})`);
        err.statusCode = 400;
        throw err;
      }

      lib.totalSeats = tSeats;
      lib.occupiedSeats = oSeats;
      lib.availableSeats = Math.max(0, tSeats - oSeats);
      lib.updatedAt = new Date();
      await lib.save();

      const occupancyPercentage = tSeats > 0 ? Math.round((oSeats / tSeats) * 100) : 0;

      await this.logActivity(
        adminName || 'Admin',
        'Updated seat availability',
        `Updated ${lib.name}: ${oSeats}/${tSeats} occupied (${lib.availableSeats} available, ${occupancyPercentage}% occupied)`,
        id
      );

      return {
        _id: lib._id,
        name: lib.name,
        totalSeats: lib.totalSeats,
        occupiedSeats: lib.occupiedSeats,
        availableSeats: lib.availableSeats,
        occupancyPercentage,
        updatedAt: lib.updatedAt
      };
    }
    return demoData.updateLibrarySeats(id, { totalSeats, occupiedSeats }, adminName);
  },

  async deleteLibrary(id, adminName) {
    if (isDbEnabled()) {
      const library = await Library.findByIdAndDelete(id);
      if (library) {
        await Book.deleteMany({ library: id });
        await this.logActivity(adminName || 'Admin', 'Deleted library', `Removed library "${library.name}"`, id);
      }
      return library;
    }
    return demoData.deleteLibrary(id, adminName);
  },

  // --- BOOKS ---
  async getBooks({ library, category, search, isNewArrival }) {
    if (isDbEnabled()) {
      const filter = {};
      if (library) filter.library = library;
      if (category && category !== 'all') filter.category = new RegExp(`^${category}$`, 'i');
      if (isNewArrival === 'true' || isNewArrival === true) filter.isNewArrival = true;
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
    return demoData.getBooks({ library, category, search, isNewArrival });
  },

  async getBookById(id) {
    if (isDbEnabled()) {
      return Book.findById(id).populate('library', 'name address city image openingTime closingTime');
    }
    return demoData.getBookById(id);
  },

  async createBook(data, adminName) {
    if (isDbEnabled()) {
      const book = await Book.create(data);
      await this.logActivity(
        adminName || 'Admin',
        'Added new book',
        `Added "${book.title}" by ${book.author}${book.isNewArrival ? ' (Marked as New Arrival)' : ''}`,
        data.library
      );
      return book;
    }
    return demoData.createBook(data, adminName);
  },

  async updateBook(id, data, adminName) {
    if (isDbEnabled()) {
      const book = await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (book) {
        await this.logActivity(adminName || 'Admin', 'Updated book details', `Updated "${book.title}"`, book.library);
      }
      return book;
    }
    return demoData.updateBook(id, data, adminName);
  },

  async deleteBook(id, adminName) {
    if (isDbEnabled()) {
      const book = await Book.findByIdAndDelete(id);
      if (book) {
        await this.logActivity(adminName || 'Admin', 'Deleted book', `Removed "${book.title}" from catalog`, book.library);
      }
      return book;
    }
    return demoData.deleteBook(id, adminName);
  },

  // --- ACTIVITY LOGS ---
  async getActivityLogs() {
    if (isDbEnabled()) {
      return ActivityLog.find({}).sort({ timestamp: -1 }).limit(50);
    }
    return demoData.getActivityLogs();
  },

  async logActivity(user, action, details, libraryId = null) {
    if (isDbEnabled()) {
      return ActivityLog.create({ user, action, details, libraryId, timestamp: new Date() });
    }
    return demoData.getActivityLogs()[0];
  },

  // --- ADMIN STATS ---
  async getAdminStats() {
    if (isDbEnabled()) {
      const totalLibraries = await Library.countDocuments({});
      const activeLibraries = await Library.countDocuments({ status: 'open' });

      const libraries = await Library.find({});
      const totalSeats = libraries.reduce((sum, l) => sum + (l.totalSeats || 0), 0);
      const occupiedSeats = libraries.reduce((sum, l) => sum + (l.occupiedSeats || 0), 0);
      const availableSeats = Math.max(0, totalSeats - occupiedSeats);

      const books = await Book.find({});
      const totalBooks = books.reduce((sum, b) => sum + (b.totalCopies || 1), 0);
      const newArrivalsCount = books.filter(b => b.isNewArrival).length;
      const registeredUsers = await User.countDocuments({});

      return {
        totalLibraries,
        activeLibraries,
        totalBooks,
        totalSeats,
        occupiedSeats,
        availableSeats,
        occupancyPercentage: totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0,
        newArrivalsCount,
        registeredUsers
      };
    }
    return demoData.getAdminStats();
  }
};

module.exports = dataService;
