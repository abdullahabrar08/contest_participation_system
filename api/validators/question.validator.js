const Joi = require("joi");

const createQuestionRequest = Joi.object({
  contestId: Joi.number().integer().required(),
  questionText: Joi.string().required(),
  questionTypeId: Joi.number().integer().valid(1, 2, 3).required(),
  points: Joi.number().integer().min(1).max(5).required(),
  answers: Joi.array()
    .items(
      Joi.object({
        answerText: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      })
    )
    .min(1)
    .required(),
}).required();

const getContestQuestionsRequest = Joi.object({
  contestId: Joi.number().integer().required(),
  page: Joi.number().integer().min(1).required(),
  size: Joi.number().integer().min(1).max(10).required(),
}).required();

module.exports = {
  createQuestionRequest,
  getContestQuestionsRequest,
};
