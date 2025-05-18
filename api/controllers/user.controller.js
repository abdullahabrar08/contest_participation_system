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

module.exports = {
  register,
  login,
};
