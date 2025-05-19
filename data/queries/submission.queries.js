const { pool } = require("../index");
const format = require("pg-format");

const getContestQuestions = async (contestId) => {
  try {
    const { rows } = await pool.query(
      `SELECT question_id FROM questions WHERE contest_id = $1`,
      [contestId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getQuestionDetails = async (questionId) => {
  try {
    const { rows } = await pool.query(
      `SELECT q.points, qt.type_name
                 FROM questions q
                 JOIN question_types qt ON q.question_type_id = qt.question_type_id
                 WHERE q.question_id = $1`,
      [questionId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getCorrectAnswers = async (questionId) => {
  try {
    const { rows } = await pool.query(
      `SELECT answer_id FROM answers
                 WHERE question_id = $1 AND is_correct = TRUE`,
      [questionId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const addSubmission = async (userId, submission, score) => {
  const { contestId, questions: submittedQuestions } = submission;

  try {
    await pool.query("BEGIN");

    const userContest = await pool.query(
      `INSERT INTO user_contests (user_id, contest_id, score)
                     VALUES ($1, $2, $3) RETURNING user_contest_id`,
      [userId, contestId, score]
    );

    if (userContest.rowCount === 0) {
      throw new Error("Failed to insert into user_contests table");
    }

    const userContestId = userContest.rows[0].user_contest_id;

    const submissionValues = submittedQuestions.flatMap(
      ({ questionId, answers }) =>
        answers.map(({ answerId }) => [userContestId, questionId, answerId])
    );

    const insertQuery = format(
      `INSERT INTO user_submissions (user_contest_id, question_id, answer_id) VALUES %L`,
      submissionValues
    );

    await pool.query(insertQuery);

    await pool.query("COMMIT");
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

module.exports = {
  getContestQuestions,
  getQuestionDetails,
  getCorrectAnswers,
  addSubmission,
};
