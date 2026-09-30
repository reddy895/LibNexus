const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/libnexus';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
  } catch (error) {
    console.error(`\n================================================================`);
    console.error(`❌ DATABASE ERROR: MongoDB is not running!`);
    console.error(`   Please start MongoDB on port 27017 or run:`);
    console.error(`   $ docker compose up -d`);
    console.error(`   and restart the backend.`);
    console.error(`================================================================\n`);
    process.exit(1);
  }
};

module.exports = connectDB;
