const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { userName: user.userName, id: user.id },
    "jwtsecretplschange"
  );

  return accessToken;
};

module.exports = createTokens;