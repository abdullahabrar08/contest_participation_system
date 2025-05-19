const contestService = require("../../services/contest.service");

const createContest = async (req, res, next) => {
  try {
    const contest = await contestService.createContest(req);

    return res.status(201).send({
      responseCode: 2001,
      message: "Contest created Successfully",
      data: contest,
    });
  } catch (error) {
    next(error);
  }
};

const updateContest = async (req, res, next) => {
  try {
    const contest = await contestService.updateContest(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Contest updated Successfully",
      data: contest,
    });
  } catch (error) {
    next(error);
  }
};

const getContests = async (req, res, next) => {
  try {
    const contests = await contestService.getContests(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Contests",
      data: contests,
    });
  } catch (error) {
    next(error);
  }
};

const joinContest = async (req, res, next) => {
  try {
    const contest = await contestService.joinContest(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Contest joined Successfully",
      data: contest,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingContests = async (req, res, next) => {
  try {
    const contests = await contestService.getPendingContests(req);

    return res.status(200).send({
      responseCode: 2000,
      message: "Contests",
      data: contests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContest,
  updateContest,
  getContests,
  joinContest,
  getPendingContests,
};
