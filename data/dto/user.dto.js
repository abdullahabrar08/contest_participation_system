const createUserDTO = (payload, token) => {
  return {
    userId: payload.user_id,
    token: token,
    username: payload.username,
    email: payload.email,
    roleId: payload.role_id,
    createdAt: payload.created_at,
  };
};

const getHistoryDTO = (responseArray) => {
  return responseArray.map((contest) => ({
    contestId: contest.contest_id,
    contestName: contest.contest_name,
    description: contest.description,
    startTime: contest.start_time,
    endTime: contest.end_time,
    score: contest.score,
    prizeName: contest.prize_name,
    prizeDescription: contest.prize_description,
  }));
};

const prizesDTO = (responseArray) => {
  return responseArray.map((prize) => ({
    contestId: prize.contest_id,
    contestName: prize.contest_name,
    prizeName: prize.prize_name,
    prizeDescription: prize.prize_description,
    awardedAt: prize.awarded_at,
  }));
};

module.exports = {
  createUserDTO,
  getHistoryDTO,
  prizesDTO,
};
