const { sign, verify } = require("jsonwebtoken");

const createTokens = (admin) => {
  const accessToken = sign(
    { userName: admin.userName, id: admin.id },
    "jwtsecretpls"
  );

  return accessToken;
};


module.exports = createTokens;