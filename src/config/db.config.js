const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.warn('MongoDB URI not provided. Running without database.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;