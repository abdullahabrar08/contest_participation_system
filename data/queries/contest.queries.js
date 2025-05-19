const { pool } = require("../index");
const { USER_ROLES } = require("../../utils/constants");

const createContest = async ({
  contestName,
  description,
  startTime,
  endTime,
  isVipOnly,
  prize,
}) => {
  try {
    await pool.query("BEGIN");

    const contestQuery = `
            INSERT INTO public.contests (contest_name, description, start_time, end_time, is_vip_only)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

    const contestValues = [
      contestName,
      description,
      startTime,
      endTime,
      isVipOnly,
    ];
    const contestResult = await pool.query(contestQuery, contestValues);
    const contestId = contestResult.rows[0].contest_id;

    const prizeQuery = `
            INSERT INTO public.prizes (contest_id, prize_name, description)
            VALUES ($1, $2, $3)
        `;

    const prizeValues = [contestId, prize.name, prize.description];
    await pool.query(prizeQuery, prizeValues);

    await pool.query("COMMIT");

    return contestResult.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

const findContestByName = async (contestName) => {
  try {
    const query = `SELECT * FROM contests WHERE contest_name = $1`;
    const values = [contestName];

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const findContestById = async (contestId) => {
  try {
    const query = `SELECT * FROM contests WHERE contest_id = $1`;
    const values = [contestId];

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const updateContest = async ({
  contestId,
  contestName,
  description,
  startTime,
  endTime,
  isVipOnly,
  prize,
}) => {
  try {
    await pool.query("BEGIN");

    const contestQuery = `
            UPDATE public.contests
            SET contest_name = $1, description = $2, start_time = $3, end_time = $4, is_vip_only = $5
            WHERE contest_id = $6
            RETURNING *
        `;

    const contestValues = [
      contestName,
      description,
      startTime,
      endTime,
      isVipOnly,
      contestId,
    ];
    const contestResult = await pool.query(contestQuery, contestValues);

    const prizeQuery = `
            UPDATE public.prizes
            SET prize_name = $1, description = $2
            WHERE contest_id = $3
        `;

    const prizeValues = [prize.name, prize.description, contestId];
    await pool.query(prizeQuery, prizeValues);

    await pool.query("COMMIT");

    return contestResult.rows[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

const getContests = async ({ isGuest, page, size }, user) => {
  try {
    // check if user role is 3 (Normal) then return only contests with is_vip_only = false
    const isNormalOnly =
      isGuest === "false" && user.role_id === USER_ROLES.NORMAL
        ? `WHERE c.is_vip_only = false`
        : ``;

    const query = {
      text: `
            SELECT c.contest_id, c.contest_name, c.description, c.start_time, c.end_time, c.is_vip_only, p.prize_name, p.description AS prize_description
            FROM contests c
            JOIN prizes p ON c.contest_id = p.contest_id
            ${isNormalOnly}
            ORDER BY c.start_time DESC
            LIMIT $2
            OFFSET ($1 - 1) * $2`,
      values: [page, size],
    };

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const isContestParticipant = async (contestId, userId) => {
  try {
    const query = `
      SELECT * FROM user_contests 
      WHERE contest_id = $1 AND user_id = $2
    `;
    const values = [contestId, userId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const isContestActive = async (contestId) => {
  try {
    const query = `
      SELECT * FROM contests 
      WHERE contest_id = $1 AND (start_time <= NOW() AND end_time >= NOW())
    `;
    const values = [contestId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const isContestStarted = async (contestId) => {
  try {
    const query = `
      SELECT * FROM contests 
      WHERE contest_id = $1 AND start_time <= NOW()
    `;
    const values = [contestId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createContest,
  findContestByName,
  findContestById,
  updateContest,
  getContests,
  isContestParticipant,
  isContestActive,
  isContestStarted,
};
