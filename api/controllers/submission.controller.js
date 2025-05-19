const submissionService = require("../../services/submission.service");

const submitAnswers = async (req, res, next) => {
  try {
    const submission = await submissionService.submitAnswers(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Submission Successfull",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAnswers,
};
