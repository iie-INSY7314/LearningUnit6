const logger = require('../logging/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled API error', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    method: req.method,
    path: req.originalUrl
  });

  res.status(500).json({ error: 'Something went wrong' });
};

module.exports = errorHandler;
