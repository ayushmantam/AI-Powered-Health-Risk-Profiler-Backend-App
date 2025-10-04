const errorMiddleware = (err, req, res, next) => {
  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;

