const jwt = require("jsonwebtoken");
const Config = require("../config/index");

function signToken(payload) {
  try {
    const token = jwt.sign(payload, Config.secrets.jwtSecret, {
      expiresIn: Config.secrets.jwtExpiry,
    });
    return token;
  } catch (err) {
    throw new Error("Failed to sign token: " + err.message);
  }
}

module.exports = {
  signToken,
};
