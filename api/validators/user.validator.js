const Joi = require("joi");

const createUserRequest = Joi.object({
  username: Joi.string().max(100).required().messages({
    "string.base": "Username must be a string.",
    "string.empty": "Username is required.",
    "string.max": "Username must be at most 100 characters long.",
  }),

  email: Joi.string().email().max(255).required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "string.max": "Email must be at most 255 characters long.",
  }),

  password: Joi.string().min(6).max(128).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password must be at most 128 characters long.",
  }),

  roleId: Joi.number().integer().valid(1, 2, 3).min(1).required().messages({
    "number.base": "Role ID must be a number.",
    "number.integer": "Role ID must be an integer.",
    "number.min": "Role ID must be a positive integer.",
  }),
}).required();

const createLoginRequest = Joi.object({
  email: Joi.string().email().max(255).required().messages({
    "string.base": "Email must be a string.",
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "string.max": "Email must be at most 255 characters long.",
  }),

  password: Joi.string().min(6).max(128).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password must be at most 128 characters long.",
  }),
}).required();

module.exports = {
  createUserRequest,
  createLoginRequest,
};
