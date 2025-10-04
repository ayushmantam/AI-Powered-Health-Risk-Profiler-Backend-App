require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db.config');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB (optional)
if (process.env.MONGODB_URI) {
  connectDB();
}

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📡 API available at http://localhost:${PORT}/api/health`);
  logger.info(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = server;