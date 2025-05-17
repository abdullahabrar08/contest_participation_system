// db.js
const { Pool } = require("pg");

// Configure the connection pool
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "mydatabase",
  user: "myuser",
  password: "mypassword",
});

module.exports = pool;
