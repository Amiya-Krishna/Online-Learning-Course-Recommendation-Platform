const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  interests: user.interests,
  role: user.role,
  enrolledCourses: user.enrolledCourses,
  createdAt: user.createdAt,
});

module.exports = { sanitizeUser };
