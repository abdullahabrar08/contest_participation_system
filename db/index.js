const { default: migrate } = require("node-pg-migrate");
const { pool } = require("../data");
const logger = require("../utils/logger");

(async () => {
  const client = await pool.connect();

  try {
    await migrate({
      dbClient: client,
      migrationsTable: "pgmigrations",
      dir: "db/migrations",
      direction: "up",
      verbose: true,
      count: Infinity,
      schema: "public",
    });

    logger.info("✅ Migrations completed successfully");
  } catch (err) {
    logger.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
  }
})();
