const questionQueries = require("../data/queries/question.queries");
const contestQueries = require("../data/queries/contest.queries");
const { QUESTION_TYPES, USER_ROLES } = require("../utils/constants");
const questionDTO = require("../data/dto/question.dto");

const createQuestion = async (req) => {
  try {
    const data = req.body;

    // validate question types
    validateQuestionTypeLogic(data.questionTypeId, data.answers);

    // check if contest exists
    const contest = await contestQueries.findContestById(data.contestId);
    if (contest.length === 0) {
      throw new Error("Contest not found");
    }

    // check if contest is started then don't allow to add questions
    const isContestStarted = await contestQueries.isContestStarted(
      data.contestId
    );
    if (isContestStarted.length > 0) {
      throw new Error("Contest has already started, you cannot add questions");
    }

    // check if question already exists
    await findQuestionByName(data.questionText);

    // create question
    const question = await questionQueries.createQuestion(data);
    if (!question) {
      throw new Error("Failed to create question");
    }

    return questionDTO.questionDTO(question);
  } catch (error) {
    throw error;
  }
};

function validateQuestionTypeLogic(questionTypeId, answers) {
  const correctAnswers = answers.filter((ans) => ans.isCorrect);

  switch (questionTypeId) {
    case QUESTION_TYPES.SINGLE_SELECT:
      if (correctAnswers.length !== 1) {
        throw new Error(
          "Single select questions must have exactly one correct answer."
        );
      }
      break;

    case QUESTION_TYPES.MULTI_SELECT:
      if (correctAnswers.length < 2) {
        throw new Error(
          "Multi select questions must have at least two correct answer."
        );
      }
      break;

    case QUESTION_TYPES.TRUE_FALSE:
      if (answers.length !== 2) {
        throw new Error("True/False questions must have exactly two answers.");
      }
      if (correctAnswers.length !== 1) {
        throw new Error(
          "True/False questions must have exactly one correct answer."
        );
      }
      break;

    default:
      throw new Error("Unsupported question type.");
  }
}

const findQuestionByName = async (questionText) => {
  try {
    const question = await questionQueries.findQuestionByName(questionText);
    if (question) {
      throw new Error("Question already exists");
    }
  } catch (error) {
    throw error;
  }
};

const getContestQuestions = async (req) => {
  try {
    const { contestId } = req.query;
    const { role_id: roleId } = req.user;

    // check if contest exists
    const contest = await contestQueries.findContestById(contestId);
    if (contest.length === 0) {
      throw new Error("Contest not found");
    }

    // normal user can only see public contests
    if (roleId === USER_ROLES.NORMAL && contest[0].is_vip_only === true) {
      throw new Error("You are not allowed to Participate in a VIP Contest");
    }

    // check if contest is active
    const isContestActive = await contestQueries.isContestActive(contestId);
    if (isContestActive.length === 0) {
      throw new Error("Contest is not active");
    }

    // check if user is allowed to participate in the contest
    const isContestParticipant = await contestQueries.isContestParticipant(
      contestId,
      req.user.user_id
    );
    if (isContestParticipant.length > 0) {
      throw new Error("You have already participated in this contest");
    }

    // get questions
    const questions = await questionQueries.getContestQuestions(req.query);
    if (questions.length === 0) {
      throw new Error("No questions found for this contest");
    }

    return questionDTO.getContestQuestionsDTO(questions);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createQuestion,
  getContestQuestions,
};
