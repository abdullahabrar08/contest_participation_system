const contestQueries = require("../data/queries/contest.queries");
const contestDTO = require("../data/dto/contest.dto");

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

module.exports = {
  createContest,
  updateContest,
  getContests,
};
