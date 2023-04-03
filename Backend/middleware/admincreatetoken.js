const { sign, verify } = require("jsonwebtoken");

const createTokens = (admin) => {
  const accessToken = sign(
    { userName: admin.userName, id: admin.id },
    "jwtsecretplschangeAKIATLAOEO6AE3ZHGYX4"
  );

  return accessToken;
};


module.exports = createTokens;