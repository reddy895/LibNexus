const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.DATABASE_ENABLED !== 'true') {
    console.log(`\n==================================================`);
    console.log(`ℹ️ MongoDB disabled — running LibNexus in demo mode`);
    console.log(`==================================================\n`);
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/libnexus';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
  } catch (error) {
    console.error(`\n================================================================`);
    console.error(`❌ MongoDB connection failed while DATABASE_ENABLED=true`);
    console.error(`   Error details: ${error.message}`);
    console.error(`   Please start MongoDB on port 27017 or set DATABASE_ENABLED=false`);
    console.error(`================================================================\n`);
    process.exit(1);
  }
};

module.exports = connectDB;

