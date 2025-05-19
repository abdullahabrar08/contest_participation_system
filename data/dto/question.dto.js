const questionDTO = (response) => {
  return {
    questionId: response.question_id,
    contestId: response.contest_id,
    questionText: response.question_text,
    questionTypeId: response.question_type_id,
    points: response.points,
    createdAt: response.created_at,
  };
};

const getContestQuestionsDTO = (responseArray) => {
  return responseArray.map((question) => ({
    questionId: question.question_id,
    questionText: question.question_text,
    questionTypeId: question.question_type_id,
    points: question.points,
    answers: question.answers.map((answer) => ({
      answerId: answer.answer_id,
      answerText: answer.answer_text,
      isCorrect: answer.is_correct,
    })),
  }));
};

module.exports = {
  questionDTO,
  getContestQuestionsDTO,
};
