const jwt = require("jsonwebtoken");
const dontenv = require("dotenv");
const auth = async (req, res, next) => {
  const token = req.headers.authtoken;

  dontenv.config();
  const tokenValidation = await jwt.verify(token, process.env.KEY);

  req.userId = tokenValidation.id;

  next();
};

module.exports = auth;
