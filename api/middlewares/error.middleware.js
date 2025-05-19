const logger = require("../../utils/logger");

const notFound = (req, res, next) => {
  const error = new Error(`RESOURCE NOT FOUND`);
  error.statusCode = 404;
  error.responseCode = 4004;
  error.details = `RESOURCE NOT FOUND - ${req.originalUrl}`;
  next(error);
};

const errorMiddleware = (err, req, res, next) => {
  logger.error(
    JSON.stringify({
      message: err.message,
      stack: err.stack,
    })
  );

  res.status(err.statusCode || 400).json({
    responseCode: err.responseCode || 4000,
    message: err.message,
    details: err.details,
  });
};

module.exports = {
  notFound,
  errorMiddleware,
};
