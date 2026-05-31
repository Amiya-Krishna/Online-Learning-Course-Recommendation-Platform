const { courseRepository } = require("../repositories/course.repository");
const { userRepository } = require("../repositories/user.repository");
const { ApiError } = require("../utils/api-error");

const courseService = {
  async createCourse(payload) {
    return courseRepository.create(payload);
  },

  async listCourses() {
    return courseRepository.findAll();
  },

  async getCourseById(courseId) {
    const course = await courseRepository.findByIdLean(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    return course;
  },

  async enrollInCourse(courseId, userId) {
    const [course, user] = await Promise.all([
      courseRepository.findById(courseId),
      userRepository.findById(userId),
    ]);

    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const alreadyEnrolled = user.enrolledCourses.some(
      (enrolledCourseId) => enrolledCourseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      throw new ApiError(409, "You are already enrolled in this course.");
    }

    await Promise.all([
      courseRepository.addStudent(courseId, userId),
      userRepository.addEnrolledCourse(userId, courseId),
    ]);

    return { message: "Enrollment successful." };
  },
};

module.exports = { courseService };
