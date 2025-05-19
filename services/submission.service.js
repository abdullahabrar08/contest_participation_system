const contestQueries = require("../data/queries/contest.queries");
const submissionQueries = require("../data/queries/submission.queries");
const { USER_ROLES } = require("../utils/constants");

const submitAnswers = async (req) => {
  try {
    const data = req.body;
    const { role_id: roleId, user_id: userId } = req.user;

    // check if contest exists
    const contest = await contestQueries.findContestById(data.contestId);
    if (contest.length === 0) {
      throw new Error("Contest not found");
    }

    // normal user can only see public contests
    if (roleId === USER_ROLES.NORMAL && contest[0].is_vip_only === true) {
      throw new Error("You are not allowed to Participate in a VIP Contest");
    }

    // check if user is allowed to participate in the contest
    const isContestSubmitted = await contestQueries.isContestSubmitted(
      data.contestId,
      userId
    );
    if (isContestSubmitted.length > 0) {
      throw new Error("You have already submitted answers for this contest");
    }

    // check if contest is active either not started or already ended
    const isContestActive = await contestQueries.isContestActive(
      data.contestId
    );
    if (isContestActive.length === 0) {
      throw new Error("Contest is not active");
    }

    // Validate answers and calculate score
    const score = await calculateScore(data);

    // Insert submission into the database
    const submission = await submissionQueries.addSubmission(
      userId,
      data,
      score
    );
    if (!submission) {
      throw new Error("Failed to submit answers");
    }

    return { score: score };
  } catch (error) {
    throw error;
  }
};

const calculateScore = async (submission) => {
  const { contestId, questions: submittedQuestions } = submission;

  try {
    const submittedQuestionIds = submittedQuestions.map((q) => q.questionId);

    // 1. Get all question IDs for the contest
    const contestQuestionsRes = await submissionQueries.getContestQuestions(
      contestId
    );

    const contestQuestionIds = contestQuestionsRes.map(
      (row) => row.question_id
    );

    // Check 1: All submitted questionIds must belong to this contest
    const isAllValid = submittedQuestionIds.every((id) =>
      contestQuestionIds.includes(id)
    );
    if (!isAllValid) {
      throw new Error(
        "Some submitted questions do not belong to the specified contest."
      );
    }

    // Check 2: All contest questions must be answered
    if (submittedQuestionIds.length !== contestQuestionIds.length) {
      throw new Error(
        "All contest questions must be answered. Partial submissions are not allowed."
      );
    }

    // ---- SCORING START ----
    let totalScore = 0;

    for (const submittedQuestion of submittedQuestions) {
      const { questionId, answers } = submittedQuestion;
      const answerIds = answers.map((ans) => ans.answerId);

      // Fetch question info
      const questionRes = await submissionQueries.getQuestionDetails(
        questionId
      );
      if (questionRes.length === 0) continue;

      const { points, type_name } = questionRes[0];

      // Fetch correct answers
      const correctAnswersRes = await submissionQueries.getCorrectAnswers(
        questionId
      );
      const correctAnswerIds = correctAnswersRes.map((row) => row.answer_id);

      // Evaluate
      const submittedSet = new Set(answerIds);
      const correctSet = new Set(correctAnswerIds);

      const isAllCorrectSelected = correctAnswerIds.every((id) =>
        submittedSet.has(id)
      );
      const hasOnlyCorrect = [...submittedSet].every((id) =>
        correctSet.has(id)
      );

      let isCorrect = false;
      if (type_name === "single_select" || type_name === "true_false") {
        isCorrect =
          correctSet.size === 1 &&
          submittedSet.size === 1 &&
          [...correctSet][0] === [...submittedSet][0];
      } else if (type_name === "multi_select") {
        isCorrect = isAllCorrectSelected && hasOnlyCorrect;
      }

      if (isCorrect) {
        totalScore += points;
      }
    }

    return totalScore;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  submitAnswers,
};
