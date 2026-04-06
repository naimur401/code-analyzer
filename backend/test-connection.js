import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test database
    const db = mongoose.connection;
    console.log('Database name:', db.name);
    console.log('Database host:', db.host);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
