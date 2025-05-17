// const jwt = require("jsonwebtoken");
// const { pool } = require("../../data/index");
// const { ROLE_NAMES } = require("../../utils/constants");
// const { newEnforcer } = require("casbin");
// const Queries = require("../../data/repositories/user.repo");
// const path = require("path");
// const modelPath = path.resolve(__dirname, "../../utils/rbac/model.conf");
// const policyPath = path.resolve(__dirname, "../../utils/rbac/policy.csv");

// exports.authenticate = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     const err = new AppError(
//       "Not Authenticated",
//       "NOT_AUTHENTICATED",
//       401,
//       "No token provided."
//     );
//     return next(err);
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     let { rows } = await pool.query(Queries.getUserDetails(decoded.id));
//     if (rows.length === 0) {
//       throw new Error("User not found");
//     }

//     req.user = { ...rows[0] };

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// exports.authorize = async (req, res, next) => {
//   try {
//     const enforcer = await newEnforcer(modelPath, policyPath);

//     const userRole = ROLE_NAMES[req.user.role_id] || null;
//     const path = req.originalUrl.split("?")[0];
//     const method = req.method;
//     console.log("----------------------");
//     console.log("Authorize :", userRole, path, method);
//     console.log("----------------------");
//     const allowed = await enforcer.enforce(userRole, path, method);

//     if (!allowed) {
//       const err = new AppError(
//         "Access Denied",
//         "NOT_AUTHORIZED",
//         401,
//         "Access Denied"
//       );
//       throw err;
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };
