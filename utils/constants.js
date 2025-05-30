const HTTP_REQUEST_ATTRIBUTES = {
  HEADERS: "headers",
  BODY: "body",
  QUERY: "query",
  PARAMS: "params",
};

const USER_ROLES = Object.freeze({
  ADMIN: 1,
  VIP: 2,
  NORMAL: 3,
});

const ROLE_NAMES = {
  [USER_ROLES.ADMIN]: "ADMIN",
  [USER_ROLES.VIP]: "VIP",
  [USER_ROLES.NORMAL]: "NORMAL",
};

const QUESTION_TYPES = {
  SINGLE_SELECT: 1,
  MULTI_SELECT: 2,
  TRUE_FALSE: 3,
};

module.exports = {
  HTTP_REQUEST_ATTRIBUTES,
  USER_ROLES,
  ROLE_NAMES,
  QUESTION_TYPES,
};
