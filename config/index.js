const joi = require("joi");
require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV || "development"}`,
});

const envSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid("development", "production", "test", "staging")
      .default("development"),
    PORT: joi.number().default(3000),
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_PORT: joi.number().default(5432),
    DATABASE: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  console.error(`Environment variable validation error: ${error.message}`);
  process.exit(1);
}

const config = {
  api: {
    version: process.env.npm_package_version,
    serviceName: process.env.npm_package_name,
    appName: process.env.APP_NAME || "CONTEST_SERVICE",
    port: envVars.PORT || 5001,
    environment: envVars.NODE_ENV,
    nodeLevel: process.env.NODE_LOG_LEVEL || "info",
  },

  db: {
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    port: envVars.DB_PORT,
    database: envVars.DATABASE,
  },

  secrets: {
    jwtSecret: process.env.JWT_SECRET || "defaultSecret",
    jwtExpiry: process.env.JWT_EXPIRE,
  },
};

module.exports = config;
