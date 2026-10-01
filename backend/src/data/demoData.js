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

// Initial Mock Seed Data
let users = [
  {
    _id: '650000000000000000000001',
    name: 'System Admin',
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
    name: 'Priya Sharma (Librarian)',
    email: 'librarian@libnexus.com',
    password: bcrypt.hashSync('Librarian@123', 10),
    role: 'librarian',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    createdAt: new Date('2026-01-03T00:00:00.000Z')
  }
];

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
    facilities: ['High-Speed Wi-Fi', 'AC Reading Hall', 'Silent Zone', 'Power Outlets', 'Digital Lab', 'Cafeteria'],
    totalSeats: 36,
    availableSeats: 30,
    totalBooks: 95,
    availableBooks: 70,
    createdAt: new Date('2026-01-05T00:00:00.000Z')
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
    facilities: ['Wi-Fi', 'AC', 'Coffee Bar', 'Group Discussion Pods', 'Power Outlets'],
    totalSeats: 36,
    availableSeats: 32,
    totalBooks: 80,
    availableBooks: 60,
    createdAt: new Date('2026-01-06T00:00:00.000Z')
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
    facilities: ['24/7 Fiber Wi-Fi', 'Silent Research Bays', 'Journal Database', 'AC', 'Ergonomic Seating'],
    totalSeats: 36,
    availableSeats: 28,
    totalBooks: 90,
    availableBooks: 75,
    createdAt: new Date('2026-01-07T00:00:00.000Z')
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
    facilities: ['Wi-Fi', 'Quiet Cubicles', 'Newspaper Archive', 'Parking', 'RO Water'],
    totalSeats: 36,
    availableSeats: 34,
    totalBooks: 75,
    availableBooks: 55,
    createdAt: new Date('2026-01-08T00:00:00.000Z')
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
    facilities: ['High-Speed Wi-Fi', 'Computer Lab', 'AC', 'E-Book Kiosks', 'Power Desks'],
    totalSeats: 36,
    availableSeats: 31,
    totalBooks: 100,
    availableBooks: 82,
    createdAt: new Date('2026-01-09T00:00:00.000Z')
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
    facilities: ['Historical Archives', 'Quiet Zone', 'Garden Courtyard', 'Wi-Fi'],
    totalSeats: 36,
    availableSeats: 35,
    totalBooks: 65,
    availableBooks: 50,
    createdAt: new Date('2026-01-10T00:00:00.000Z')
  }
];

