const questionService = require("../../services/question.service");

const createQuestion = async (req, res, next) => {
  try {
    const question = await questionService.createQuestion(req);

    return res.status(201).send({
      responseCode: 2001,
      message: "Question created Successfully",
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

const getContestQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getContestQuestions(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Questions fetched Successfully",
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestion,
  getContestQuestions,
};
