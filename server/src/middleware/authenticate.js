const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { ApiError } = require("../utils/api-error");

const authenticate = (req, _res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Authentication is required."));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.auth = payload;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token."));
  }
};

module.exports = { authenticate };
