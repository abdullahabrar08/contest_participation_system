const express = require("express");
const ContestAPIRouter = express.Router();
const ContestController = require("../controllers/contest.controller");
const { HTTP_REQUEST_ATTRIBUTES } = require("../../utils/constants");
const validationMiddleware = require("../middlewares/validation.middleware");
const ContestValidator = require("../validators/contest.validator");
const {
  authenticate,
  authorize,
  guestAccessHandler,
} = require("../middlewares/auth.middleware");

ContestAPIRouter.post(
  "/",
  authenticate,
  authorize,
  validationMiddleware(
    ContestValidator.createContestRequest,
    HTTP_REQUEST_ATTRIBUTES.BODY
  ),
  ContestController.createContest
);

ContestAPIRouter.put(
  "/",
  authenticate,
  authorize,
  validationMiddleware(
    ContestValidator.updateContestRequest,
    HTTP_REQUEST_ATTRIBUTES.BODY
  ),
  ContestController.updateContest
);

ContestAPIRouter.get(
  "/",
  validationMiddleware(
    ContestValidator.getContestRequest,
    HTTP_REQUEST_ATTRIBUTES.QUERY
  ),
  guestAccessHandler,
  ContestController.getContests
);

ContestAPIRouter.put(
  "/join",
  authenticate,
  authorize,
  validationMiddleware(
    ContestValidator.joinContestRequest,
    HTTP_REQUEST_ATTRIBUTES.QUERY
  ),
  ContestController.joinContest
);

ContestAPIRouter.get(
  "/pending-submissions",
  authenticate,
  authorize,
  validationMiddleware(
    ContestValidator.getPendingSubmissionsRequest,
    HTTP_REQUEST_ATTRIBUTES.QUERY
  ),
  ContestController.getPendingContests
);

module.exports = ContestAPIRouter;
