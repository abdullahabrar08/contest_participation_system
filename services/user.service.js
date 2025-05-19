const userQueries = require("../data/queries/user.queries");
const contestQueries = require("../data/queries/contest.queries");
const userDTO = require("../data/dto/user.dto");
const { signToken } = require("../utils/helpers");
const bcrypt = require("bcrypt");

const register = async (req) => {
  try {
    const data = req.body;

    // check user exist with email
    await findUserByEmail(data);

    // create user
    const user = await userQueries.createUser(data);
    if (!user) {
      const err = new Error("User not created");
      err.statusCode = 500;
      err.responseCode = 5000;
      err.details = "User not created";
      throw err;
    }

    return userDTO.createUserDTO(user, signToken({ id: user.user_id }));
  } catch (error) {
    throw error;
  }
};

const findUserByEmail = async ({ email }) => {
  try {
    const user = await userQueries.findUserByEmail(email);
    if (user.length > 0) {
      const err = new Error("User already exists");
      err.statusCode = 409;
      err.responseCode = 4009;
      err.details = `User already exists with same email : ${email}`;
      throw err;
    }
  } catch (error) {
    throw error;
  }
};

const login = async (req) => {
  try {
    const data = req.body;

    // check user exist with email
    const user = await userQueries.findUserByEmail(data.email);
    if (user.length === 0) {
      const err = new Error("Invalid Email");
      err.statusCode = 401;
      err.responseCode = 4001;
      err.details = "Invalid Email";
      throw err;
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(data.password, user[0].password_hash);
    if (!isMatch) {
      const err = new Error("Invalid Password");
      err.statusCode = 401;
      err.responseCode = 4001;
      err.details = "Invalid Password";
      throw err;
    }

    // update last login time
    await userQueries.updateLastLogin(user[0].user_id);

    return userDTO.createUserDTO(user[0], signToken({ id: user[0].user_id }));
  } catch (error) {
    throw error;
  }
};

const getHistory = async (req) => {
  try {
    const data = req.query;
    const { user_id: userId } = req.user;

    // get history
    const contests = await contestQueries.getHistory(userId, data);

    return userDTO.getHistoryDTO(contests);
  } catch (error) {
    throw error;
  }
};

const getPrizeHistory = async (req) => {
  try {
    const data = req.query;
    const { user_id: userId } = req.user;

    // get prize history
    const prizes = await contestQueries.getPrizeHistory(userId, data);

    return userDTO.prizesDTO(prizes);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  getHistory,
  getPrizeHistory,
};
