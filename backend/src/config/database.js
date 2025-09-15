import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbNameFromEnv = process.env.MONGODB_DB;

    const conn = await mongoose.connect(mongoUri, {
      // Allow overriding the database name when the URI doesn't include it
      dbName: dbNameFromEnv || undefined
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB;

