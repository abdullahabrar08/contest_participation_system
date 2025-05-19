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

const joinContest = async (contestId, userId) => {
  try {
    const query = `
      INSERT INTO user_contests (contest_id, user_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [contestId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const isContestSubmitted = async (contestId, userId) => {
  try {
    const query = `
      SELECT * FROM user_contests  
      WHERE contest_id = $1 AND user_id = $2 AND is_submitted = true
    `;
    const values = [contestId, userId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getPendingContests = async (userId, { page, size }) => {
  try {
    const query = `
      SELECT uc.contest_id, c.contest_name, c.description, c.start_time, c.end_time, c.is_vip_only
      FROM user_contests uc
      JOIN contests c ON uc.contest_id = c.contest_id
      WHERE uc.user_id = $1 AND uc.is_submitted = false
      LIMIT $3
      OFFSET ($2 - 1) * $3
    `;
    const values = [userId, page, size];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getHistory = async (userId, { page, size }) => {
  try {
    const query = `
      SELECT c.contest_id, c.contest_name, c.description, c.start_time, c.end_time, l.score, pr.prize_name, pr.description AS prize_description
      FROM leaderboard l
      INNER JOIN contests c ON l.contest_id = c.contest_id
      LEFT JOIN user_prizes p ON l.user_id = p.user_id AND l.contest_id = p.contest_id
      LEFT JOIN prizes pr ON p.contest_id = pr.contest_id
      WHERE l.user_id = $1
      ORDER BY l.contest_id DESC
      LIMIT $3
      OFFSET ($2 - 1) * $3
    `;
    const values = [userId, page, size];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getPrizeHistory = async (userId, { page, size }) => {
  try {
    const query = `
      SELECT p.contest_id, c.contest_name, pr.prize_name, pr.description AS prize_description, p.awarded_at
      FROM user_prizes p
      INNER JOIN contests c ON p.contest_id = c.contest_id
      INNER JOIN prizes pr ON p.contest_id = pr.contest_id
      WHERE p.user_id = $1
      ORDER BY p.awarded_at DESC
      LIMIT $3
      OFFSET ($2 - 1) * $3
    `;
    const values = [userId, page, size];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getContestForPrizeDistribution = async () => {
  try {
    const query = `
      SELECT *
      FROM contests
      WHERE end_time >= NOW() - INTERVAL '5 minutes'
        AND end_time <= NOW()
    `;

    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const distributePrizes = async (contests) => {
  try {
    for (let i = 0; i < contests.length; i++) {
      const contestId = contests[i].contest_id;

      // Get Prize for the contest
      const prizeResult = await pool.query({
        text: `
        SELECT prize_id FROM prizes
        WHERE contest_id = $1
      `,
        values: [contestId],
      });

      // Get winner for the contest
      const winnerResult = await pool.query({
        text: `
        SELECT user_id FROM leaderboard
        WHERE contest_id = $1
        ORDER BY score DESC
        LIMIT 1
      `,
        values: [contestId],
      });

      const winnerId = winnerResult.rows[0].user_id;
      const prizeId = prizeResult.rows[0].prize_id;

      // Insert into user_prizes
      const insertQuery = `
        INSERT INTO user_prizes (user_id, contest_id, prize_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, contest_id, prize_id) DO NOTHING
      `;
      const insertValues = [winnerId, contestId, prizeId];
      await pool.query(insertQuery, insertValues);
    }
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
  joinContest,
  isContestSubmitted,
  getPendingContests,
  getHistory,
  getPrizeHistory,
  getContestForPrizeDistribution,
  distributePrizes,
};
