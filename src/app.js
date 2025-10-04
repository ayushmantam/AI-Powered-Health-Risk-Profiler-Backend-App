const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const errorMiddleware = require('./middlewares/error.middleware');

// Try to load logger, fallback to console if not available
let logger;
try {
  logger = require('./utils/logger');
} catch (err) {
  logger = console;
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  if (logger && logger.info) {
    logger.info(`${req.method} ${req.path}`);
  } else {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Health Risk Profiler API'
  });
});

// API Routes
app.use('/api/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;