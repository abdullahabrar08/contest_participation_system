const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const UserAPIRouter = require("./user.routes");

router.use("/users", UserAPIRouter);

module.exports = router;
