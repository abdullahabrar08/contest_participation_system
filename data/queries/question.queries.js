const { pool } = require("../index");

const findQuestionByName = async (questionText) => {
  try {
    const query = `
      SELECT * FROM questions
      WHERE question_text = $1
    `;
    const values = [questionText];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const createQuestion = async (data) => {
  try {
    await pool.query("BEGIN");

    const query = `
      INSERT INTO questions (contest_id, question_text, question_type_id, points)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      data.contestId,
      data.questionText,
      data.questionTypeId,
      data.points,
    ];
    const result = await pool.query(query, values);
    const questionId = result.rows[0].question_id;

    // Insert answers
    const answerQuery = `
      INSERT INTO answers (question_id, answer_text, is_correct)
      VALUES ($1, $2, $3)
    `;
    for (const answer of data.answers) {
      await pool.query(answerQuery, [
        questionId,
        answer.answerText,
        answer.isCorrect,
      ]);
    }

    await pool.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

const getContestQuestions = async (data) => {
  try {
    const query = `
      SELECT 
           q.question_id, q.question_text, q.question_type_id, q.points,
           json_agg(json_build_object(
               'answer_id', a.answer_id,
               'answer_text', a.answer_text,
               'is_correct', a.is_correct 
           )) as answers 
      FROM questions q
      LEFT JOIN answers a ON q.question_id = a.question_id
      WHERE q.contest_id = $1
      group by q.question_id 
      ORDER BY q.question_id ASC
      LIMIT $3
      OFFSET ($2 - 1) * $3
    `;
    const values = [data.contestId, data.page, data.size];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findQuestionByName,
  createQuestion,
  getContestQuestions,
};
