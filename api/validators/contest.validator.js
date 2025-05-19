const Joi = require("joi");

const createContestRequest = Joi.object({
  contestName: Joi.string().max(255).required(),
  description: Joi.string().max(150).required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  isVipOnly: Joi.boolean().required(),
  prize: Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(150).required(),
  }).required(),
}).required();

const updateContestRequest = Joi.object({
  contestId: Joi.number().integer().required(),
  contestName: Joi.string().max(255).required(),
  description: Joi.string().max(150).required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  isVipOnly: Joi.boolean().required(),
  prize: Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(150).required(),
  }).required(),
}).required();

const getContestRequest = Joi.object({
  isGuest: Joi.boolean().required(),
  page: Joi.number().integer().min(1).required(),
  size: Joi.number().integer().max(10).required(),
}).required();

module.exports = {
  createContestRequest,
  updateContestRequest,
  getContestRequest,
};
