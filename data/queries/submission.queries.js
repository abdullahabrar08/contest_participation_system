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
      `SELECT user_contest_id FROM user_contests WHERE user_id = $1 AND contest_id = $2`,
      [userId, contestId]
    );

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

    const leaderboardQuery = `
      INSERT INTO leaderboard (contest_id, user_id, score)
      VALUES ($1, $2, $3)
    `;
    const leaderboardValues = [contestId, userId, score];
    await pool.query(leaderboardQuery, leaderboardValues);

    await pool.query(
      `UPDATE user_contests SET is_submitted = true WHERE user_contest_id = $1`,
      [userContestId]
    );

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
