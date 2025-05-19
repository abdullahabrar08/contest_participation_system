const express = require("express");
const QuestionAPIRouter = express.Router();
const QuestionController = require("../controllers/question.controller");
const { HTTP_REQUEST_ATTRIBUTES } = require("../../utils/constants");
const validationMiddleware = require("../middlewares/validation.middleware");
const QuestionValidator = require("../validators/question.validator");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

QuestionAPIRouter.post(
  "/",
  authenticate,
  authorize,
  validationMiddleware(
    QuestionValidator.createQuestionRequest,
    HTTP_REQUEST_ATTRIBUTES.BODY
  ),
  QuestionController.createQuestion
);

QuestionAPIRouter.get(
  "/",
  authenticate,
  authorize,
  validationMiddleware(
    QuestionValidator.getContestQuestionsRequest,
    HTTP_REQUEST_ATTRIBUTES.QUERY
  ),
  QuestionController.getContestQuestions
);

module.exports = QuestionAPIRouter;
