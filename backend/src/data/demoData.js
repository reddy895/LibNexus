const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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

const generateObjectIdHex = () => new mongoose.Types.ObjectId().toHexString();

// Initial Demo Users
let users = [
  {
    _id: '650000000000000000000001',
    name: 'Praveen Kumar',
    email: 'admin@libnexus.com',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date('2026-01-01T00:00:00.000Z')
  },
  {
    _id: '650000000000000000000002',
    name: 'Alex Morgan',
    email: 'user@libnexus.com',
    password: bcrypt.hashSync('User@123', 10),
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date('2026-01-02T00:00:00.000Z')
  },
  {
    _id: '650000000000000000000003',
    name: 'Priya Sharma',
    email: 'librarian@libnexus.com',
    password: bcrypt.hashSync('Librarian@123', 10),
    role: 'librarian',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date('2026-01-03T00:00:00.000Z')
  }
];

// Initial Demo Libraries
let libraries = [
  {
    _id: '650000000000000000000101',
    name: 'Central Knowledge Hub & Library',
    description: 'Bengaluru flagship public library featuring multi-tier silent study halls, specialized research databases, and over 32,000 physical volumes.',
    address: '452 University Avenue, Academic Square',
    city: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    openingTime: '08:00 AM',
    closingTime: '10:00 PM',
    status: 'open',
    totalSeats: 180,
    occupiedSeats: 56,
    availableSeats: 124,
    totalBooks: 32150,
    availableBooks: 28400,
    phone: '+91 80 2345 6781',
    email: 'central@libnexus.org',
    facilities: ['High-Speed Wi-Fi', 'AC Reading Hall', 'Silent Zone', 'Power Outlets', 'Digital Lab', 'Cafeteria'],
    updatedAt: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    _id: '650000000000000000000102',
    name: 'Indiranagar Public Library & Innovation Hub',
    description: 'Modern neighborhood reading hall equipped with high-speed fiber internet, private cubicles, and contemporary literature collections.',
    address: '100 Feet Road, 12th Main, Indiranagar',
    city: 'Bengaluru',
    latitude: 12.9784,
    longitude: 77.6408,
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
    openingTime: '07:00 AM',
    closingTime: '09:00 PM',
    status: 'open',
    totalSeats: 150,
    occupiedSeats: 90,
    availableSeats: 60,
    totalBooks: 18400,
    availableBooks: 14200,
    phone: '+91 80 2345 6782',
    email: 'indiranagar@libnexus.org',
    facilities: ['Wi-Fi', 'AC', 'Coffee Bar', 'Group Discussion Pods', 'Power Outlets'],
    updatedAt: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    _id: '650000000000000000000103',
    name: 'Koramangala Research Vault Library',
    description: 'Specialized academic and tech research vault offering 24/7 digital access, journal subscriptions, and quiet ergonomic study desks.',
    address: '80 Feet Road, 4th Block, Koramangala',
    city: 'Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
    openingTime: '08:30 AM',
    closingTime: '11:00 PM',
    status: 'open',
    totalSeats: 200,
    occupiedSeats: 160,
    availableSeats: 40,
    totalBooks: 24500,
    availableBooks: 20100,
    phone: '+91 80 2345 6783',
    email: 'koramangala@libnexus.org',
    facilities: ['24/7 Fiber Wi-Fi', 'Silent Research Bays', 'Journal Database', 'AC', 'Ergonomic Seating'],
    updatedAt: new Date(Date.now() - 12 * 60 * 1000)
  },
  {
    _id: '650000000000000000000104',
    name: 'Jayanagar Academic Study Hall',
    description: 'Spacious study hall popular among university students preparing for competitive exams and academic research.',
    address: '3rd Block, 11th Main, Jayanagar',
    city: 'Bengaluru',
    latitude: 12.9250,
    longitude: 77.5938,
    image: 'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?auto=format&fit=crop&w=800&q=80',
    openingTime: '08:00 AM',
    closingTime: '09:30 PM',
    status: 'open',
    totalSeats: 120,
    occupiedSeats: 30,
    availableSeats: 90,
    totalBooks: 14200,
    availableBooks: 12000,
    phone: '+91 80 2345 6784',
    email: 'jayanagar@libnexus.org',
    facilities: ['Wi-Fi', 'Quiet Cubicles', 'Newspaper Archive', 'Parking', 'RO Water'],
    updatedAt: new Date(Date.now() - 8 * 60 * 1000)
  },
  {
    _id: '650000000000000000000105',
    name: 'Whitefield Tech & Science Library',
    description: 'State-of-the-art tech reference library featuring computer labs, AI research papers, and technical engineering books.',
    address: 'ITPL Main Road, EPIP Zone, Whitefield',
    city: 'Bengaluru',
    latitude: 12.9698,
    longitude: 77.7499,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    openingTime: '09:00 AM',
    closingTime: '10:00 PM',
    status: 'open',
    totalSeats: 220,
    occupiedSeats: 180,
    availableSeats: 40,
    totalBooks: 29800,
    availableBooks: 24300,
    phone: '+91 80 2345 6785',
    email: 'whitefield@libnexus.org',
    facilities: ['High-Speed Wi-Fi', 'Computer Lab', 'AC', 'E-Book Kiosks', 'Power Desks'],
    updatedAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    _id: '650000000000000000000106',
    name: 'Malleshwaram Heritage Library',
    description: 'Charming historic library preserving rare classical literature, manuscripts, and quiet garden courtyard reading spaces.',
    address: 'Margosa Road, 8th Cross, Malleshwaram',
    city: 'Bengaluru',
    latitude: 13.0031,
    longitude: 77.5694,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
    status: 'open',
    totalSeats: 100,
    occupiedSeats: 25,
    availableSeats: 75,
    totalBooks: 16500,
    availableBooks: 14800,
    phone: '+91 80 2345 6786',
    email: 'malleshwaram@libnexus.org',
    facilities: ['Historical Archives', 'Quiet Zone', 'Garden Courtyard', 'Wi-Fi'],
    updatedAt: new Date(Date.now() - 20 * 60 * 1000)
  }
];

