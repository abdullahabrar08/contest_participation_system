const joi = require("joi");

/**
 * validationMiddleware
 * @param {joi.Schema} schema - A joi schema to validate against.
 * @param {string} [type="body"] - The request property to validate (body, query, params, headers).
 * @returns {Function} - Express middleware for request validation.
 */

const validationMiddleware = (schema, type = "body") => {
  const validTypes = ["body", "query", "params", "headers"];
  if (!validTypes.includes(type)) {
    throw new Error(
      `Invalid validation type: ${type}. Must be one of: ${validTypes.join(
        ", "
      )}`
    );
  }

  return (req, res, next) => {
    const { error, value } = schema.validate(req[type], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: false,
    });

    if (error) {
      // Convert Joi error to our normalized format
      error.statusCode = 400;
      error.responseCode = 4004;
      error.message = "VALIDATION_ERROR";
      error.details = error.details.map((d) => ({
        field: d.context.key || d.path.join("."),
        message: d.message.replace(/['"]/g, ""),
      }));
      next(error);
      return;
    }

    req[type] = value;
    next();
  };
};

module.exports = validationMiddleware;
