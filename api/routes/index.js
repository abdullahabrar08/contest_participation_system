const express = require("express");
const router = express.Router();
const UserAPIRouter = require("./user.routes");
const ContestAPIRouter = require("./contest.routes");
const QuestionAPIRouter = require("./question.routes");
const SubmissionAPIRouter = require("./submission.routes");

router.use("/users", UserAPIRouter);
router.use("/contests", ContestAPIRouter);
router.use("/questions", QuestionAPIRouter);
router.use("/submissions", SubmissionAPIRouter);

module.exports = router;