// Initial Demo Books
let books = [
  {
    _id: '650000000000000000000201',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category: 'Programming',
    publisher: "O'Reilly Media",
    publicationYear: 2017,
    description: 'The key principles, algorithms, and trade-offs of data systems.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    library: libraries[0]._id,
    totalCopies: 5,
    availableCopies: 3,
    isNewArrival: true,
    arrivalDate: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000)
  },
  {
    _id: '650000000000000000000202',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    category: 'Self-Help',
    publisher: 'Avery',
    publicationYear: 2018,
    description: 'An easy and proven way to build good habits and break bad ones.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    library: libraries[0]._id,
    totalCopies: 8,
    availableCopies: 5,
    isNewArrival: true,
    arrivalDate: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000)
  },
  {
    _id: '650000000000000000000203',
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    isbn: '978-1593279288',
    category: 'Programming',
    publisher: 'No Starch Press',
    publicationYear: 2023,
    description: 'A hands-on, project-based introduction to programming in Python.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    library: libraries[1]._id,
    totalCopies: 4,
    availableCopies: 2,
    isNewArrival: false,
    arrivalDate: new Date('2026-01-10T00:00:00.000Z'),
    createdAt: new Date('2026-01-10T00:00:00.000Z')
  },
  {
    _id: '650000000000000000000204',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-0134610993',
    category: 'Artificial Intelligence',
    publisher: 'Pearson',
    publicationYear: 2020,
    description: 'The comprehensive textbook on artificial intelligence theory.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    library: libraries[4]._id,
    totalCopies: 6,
    availableCopies: 4,
    isNewArrival: true,
    arrivalDate: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000)
  },
  {
    _id: '650000000000000000000205',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    category: 'History',
    publisher: 'Harper',
    publicationYear: 2015,
    description: 'A bold look at human evolution and societal development.',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    library: libraries[5]._id,
    totalCopies: 7,
    availableCopies: 6,
    isNewArrival: false,
    arrivalDate: new Date('2026-01-05T00:00:00.000Z'),
    createdAt: new Date('2026-01-05T00:00:00.000Z')
  },
  {
    _id: '650000000000000000000206',
    title: 'Clean Code: Handbook of Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Programming',
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    description: 'Refactoring, code smells, and writing maintainable agile code.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    library: libraries[2]._id,
    totalCopies: 5,
    availableCopies: 3,
    isNewArrival: false,
    arrivalDate: new Date('2026-01-15T00:00:00.000Z'),
    createdAt: new Date('2026-01-15T00:00:00.000Z')
  }
];

