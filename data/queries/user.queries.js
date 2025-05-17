// queries/userQueries.js

// Retrieve user by their ID
// @params: $1 -> userId
const getUserById = `
  SELECT id, username, email FROM users WHERE id = $1;
`;

// Fetch all users from the users table
const getAllUsers = `
  SELECT id, username, email FROM users;
`;

// Create a new user
// @params: $1 -> username, $2 -> email
// Returns the newly created user's id, username, and email.
const createUser = `
  INSERT INTO users (username, email)
  VALUES ($1, $2)
  RETURNING id, username, email;
`;

// Update a user's email by their ID
// @params: $1 -> newEmail, $2 -> userId
// Returns the updated user's id, username, and email.
const updateUserEmail = `
  UPDATE users
  SET email = $1
  WHERE id = $2
  RETURNING id, username, email;
`;

// Delete a user by their ID
// @params: $1 -> userId
// Returns the count of rows affected.
const deleteUser = `
  DELETE FROM users WHERE id = $1;
`;

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUserEmail,
  deleteUser,
};
