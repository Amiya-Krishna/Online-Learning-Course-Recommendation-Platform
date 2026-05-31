const { Router } = require("express");

const {
  createCourse,
  listCourses,
  getCourseById,
  enrollInCourse,
} = require("../controllers/course.controller");
const { authenticate } = require("../middleware/authenticate");
const { validateRequest } = require("../middleware/validate-request");
const {
  objectIdParamValidator,
  createCourseValidator,
} = require("../validators/course.validator");

const router = Router();

router.get("/", listCourses);
router.get("/:courseId", objectIdParamValidator("courseId"), validateRequest, getCourseById);
router.post("/", authenticate, createCourseValidator, validateRequest, createCourse);
router.post(
  "/:courseId/enroll",
  authenticate,
  objectIdParamValidator("courseId"),
  validateRequest,
  enrollInCourse
);

module.exports = router;