const rawBookTemplates = [
  { title: 'Python Crash Course', author: 'Eric Matthes', isbn: '978-1593279288', category: 'Programming', coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', description: 'A hands-on, project-based introduction to programming in Python.' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-1449373320', category: 'Programming', coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', description: 'The key principles, algorithms, and trade-offs of data systems.' },
  { title: 'Clean Code: Handbook of Software Craftsmanship', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Programming', coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', description: 'Refactoring, code smells, and writing maintainable agile code.' },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', isbn: '978-0134610993', category: 'Artificial Intelligence', coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', description: 'The comprehensive textbook on artificial intelligence theory.' },
  { title: 'Deep Learning', author: 'Ian Goodfellow, Yoshua Bengio', isbn: '978-0262035613', category: 'Artificial Intelligence', coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80', description: 'Mathematical and conceptual background for deep learning architectures.' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '978-0135957059', category: 'Programming', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80', description: 'Your journey to mastery in software development.' },
  { title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80', description: 'Comprehensive guide to modern computer algorithms.' },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0596517748', category: 'Programming', coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80', description: 'Unearthing the elegant subset of JavaScript.' },
  { title: 'You Don\'t Know JS Yet', author: 'Kyle Simpson', isbn: '978-1838838380', category: 'Programming', coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', description: 'Deep dive into scope, closures, and object prototypes.' },
  { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', isbn: '978-1492032649', category: 'Artificial Intelligence', coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', description: 'Scikit-Learn, Keras, and TensorFlow implementations.' },
  { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'History', coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80', description: 'A bold look at human evolution and societal development.' },
  { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self-Help', coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', description: 'An easy and proven way to build good habits and break bad ones.' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '978-0374533557', category: 'Psychology', coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', description: 'System 1 and System 2 cognitive decision-making models.' },
  { title: 'The Elements of Statistical Learning', author: 'Trevor Hastie', isbn: '978-0387848570', category: 'Data Science', coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80', description: 'Data mining, inference, and prediction techniques.' },
  { title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose', isbn: '978-0133594140', category: 'Computer Science', coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', description: 'Layered networking protocols and internet mechanics.' }
];

let books = [];
let bookCounter = 201;
libraries.forEach((lib, libIdx) => {
  rawBookTemplates.slice(0, 8).forEach((b, bIdx) => {
    const bookId = `650000000000000000000${bookCounter++}`;
    books.push({
      _id: bookId,
      title: b.title,
      author: b.author,
      isbn: `${b.isbn}-${libIdx + 1}`,
      category: b.category,
      description: b.description,
      library: lib._id,
      coverImage: b.coverImage,
      totalCopies: 5,
      availableCopies: 3,
      createdAt: new Date('2026-01-15T00:00:00.000Z')
    });
  });
});

let seats = [];
let seatCounter = 301;
libraries.forEach((lib) => {
  const sections = ['Window Bay Area', 'Central Silent Pods', 'Research Desk Lane'];
  const types = ['desk', 'cubicle', 'quiet', 'group'];

  for (let floor = 1; floor <= 2; floor++) {
    ['A', 'B'].forEach(prefix => {
      for (let i = 1; i <= 3; i++) {
        const num = `${prefix}0${i}`;
        const seatId = `6500000000000000000${seatCounter++}`;
        const section = sections[(floor + i) % sections.length];
        const type = types[i % types.length];

        seats.push({
          _id: seatId,
          library: lib._id,
          seatNumber: `${num} (F${floor})`,
          floor,
          section,
          type,
          status: 'available',
          createdAt: new Date('2026-01-15T00:00:00.000Z')
        });
      }
    });
  }
});

// Mark one seat reserved for initial booking
if (seats.length > 0) {
  seats[0].status = 'reserved';
}

let bookings = [
  {
    _id: '650000000000000000000401',
    user: '650000000000000000000002',
    library: libraries[0]._id,
    seat: seats[0]._id,
    startTime: new Date('2026-10-01T09:00:00.000Z'),
    endTime: new Date('2026-10-01T17:00:00.000Z'),
    status: 'active',
    createdAt: new Date('2026-10-01T08:30:00.000Z')
  }
];

// Helper to attach Mongoose-like methods to user object
const formatUser = (user) => {
  if (!user) return null;
  const userObj = { ...user };
  userObj.matchPassword = async function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
  };
  return userObj;
};

// Helper to update library stats
const updateLibraryStats = (libraryId) => {
  const lib = libraries.find(l => l._id.toString() === libraryId.toString());
  if (!lib) return;

  const libSeats = seats.filter(s => s.library.toString() === libraryId.toString());
  lib.totalSeats = libSeats.length;
  lib.availableSeats = libSeats.filter(s => s.status === 'available').length;

  const libBooks = books.filter(b => b.library.toString() === libraryId.toString());
  lib.totalBooks = libBooks.reduce((sum, b) => sum + (b.totalCopies || 1), 0);
  lib.availableBooks = libBooks.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
};

// Recalculate stats for initial libraries
libraries.forEach(lib => updateLibraryStats(lib._id));

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
    let result = [...libraries];

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
      result.sort((a, b) => b.availableBooks - a.availableBooks);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  },

  getNearbyLibraries(lat, lng, radius = 50) {
    return libraries
      .map(lib => {
        const dist = calculateDistance(lat, lng, lib.latitude, lib.longitude);
        return { ...lib, distance: dist };
      })
      .filter(item => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  },

  getLibraryById(id) {
    return libraries.find(l => l._id.toString() === (id || '').toString()) || null;
  },

  createLibrary(data) {
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
      closingTime: data.closingTime || '09:00 PM',
      status: data.status || 'open',
      facilities: data.facilities || ['Wi-Fi', 'AC'],
      totalSeats: 0,
      availableSeats: 0,
      totalBooks: 0,
      availableBooks: 0,
      createdAt: new Date()
    };
    libraries.push(newLib);
    updateLibraryStats(newLib._id);
    return newLib;
  },

  updateLibrary(id, data) {
    const index = libraries.findIndex(l => l._id.toString() === (id || '').toString());
    if (index === -1) return null;
    libraries[index] = { ...libraries[index], ...data };
    updateLibraryStats(libraries[index]._id);
    return libraries[index];
  },

  deleteLibrary(id) {
    const index = libraries.findIndex(l => l._id.toString() === (id || '').toString());
    if (index === -1) return null;
    const deleted = libraries.splice(index, 1)[0];
    seats = seats.filter(s => s.library.toString() !== id.toString());
    books = books.filter(b => b.library.toString() !== id.toString());
    return deleted;
  },

  // --- BOOKS ---
  getBooks({ library, category, search }) {
    let result = [...books];

    if (library) {
      result = result.filter(b => b.library.toString() === library.toString());
    }

    if (category && category.toLowerCase() !== 'all') {
      result = result.filter(b => (b.category || '').toLowerCase() === category.toLowerCase());
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

    // Populate library field
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

  createBook(data) {
    const newBook = {
      _id: generateObjectIdHex(),
      title: data.title,
      author: data.author,
      isbn: data.isbn || `978-${Math.floor(Math.random() * 899999999 + 100000000)}`,
      category: data.category || 'General',
      description: data.description || '',
      library: data.library,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      totalCopies: parseInt(data.totalCopies || 3, 10),
      availableCopies: parseInt(data.availableCopies || 3, 10),
      createdAt: new Date()
    };
    books.push(newBook);
    updateLibraryStats(newBook.library);
    return newBook;
  },

  updateBook(id, data) {
    const index = books.findIndex(b => b._id.toString() === (id || '').toString());
    if (index === -1) return null;
    books[index] = { ...books[index], ...data };
    updateLibraryStats(books[index].library);
    return books[index];
  },

  deleteBook(id) {
    const index = books.findIndex(b => b._id.toString() === (id || '').toString());
    if (index === -1) return null;
    const deleted = books.splice(index, 1)[0];
    updateLibraryStats(deleted.library);
    return deleted;
  },

  // --- SEATS ---
  getSeatsByLibrary(libraryId, { floor, status }) {
    let result = seats.filter(s => s.library.toString() === (libraryId || '').toString());

    if (floor) {
      result = result.filter(s => s.floor === parseInt(floor, 10));
    }

    if (status) {
      result = result.filter(s => (s.status || '').toLowerCase() === status.toLowerCase());
    }

    return result.sort((a, b) => a.floor - b.floor || a.seatNumber.localeCompare(b.seatNumber));
  },

  getAvailableSeatsByLibrary(libraryId) {
    return seats
      .filter(s => s.library.toString() === (libraryId || '').toString() && s.status === 'available')
      .sort((a, b) => a.floor - b.floor || a.seatNumber.localeCompare(b.seatNumber));
  },

  createSeat(data) {
    const newSeat = {
      _id: generateObjectIdHex(),
      library: data.library,
      seatNumber: data.seatNumber,
      floor: parseInt(data.floor || 1, 10),
      section: data.section || 'General Area',
      type: data.type || 'desk',
      status: data.status || 'available',
      createdAt: new Date()
    };
    seats.push(newSeat);
    updateLibraryStats(newSeat.library);
    return newSeat;
  },

  updateSeat(id, data) {
    const index = seats.findIndex(s => s._id.toString() === (id || '').toString());
    if (index === -1) return null;
    seats[index] = { ...seats[index], ...data };
    updateLibraryStats(seats[index].library);
    return seats[index];
  },

  deleteSeat(id) {
    const index = seats.findIndex(s => s._id.toString() === (id || '').toString());
    if (index === -1) return null;
    const deleted = seats.splice(index, 1)[0];
    updateLibraryStats(deleted.library);
    return deleted;
  },

  // --- BOOKINGS ---
  createBooking({ userId, libraryId, seatId, start, end }) {
    const lib = libraries.find(l => l._id.toString() === libraryId.toString());
    if (!lib) {
      const err = new Error('Library not found');
      err.statusCode = 404;
      throw err;
    }

    const seat = seats.find(s => s._id.toString() === seatId.toString());
    if (!seat) {
      const err = new Error('Seat not found');
      err.statusCode = 404;
      throw err;
    }

    if (seat.library.toString() !== libraryId.toString()) {
      const err = new Error(`Seat ${seat.seatNumber} does not belong to library ${lib.name}`);
      err.statusCode = 400;
      throw err;
    }

    if (seat.status !== 'available') {
      const err = new Error(`Seat ${seat.seatNumber} is currently ${seat.status}`);
      err.statusCode = 409;
      throw err;
    }

    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();

    const overlapping = bookings.find(b => {
      if (b.seat.toString() !== seatId.toString() || b.status !== 'active') return false;
      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      return bStart < endMs && bEnd > startMs;
    });

    if (overlapping) {
      const err = new Error(`Seat ${seat.seatNumber} is already reserved for the selected time window`);
      err.statusCode = 409;
      throw err;
    }

    const newBooking = {
      _id: generateObjectIdHex(),
      user: userId,
      library: libraryId,
      seat: seatId,
      startTime: new Date(start),
      endTime: new Date(end),
      status: 'active',
      createdAt: new Date()
    };

    bookings.push(newBooking);
    seat.status = 'reserved';
    updateLibraryStats(libraryId);

    return this.populateBooking(newBooking);
  },

  populateBooking(booking) {
    if (!booking) return null;
    const userObj = users.find(u => u._id.toString() === booking.user.toString());
    const libObj = libraries.find(l => l._id.toString() === booking.library.toString());
    const seatObj = seats.find(s => s._id.toString() === booking.seat.toString());

    return {
      ...booking,
      user: userObj ? { _id: userObj._id, name: userObj.name, email: userObj.email } : booking.user,
      library: libObj ? { _id: libObj._id, name: libObj.name, address: libObj.address, image: libObj.image } : booking.library,
      seat: seatObj ? { _id: seatObj._id, seatNumber: seatObj.seatNumber, floor: seatObj.floor, section: seatObj.section, type: seatObj.type, status: seatObj.status } : booking.seat
    };
  },

  getBookings({ userId, libraryId, status, isUserOnly }) {
    let result = [...bookings];

    if (isUserOnly && userId) {
      result = result.filter(b => b.user.toString() === userId.toString());
    } else if (userId) {
      result = result.filter(b => b.user.toString() === userId.toString());
    }

    if (libraryId) {
      result = result.filter(b => b.library.toString() === libraryId.toString());
    }

    if (status) {
      result = result.filter(b => b.status === status);
    }

    return result.map(b => this.populateBooking(b)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getBookingById(id) {
    const booking = bookings.find(b => b._id.toString() === (id || '').toString());
    return this.populateBooking(booking);
  },

  cancelBooking(id) {
    const booking = bookings.find(b => b._id.toString() === (id || '').toString());
    if (!booking) return null;

    if (booking.status === 'cancelled') {
      const err = new Error('Booking is already cancelled');
      err.statusCode = 400;
      throw err;
    }

    booking.status = 'cancelled';
    const seat = seats.find(s => s._id.toString() === booking.seat.toString());
    if (seat) {
      seat.status = 'available';
      updateLibraryStats(seat.library);
    }

    return this.populateBooking(booking);
  },

  // --- ADMIN STATS ---
  getAdminStats() {
    const totalLibraries = libraries.length;
    const activeLibraries = libraries.filter(l => (l.status || '').toLowerCase() === 'open').length;

    const totalBooks = books.reduce((sum, b) => sum + (b.totalCopies || 1), 0);
    const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);

    const totalSeats = seats.length;
    const availableSeats = seats.filter(s => s.status === 'available').length;

    const activeBookings = bookings.filter(b => b.status === 'active').length;
    const registeredUsers = users.length;

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
};

module.exports = demoData;
