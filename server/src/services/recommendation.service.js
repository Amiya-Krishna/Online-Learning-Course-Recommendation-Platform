const { courseRepository } = require("../repositories/course.repository");
const { userRepository } = require("../repositories/user.repository");
const { ApiError } = require("../utils/api-error");

const scoreCourse = (course, userInterests) => {
  const normalizedInterests = userInterests.map((interest) => interest.toLowerCase());
  const tagMatches = (course.tags || []).filter((tag) =>
    normalizedInterests.includes(tag)
  ).length;
  const categoryMatch = normalizedInterests.includes(course.category) ? 4 : 0;
  const titleMatches = normalizedInterests.reduce((score, interest) => {
    return score + (course.title.toLowerCase().includes(interest) ? 1 : 0);
  }, 0);

  return categoryMatch + tagMatches * 2 + titleMatches;
};

const recommendationService = {
  async getRecommendationsForUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const courses = await courseRepository.findRecommendationPool();
    const enrolledCourseIds = new Set(user.enrolledCourses.map((id) => id.toString()));

    const scoredCourses = courses
      .filter((course) => !enrolledCourseIds.has(course._id.toString()))
      .map((course) => ({
        ...course,
        relevanceScore: scoreCourse(course, user.interests || []),
      }))
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    const matchingCourses = scoredCourses.filter((course) => course.relevanceScore > 0);

    return matchingCourses.length > 0 ? matchingCourses : scoredCourses.slice(0, 4);
  },
};

module.exports = { recommendationService };
