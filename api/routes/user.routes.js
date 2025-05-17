const express = require("express");
const UserAPIRouter = express.Router();
const UserController = require("../controllers/user.controller");
const { HTTP_REQUEST_ATTRIBUTES } = require("../../utils/constants");
const validationMiddleware = require("../middlewares/validation.middleware");
const UserValidator = require("../validators/user.validator");

// UserAPIRouter.post(
//   "/register",
//   validationMiddleware(
//     UserValidator.createUserRequest,
//     HTTP_REQUEST_ATTRIBUTES.BODY
//   ),
//   UserController.signUp
// );

// UserAPIRouter.post(
//   "/login",
//   validationMiddleware(
//     UserValidator.createLoginRequest,
//     HTTP_REQUEST_ATTRIBUTES.BODY
//   ),
//   UserController.login
// );

module.exports = UserAPIRouter;