// Initial Activity Logs
let activityLogs = [
  {
    _id: '650000000000000000000501',
    user: 'Praveen Kumar',
    action: 'Updated seat availability',
    details: 'Central Knowledge Hub: 56 / 180 occupied (124 available)',
    libraryId: libraries[0]._id,
    timestamp: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    _id: '650000000000000000000502',
    user: 'Priya Sharma',
    action: 'Added new book arrival',
    details: 'Added "Designing Data-Intensive Applications" to Central Library',
    libraryId: libraries[0]._id,
    timestamp: new Date(Date.now() - 25 * 60 * 1000)
  },
  {
    _id: '650000000000000000000503',
    user: 'Praveen Kumar',
    action: 'Updated seat availability',
    details: 'Koramangala Research Vault: 160 / 200 occupied (40 available)',
    libraryId: libraries[2]._id,
    timestamp: new Date(Date.now() - 50 * 60 * 1000)
  }
];

const formatUser = (user) => {
  if (!user) return null;
  const userObj = { ...user };
  userObj.matchPassword = async function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
  };
  return userObj;
};

const updateLibrarySeatCalculations = (lib) => {
  if (!lib) return;
  if (lib.occupiedSeats > lib.totalSeats) {
    lib.occupiedSeats = lib.totalSeats;
  }
  lib.availableSeats = Math.max(0, lib.totalSeats - lib.occupiedSeats);
  lib.occupancyPercentage = lib.totalSeats > 0 ? Math.round((lib.occupiedSeats / lib.totalSeats) * 100) : 0;
};

libraries.forEach(l => updateLibrarySeatCalculations(l));

const addActivityLog = (user, action, details, libraryId = null) => {
  const log = {
    _id: generateObjectIdHex(),
    user: user || 'Praveen Kumar',
    action,
    details: details || '',
    libraryId,
    timestamp: new Date()
  };
  activityLogs.unshift(log);
  if (activityLogs.length > 50) activityLogs.pop();
  return log;
};

