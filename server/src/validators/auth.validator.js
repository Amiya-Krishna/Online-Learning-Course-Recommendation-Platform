const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array of strings."),
  body("interests.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Each interest must be a valid string."),
];

const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

module.exports = { registerValidator, loginValidator };
