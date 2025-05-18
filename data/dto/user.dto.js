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

module.exports = {
  createUserDTO,
};
