const createApp = require("./app");
const { closeDatabaseConnection, pool } = require("./data");
const logger = require("./utils/logger");
const { api } = require("./config");

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

const gracefulShutdown = async (server) => {
  logger.info("[CONTEST_SERVICE] Initiating graceful shutdown...");
  await closeDatabaseConnection();
  server.close(() => {
    logger.info("[CONTEST_SERVICE] HTTP server closed.");
    process.exit(0);
  });
};

(async () => {
  try {
    logger.info("[CONTEST_SERVICE] Starting up...");

    const app = createApp();
    const server = app.listen(api.port, async () => {
      await pool.query("SELECT 1");
      logger.info("[POSTGRES] Database connection verified.");
      logger.info(
        `[CONTEST_SERVICE] 🚀 running on port ${api.port} in ${api.environment} mode`
      );
    });

    process.on("SIGINT", () => gracefulShutdown(server));
    process.on("SIGTERM", () => gracefulShutdown(server));
  } catch (error) {
    logger.error("[CONTEST_SERVICE] Failed to start : ", error);
    process.exit(1);
  }
})();
