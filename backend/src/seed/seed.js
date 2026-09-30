const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Library = require('../models/Library');
const Book = require('../models/Book');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/libnexus';
    console.log(`[Seed] Connecting to MongoDB at ${uri}...`);
    
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected successfully.');

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Library.deleteMany({});
    await Book.deleteMany({});
    await Seat.deleteMany({});
    await Booking.deleteMany({});

    console.log('[Seed] Creating Demo Users (Admin, User, Librarian)...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@libnexus.com',
      password: 'Admin@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });

    const standardUser = await User.create({
      name: 'Alex Morgan',
      email: 'user@libnexus.com',
      password: 'User@123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
    });

    const librarianUser = await User.create({
      name: 'Priya Sharma (Librarian)',
      email: 'librarian@libnexus.com',
      password: 'Librarian@123',
      role: 'librarian',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    });

    console.log('[Seed] Creating 6 Bengaluru Libraries...');
    const librariesData = [
      {
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
        facilities: ['High-Speed Wi-Fi', 'AC Reading Hall', 'Silent Zone', 'Power Outlets', 'Digital Lab', 'Cafeteria']
      },
      {
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
        facilities: ['Wi-Fi', 'AC', 'Coffee Bar', 'Group Discussion Pods', 'Power Outlets']
      },
      {
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
        facilities: ['24/7 Fiber Wi-Fi', 'Silent Research Bays', 'Journal Database', 'AC', 'Ergonomic Seating']
      },
      {
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
        facilities: ['Wi-Fi', 'Quiet Cubicles', 'Newspaper Archive', 'Parking', 'RO Water']
      },
      {
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
        facilities: ['High-Speed Wi-Fi', 'Computer Lab', 'AC', 'E-Book Kiosks', 'Power Desks']
      },
      {
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
        facilities: ['Historical Archives', 'Quiet Zone', 'Garden Courtyard', 'Wi-Fi']
      }
    ];

    const libraries = await Library.create(librariesData);
    console.log(`[Seed] Created ${libraries.length} Libraries.`);

    console.log('[Seed] Creating 120 Books across libraries...');
    const rawBooks = [
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
      { title: 'The Elements of Statistical Learning', author: 'Trevor Hastie, Robert Tibshirani', isbn: '978-0387848570', category: 'Data Science', coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80', description: 'Data mining, inference, and prediction techniques.' },
      { title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose', isbn: '978-0133594140', category: 'Computer Science', coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', description: 'Layered networking protocols and internet mechanics.' },
      { title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1118063330', category: 'Computer Science', coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', description: 'Processes, memory management, and file systems.' },
      { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0073523323', category: 'Computer Science', coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', description: 'Relational algebra, SQL, transactions, and indexing.' },
      { title: 'Principles of Neural Science', author: 'Eric Kandel', isbn: '978-0071390118', category: 'Science', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80', description: 'Foundational textbook on neuroscience and cognition.' },
      { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', isbn: '978-0262510875', category: 'Programming', coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', description: 'SICP - Abstraction and computational process modeling.' },
      { title: 'Pattern Recognition and Machine Learning', author: 'Christopher Bishop', isbn: '978-0387310732', category: 'Data Science', coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80', description: 'Bayesian statistics and machine learning algorithms.' }
    ];

    let bookDocs = [];
    libraries.forEach((lib, index) => {
      rawBooks.forEach(b => {
        bookDocs.push({
          title: b.title,
          author: b.author,
          isbn: `${b.isbn}-${index + 1}`,
          category: b.category,
          description: b.description,
          library: lib._id,
          coverImage: b.coverImage,
          totalCopies: Math.floor(Math.random() * 5) + 3,
          availableCopies: Math.floor(Math.random() * 3) + 1
        });
      });
    });

    const books = await Book.create(bookDocs);
    console.log(`[Seed] Created ${books.length} Books across libraries.`);

    console.log('[Seed] Creating 216 Seats across libraries...');
    let seatDocs = [];

    libraries.forEach(lib => {
      const sections = ['Window Bay Area', 'Central Silent Pods', 'Research Desk Lane'];
      const types = ['desk', 'cubicle', 'quiet', 'group'];
      const statuses = ['available', 'available', 'available', 'occupied', 'reserved'];

      for (let floor = 1; floor <= 2; floor++) {
        ['A', 'B', 'C'].forEach(prefix => {
          for (let i = 1; i <= 6; i++) {
            const num = `${prefix}${i < 10 ? '0' + i : i}`;
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const section = sections[Math.floor(Math.random() * sections.length)];
            const type = types[Math.floor(Math.random() * types.length)];

            seatDocs.push({
              library: lib._id,
              seatNumber: `${num} (F${floor})`,
              floor,
              section,
              type,
              status
            });
          }
        });
      }
    });

    const seats = await Seat.create(seatDocs);
    console.log(`[Seed] Created ${seats.length} Seats.`);

    console.log('[Seed] Updating Library aggregate seat & book counts...');
    for (const lib of libraries) {
      const libSeats = seats.filter(s => s.library.toString() === lib._id.toString());
      const availableCount = libSeats.filter(s => s.status === 'available').length;
      lib.totalSeats = libSeats.length;
      lib.availableSeats = availableCount;

      const libBooks = books.filter(b => b.library.toString() === lib._id.toString());
      lib.totalBooks = libBooks.reduce((sum, b) => sum + b.totalCopies, 0);
      lib.availableBooks = libBooks.reduce((sum, b) => sum + b.availableCopies, 0);

      await lib.save();
    }

    console.log('[Seed] Creating demo active Bookings...');
    const demoSeat = seats.find(s => s.status === 'reserved' || s.status === 'available');
    if (demoSeat) {
      await Booking.create({
        user: standardUser._id,
        library: demoSeat.library,
        seat: demoSeat._id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 3600 * 1000),
        status: 'active'
      });
      demoSeat.status = 'reserved';
      await demoSeat.save();
    }

    console.log('\n================================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------------------');
    console.log('DEMO ACCOUNTS CREATED:');
    console.log(' 👑 Admin:     admin@libnexus.com     | Password: Admin@123');
    console.log(' 👤 User:      user@libnexus.com      | Password: User@123');
    console.log(' 📚 Librarian: librarian@libnexus.com | Password: Librarian@123');
    console.log('================================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

seedData();
