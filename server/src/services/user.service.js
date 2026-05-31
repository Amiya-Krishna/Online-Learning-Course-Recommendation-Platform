const { userRepository } = require("../repositories/user.repository");
const { ApiError } = require("../utils/api-error");

const addCourseProgress = (course, index) => ({
  ...course,
  progress: Math.min(92, 20 + index * 18),
});

const userService = {
  async getDashboard(userId) {
    const user = await userRepository.findDashboardById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return {
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
        role: user.role,
        joinedAt: user.createdAt,
      },
      stats: {
        enrolledCourses: user.enrolledCourses.length,
      },
      enrolledCourses: user.enrolledCourses.map(addCourseProgress),
    };
  },
};

module.exports = { userService };
