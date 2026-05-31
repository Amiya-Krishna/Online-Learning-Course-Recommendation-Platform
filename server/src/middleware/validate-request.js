const { validationResult } = require("express-validator");

const { ApiError } = require("../utils/api-error");

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return next(
    new ApiError(
      422,
      "Validation failed.",
      errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
    )
  );
};

module.exports = { validateRequest };
