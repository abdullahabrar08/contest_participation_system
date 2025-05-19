const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const rateLimiter = require("./middlewares/rate.limit");
const { setupSwaggerDocs } = require("../docs/swagger");
const { api } = require("../config");
const logger = require("../utils/logger");
const { notFound, errorMiddleware } = require("./middlewares/error.middleware");
require("../jobs/index");

const configureAPI = (app) => {
  app.use(express.json());

  app.use(
    morgan(
      `[${api.serviceName.toUpperCase()}] :method :url :status [:date[clf]] :response-time ms`,
      { stream: logger.stream }
    )
  );
  app.use(cors());
  app.use(rateLimiter);
  if (api.environment === "production") app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.disable("x-powered-by");

  /**************** Swagger Docs **************/
  setupSwaggerDocs(app);

  app.get("/api/v1/contests/healthz", (req, res) => {
    res.status(200).json({
      status: "healthy",
      serviceName: api.serviceName,
      version: api.version,
      environment: api.environment,
    });
  });

  app.use("/api/v1/", routes);

  app.use(notFound);
  app.use(errorMiddleware);

  console.log("[CONTEST_SERVICE] REST API server configured successfully");
};

module.exports = configureAPI;
