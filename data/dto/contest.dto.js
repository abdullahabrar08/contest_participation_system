const contestDTO = (response) => {
  return {
    contestId: response.contest_id,
    contestName: response.contest_name,
    description: response.description,
    startTime: response.start_time,
    endTime: response.end_time,
    isVipOnly: response.is_vip_only,
    createdAt: response.created_at,
  };
};

module.exports = { contestDTO };
