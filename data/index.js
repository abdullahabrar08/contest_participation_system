const { Pool } = require("pg");
const { db, api } = require("../config");
const logger = require("../utils/logger");

const pool = new Pool({
  user: db.user,
  host: db.host,
  database: db.database,
  password: db.password,
  port: db.port,
  ssl: api.environment === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  logger.error("[POSTGRES] Unexpected error on idle client", err);
  process.exit(-1);
});

const closeDatabaseConnection = async () => {
  try {
    await pool.end();
    logger.info("[POSTGRES] Database connection pool closed.");
  } catch (error) {
    logger.error("[POSTGRES] Error during database shutdown:", error);
  }
};

module.exports = { pool, closeDatabaseConnection };
