const { sign, verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "Admin not Authenticated!" });

  try {
    const validToken = verify(accessToken, "jwtsecretpls");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = validateToken;