const demoData = {
  calculateDistance,

  // --- USERS ---
  findUserByEmail(email) {
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    return formatUser(user);
  },

  findUserById(id) {
    const user = users.find(u => u._id.toString() === (id || '').toString());
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  createUser(userData) {
    const newId = generateObjectIdHex();
    const newUser = {
      _id: newId,
      name: userData.name,
      email: userData.email,
      password: bcrypt.hashSync(userData.password, 10),
      role: userData.role || 'user',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date()
    };
    users.push(newUser);
    return formatUser(newUser);
  },

  findUsers() {
    return users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  updateUserRole(id, role) {
    const user = users.find(u => u._id.toString() === (id || '').toString());
    if (!user) return null;
    user.role = role;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // --- LIBRARIES ---
  getLibraries({ status, search, sort }) {
    let result = libraries.map(l => {
      updateLibrarySeatCalculations(l);
      return { ...l };
    });

    if (status) {
      result = result.filter(l => (l.status || '').toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      );
    }

    if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'seats') {
      result.sort((a, b) => b.availableSeats - a.availableSeats);
    } else if (sort === 'books') {
      result.sort((a, b) => b.totalBooks - a.totalBooks);
    } else {
      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return result;
  },

  getNearbyLibraries(lat, lng, radius = 50) {
    return libraries
      .map(lib => {
        updateLibrarySeatCalculations(lib);
        const dist = calculateDistance(lat, lng, lib.latitude, lib.longitude);
        return { ...lib, distance: dist };
      })
      .filter(item => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  },

  getLibraryById(id) {
    const lib = libraries.find(l => l._id.toString() === (id || '').toString());
    if (!lib) return null;
    updateLibrarySeatCalculations(lib);
    return { ...lib };
  },

  createLibrary(data, adminName) {
    const totalSeats = parseInt(data.totalSeats || 180, 10);
    const occupiedSeats = parseInt(data.occupiedSeats || 0, 10);

    const newLib = {
      _id: generateObjectIdHex(),
      name: data.name,
      description: data.description || '',
      address: data.address || '',
      city: data.city || 'Bengaluru',
      latitude: parseFloat(data.latitude) || 12.9716,
      longitude: parseFloat(data.longitude) || 77.5946,
      image: data.image || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      openingTime: data.openingTime || '08:00 AM',
      closingTime: data.closingTime || '10:00 PM',
      status: data.status || 'open',
      phone: data.phone || '+91 80 2345 6789',
      email: data.email || 'contact@libnexus.org',
      facilities: data.facilities || ['Wi-Fi', 'AC', 'Silent Zone', 'Power Outlets'],
      totalSeats,
      occupiedSeats,
      availableSeats: Math.max(0, totalSeats - occupiedSeats),
      totalBooks: parseInt(data.totalBooks || 0, 10),
      availableBooks: parseInt(data.availableBooks || 0, 10),
      updatedAt: new Date()
    };
    updateLibrarySeatCalculations(newLib);
    libraries.push(newLib);

    addActivityLog(adminName || 'Praveen Kumar', 'Created new library', `Added library "${newLib.name}"`, newLib._id);

    return newLib;
  },

  updateLibrary(id, data, adminName) {
    const index = libraries.findIndex(l => l._id.toString() === (id || '').toString());
    if (index === -1) return null;

    libraries[index] = {
      ...libraries[index],
      ...data,
      updatedAt: new Date()
    };

    updateLibrarySeatCalculations(libraries[index]);

    addActivityLog(adminName || 'Praveen Kumar', 'Updated library details', `Updated "${libraries[index].name}" info`, id);

    return libraries[index];
  },

  updateLibrarySeats(id, { totalSeats, occupiedSeats }, adminName) {
    const lib = libraries.find(l => l._id.toString() === (id || '').toString());
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

    const prevAvailable = lib.availableSeats;
    lib.totalSeats = tSeats;
    lib.occupiedSeats = oSeats;
    lib.availableSeats = Math.max(0, tSeats - oSeats);
    lib.occupancyPercentage = tSeats > 0 ? Math.round((oSeats / tSeats) * 100) : 0;
    lib.updatedAt = new Date();

    addActivityLog(
      adminName || 'Praveen Kumar',
      'Updated seat availability',
      `Updated ${lib.name}: ${oSeats}/${tSeats} occupied (${lib.availableSeats} available, ${lib.occupancyPercentage}% occupied)`,
      id
    );

    return {
      _id: lib._id,
      name: lib.name,
      totalSeats: lib.totalSeats,
      occupiedSeats: lib.occupiedSeats,
      availableSeats: lib.availableSeats,
      occupancyPercentage: lib.occupancyPercentage,
      updatedAt: lib.updatedAt
    };
  },

  deleteLibrary(id, adminName) {
    const index = libraries.findIndex(l => l._id.toString() === (id || '').toString());
    if (index === -1) return null;
    const deleted = libraries.splice(index, 1)[0];
    books = books.filter(b => b.library.toString() !== id.toString());

    addActivityLog(adminName || 'Praveen Kumar', 'Deleted library', `Removed library "${deleted.name}"`, id);

    return deleted;
  },

  // --- BOOKS ---
  getBooks({ library, category, search, isNewArrival }) {
    let result = [...books];

    if (library) {
      result = result.filter(b => b.library.toString() === library.toString());
    }

    if (category && category.toLowerCase() !== 'all') {
      result = result.filter(b => (b.category || '').toLowerCase() === category.toLowerCase());
    }

    if (isNewArrival === 'true' || isNewArrival === true) {
      result = result.filter(b => b.isNewArrival === true);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          (b.category && b.category.toLowerCase().includes(q))
      );
    }

    return result
      .map(book => {
        const lib = libraries.find(l => l._id.toString() === book.library.toString());
        return {
          ...book,
          library: lib ? { _id: lib._id, name: lib.name, address: lib.address, city: lib.city, image: lib.image } : book.library
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getBookById(id) {
    const book = books.find(b => b._id.toString() === (id || '').toString());
    if (!book) return null;
    const lib = libraries.find(l => l._id.toString() === book.library.toString());
    return {
      ...book,
      library: lib ? { _id: lib._id, name: lib.name, address: lib.address, city: lib.city, image: lib.image, openingTime: lib.openingTime, closingTime: lib.closingTime } : book.library
    };
  },

  createBook(data, adminName) {
    const newBook = {
      _id: generateObjectIdHex(),
      title: data.title,
      author: data.author,
      isbn: data.isbn || `978-${Math.floor(Math.random() * 899999999 + 100000000)}`,
      category: data.category || 'General',
      publisher: data.publisher || 'LibNexus Publishing',
      publicationYear: parseInt(data.publicationYear || 2024, 10),
      description: data.description || '',
      library: data.library,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      totalCopies: parseInt(data.totalCopies || data.quantity || 3, 10),
      availableCopies: parseInt(data.availableCopies || data.availableQuantity || 3, 10),
      isNewArrival: data.isNewArrival === true || data.isNewArrival === 'true',
      arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : new Date(),
      createdAt: new Date()
    };
    books.push(newBook);

    const lib = libraries.find(l => l._id.toString() === data.library.toString());
    if (lib) {
      lib.totalBooks = (lib.totalBooks || 0) + newBook.totalCopies;
    }

    addActivityLog(
      adminName || 'Praveen Kumar',
      'Added new book',
      `Added "${newBook.title}" by ${newBook.author}${newBook.isNewArrival ? ' (Marked as New Arrival)' : ''}`,
      data.library
    );

    return newBook;
  },

  updateBook(id, data, adminName) {
    const index = books.findIndex(b => b._id.toString() === (id || '').toString());
    if (index === -1) return null;

    books[index] = { ...books[index], ...data };

    addActivityLog(
      adminName || 'Praveen Kumar',
      'Updated book details',
      `Updated "${books[index].title}"`,
      books[index].library
    );

    return books[index];
  },

  deleteBook(id, adminName) {
    const index = books.findIndex(b => b._id.toString() === (id || '').toString());
    if (index === -1) return null;
    const deleted = books.splice(index, 1)[0];

    addActivityLog(
      adminName || 'Praveen Kumar',
      'Deleted book',
      `Removed "${deleted.title}" from catalog`,
      deleted.library
    );

    return deleted;
  },

  // --- ACTIVITY LOGS ---
  getActivityLogs() {
    return [...activityLogs];
  },

  // --- ADMIN STATS ---
  getAdminStats() {
    const totalLibraries = libraries.length;
    const activeLibraries = libraries.filter(l => (l.status || '').toLowerCase() === 'open').length;

    const totalBooksCalculated = books.reduce((sum, b) => sum + (b.totalCopies || 1), 0);
    const totalSeatsCalculated = libraries.reduce((sum, l) => sum + (l.totalSeats || 0), 0);
    const occupiedSeatsCalculated = libraries.reduce((sum, l) => sum + (l.occupiedSeats || 0), 0);
    const availableSeatsCalculated = Math.max(0, totalSeatsCalculated - occupiedSeatsCalculated);

    const newArrivalsCount = books.filter(b => b.isNewArrival).length;
    const registeredUsers = users.length;

    return {
      totalLibraries,
      activeLibraries,
      totalBooks: totalBooksCalculated,
      totalSeats: totalSeatsCalculated,
      occupiedSeats: occupiedSeatsCalculated,
      availableSeats: availableSeatsCalculated,
      occupancyPercentage: totalSeatsCalculated > 0 ? Math.round((occupiedSeatsCalculated / totalSeatsCalculated) * 100) : 0,
      newArrivalsCount,
      registeredUsers
    };
  }
};

module.exports = demoData;
