const { pool } = require("../index");
const bcrypt = require("bcrypt");

const findUserByEmail = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

const createUser = async ({ username, email, password, roleId }) => {
  try {
    const query = `INSERT INTO users (username, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [username, email, await bcrypt.hash(password, 10), roleId];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const updateLastLogin = async (userId) => {
  try {
    const query = `UPDATE users SET last_login = NOW() WHERE user_id = $1`;
    const values = [userId];

    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  updateLastLogin,
};
