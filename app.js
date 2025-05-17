const express = require("express");
const configureAPI = require("./api");

function createApp() {
  const app = express();
  configureAPI(app);
  return app;
}

module.exports = createApp;
