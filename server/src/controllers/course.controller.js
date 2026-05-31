const { courseService } = require("../services/course.service");
const { catchAsync } = require("../utils/catch-async");

const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  res.status(201).json(course);
});

const listCourses = catchAsync(async (_req, res) => {
  const courses = await courseService.listCourses();
  res.status(200).json(courses);
});

const getCourseById = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);
  res.status(200).json(course);
});

const enrollInCourse = catchAsync(async (req, res) => {
  const response = await courseService.enrollInCourse(req.params.courseId, req.auth.sub);
  res.status(200).json(response);
});

module.exports = { createCourse, listCourses, getCourseById, enrollInCourse };
