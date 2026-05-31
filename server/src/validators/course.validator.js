const { body, param } = require("express-validator");

const objectIdParamValidator = (field) =>
  param(field).isMongoId().withMessage(`${field} must be a valid MongoDB id.`);

const createCourseValidator = [
  body("title").trim().isLength({ min: 4, max: 120 }).withMessage("Title is required."),
  body("description")
    .trim()
    .isLength({ min: 20, max: 1200 })
    .withMessage("Description must be between 20 and 1200 characters."),
  body("instructor")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Instructor name is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a valid number."),
  body("category")
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage("Category is required."),
  body("thumbnail").optional().isURL().withMessage("Thumbnail must be a valid URL."),
  body("level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level is invalid."),
  body("durationInHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Duration must be a positive number."),
  body("tags").optional().isArray().withMessage("Tags must be an array."),
];

module.exports = { objectIdParamValidator, createCourseValidator };
