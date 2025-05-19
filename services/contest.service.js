const contestQueries = require("../data/queries/contest.queries");
const contestDTO = require("../data/dto/contest.dto");
const { USER_ROLES } = require("../utils/constants");

const createContest = async (req) => {
  try {
    const data = req.body;

    // check if contest name already exists
    await findContestByName(data);

    // create contest
    const contest = await contestQueries.createContest(data);
    if (!contest) {
      const err = new Error("Contest creation failed");
      err.statusCode = 500;
      err.responseCode = 5000;
      err.details = "Contest creation failed";
      throw err;
    }

    return contestDTO.contestDTO(contest);
  } catch (error) {
    throw error;
  }
};

const findContestByName = async ({ contestName }) => {
  try {
    const contest = await contestQueries.findContestByName(contestName);
    if (contest.length > 0) {
      const err = new Error("Contest already exists");
      err.statusCode = 409;
      err.responseCode = 4009;
      err.details = `Contest already exists with same name : ${contestName}`;
      throw err;
    }
  } catch (error) {
    throw error;
  }
};

const updateContest = async (req) => {
  try {
    const data = req.body;

    // check if contest id is provided
    await findContestById(data);

    // update contest
    const contest = await contestQueries.updateContest(data);
    if (!contest) {
      const err = new Error("Contest update failed");
      err.statusCode = 500;
      err.responseCode = 5000;
      err.details = "Contest update failed";
      throw err;
    }

    return contestDTO.contestDTO(contest);
  } catch (error) {
    throw error;
  }
};

const findContestById = async ({ contestId }) => {
  try {
    // check if contest exists with id provided
    const contest = await contestQueries.findContestById(contestId);
    if (contest.length === 0) {
      const err = new Error("Contest not found");
      err.statusCode = 404;
      err.responseCode = 4004;
      err.details = `Contest not found with id : ${contestId}`;
      throw err;
    }

    // check if contest is already started then don't allow update
    const currentTime = new Date();
    const startTime = new Date(contest[0].start_time);
    if (currentTime > startTime) {
      const err = new Error("Contest already started");
      err.statusCode = 409;
      err.responseCode = 4009;
      err.details = `Uou're not allowed to update contest as it has already started`;
      throw err;
    }
  } catch (error) {
    throw error;
  }
};

const getContests = async (req) => {
  try {
    const data = req.query;

    const contests = await contestQueries.getContests(data, req.user);
    if (contests.length === 0) {
      const err = new Error("No contests found");
      err.statusCode = 404;
      err.responseCode = 4004;
      err.details = [];
      throw err;
    }

    return contests.map((contest) => contestDTO.contestDTO(contest));
  } catch (error) {
    throw error;
  }
};

const joinContest = async (req) => {
  try {
    const { contestId } = req.query;
    const { role_id: roleId, user_id: userId } = req.user;

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

    // join contest
    const contestParticipant = await contestQueries.joinContest(
      contestId,
      userId
    );

    return true;
  } catch (error) {
    throw error;
  }
};

const getPendingContests = async (req) => {
  try {
    const data = req.query;
    const { user_id: userId } = req.user;

    const contests = await contestQueries.getPendingContests(userId, data);
    if (contests.length === 0) {
      const err = new Error("No contests found");
      err.statusCode = 404;
      err.responseCode = 4004;
      err.details = [];
      throw err;
    }

    return contests.map((contest) => contestDTO.contestDTO(contest));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createContest,
  updateContest,
  getContests,
  joinContest,
  getPendingContests,
};
