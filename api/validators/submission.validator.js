const joi = require("joi");

const createSubmitAnswersRequest = joi
  .object({
    contestId: joi.number().integer().required(),
    questions: joi
      .array()
      .items(
        joi
          .object({
            questionId: joi.number().integer().required(),
            answers: joi
              .array()
              .items(
                joi
                  .object({
                    answerId: joi.number().integer().required(),
                  })
                  .required()
              )
              .required(),
          })
          .required()
      )
      .required(),
  })
  .required();

module.exports = {
  createSubmitAnswersRequest,
};
