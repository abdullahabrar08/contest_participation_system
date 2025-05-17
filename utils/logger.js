const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors, json, colorize } = format;
const { api } = require("../config");

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Base logger configuration
const logger = createLogger({
  level: api.nodeLevel,
  defaultMeta: { service: api.serviceName },
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    api.environment === "production" ? json() : combine(colorize(), devFormat)
  ),
  transports: [new transports.Console()],
  exitOnError: false,
});

// Production-specific transports
if (api.environment === "production") {
  logger.add(
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  logger.add(
    new transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

// Handle uncaught exceptions
logger.exceptions.handle(
  new transports.File({ filename: "logs/exceptions.log" })
);

// Handle unhandled promise rejections
logger.rejections.handle(
  new transports.File({ filename: "logs/rejections.log" })
);

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
