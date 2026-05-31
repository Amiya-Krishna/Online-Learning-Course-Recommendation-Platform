const User = require("../models/User");

const userRepository = {
  create(payload) {
    return User.create(payload);
  },

  findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  },

  findById(id) {
    return User.findById(id);
  },

  findDashboardById(id) {
    return User.findById(id)
      .populate({
        path: "enrolledCourses",
        select:
          "title description instructor category level durationInHours thumbnail price studentsEnrolled createdAt",
      })
      .lean();
  },

  addEnrolledCourse(userId, courseId) {
    return User.updateOne({ _id: userId }, { $addToSet: { enrolledCourses: courseId } });
  },
};

module.exports = { userRepository };
