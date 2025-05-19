const jwt = require("jsonwebtoken");
const { pool } = require("../../data/index");
const { ROLE_NAMES } = require("../../utils/constants");
const { newEnforcer } = require("casbin");
const Queries = require("../../data/queries/user.queries");
const path = require("path");
const modelPath = path.resolve(__dirname, "../../utils/rbac/model.conf");
const policyPath = path.resolve(__dirname, "../../utils/rbac/policy.csv");

exports.authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const err = new Error("Not Authenticated");
    err.statusCode = 401;
    err.responseCode = 4001;
    err.details = "No token provided.";
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let rows = await Queries.findUserById(decoded.id);
    if (rows.length === 0) {
      const err = new Error("User not found");
      err.statusCode = 401;
      err.responseCode = 4001;
      err.details = "User not found";
      return next(err);
    }

    req.user = { ...rows[0] };

    next();
  } catch (error) {
    next(error);
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const enforcer = await newEnforcer(modelPath, policyPath);

    const userRole = ROLE_NAMES[req.user.role_id] || null;
    const path = req.originalUrl.split("?")[0];
    const method = req.method;
    console.log("----------------------");
    console.log("Authorize :", userRole, path, method);
    console.log("----------------------");
    const allowed = await enforcer.enforce(userRole, path, method);

    if (!allowed) {
      const err = new Error("NOT_AUTHORIZED");
      err.statusCode = 401;
      err.responseCode = 4001;
      err.details = "Access Denied to Resource";
      throw err;
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.guestAccessHandler = (req, res, next) => {
  const isGuest = req.query.isGuest === "true";

  if (isGuest) {
    return next(); // Skip authentication and authorization
  }

  // Dynamically run authenticate and authorize
  const middlewares = [this.authenticate, this.authorize];

  let index = 0;

  const runNext = (err) => {
    if (err) return next(err);
    const middleware = middlewares[index++];
    if (middleware) {
      middleware(req, res, runNext);
    } else {
      next();
    }
  };

  runNext();
};
