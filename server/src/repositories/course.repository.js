const Course = require("../models/Course");

const courseRepository = {
  create(payload) {
    return Course.create(payload);
  },

  findAll() {
    return Course.find()
      .select("-studentsEnrolled")
      .sort({ createdAt: -1 })
      .lean();
  },

  findById(id) {
    return Course.findById(id);
  },

  findByIdLean(id) {
    return Course.findById(id).lean();
  },

  addStudent(courseId, userId) {
    return Course.updateOne({ _id: courseId }, { $addToSet: { studentsEnrolled: userId } });
  },

  findRecommendationPool() {
    return Course.find()
      .select(
        "title description instructor category tags level durationInHours thumbnail price studentsEnrolled createdAt"
      )
      .lean();
  },
};

module.exports = { courseRepository };
