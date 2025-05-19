const express = require("express");
const SubmissionAPIRouter = express.Router();
const SubmissionController = require("../controllers/submission.controller");
const { HTTP_REQUEST_ATTRIBUTES } = require("../../utils/constants");
const validationMiddleware = require("../middlewares/validation.middleware");
const SubmissionValidator = require("../validators/submission.validator");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

SubmissionAPIRouter.post(
  "/",
  authenticate,
  authorize,
  validationMiddleware(
    SubmissionValidator.createSubmitAnswersRequest,
    HTTP_REQUEST_ATTRIBUTES.BODY
  ),
  SubmissionController.submitAnswers
);

module.exports = SubmissionAPIRouter;
