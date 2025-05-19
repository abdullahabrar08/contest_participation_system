const userService = require("../../services/user.service");

const register = async (req, res, next) => {
  try {
    const user = await userService.register(req);

    return res.status(201).send({
      responseCode: 2001,
      message: "User registered Successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await userService.login(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const contests = await userService.getHistory(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "History fetched successfully",
      data: contests,
    });
  } catch (error) {
    next(error);
  }
};

const getPrizeHistory = async (req, res, next) => {
  try {
    const prizes = await userService.getPrizeHistory(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Prize History fetched successfully",
      data: prizes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getHistory,
  getPrizeHistory,
};
