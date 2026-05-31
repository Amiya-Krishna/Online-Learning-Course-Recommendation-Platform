const { ApiError } = require("../utils/api-error");
const logger = require("../config/logger");

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (error, _req, res, _next) => {
  logger.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource identifier." });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists." });
  }

  const statusCode = error.statusCode || 500;
  const message =
    statusCode >= 500 ? "Something went wrong on the server." : error.message;

  return res.status(statusCode).json({
    message,
    details: error.details || null,
  });
};

module.exports = { notFoundHandler, errorHandler };
