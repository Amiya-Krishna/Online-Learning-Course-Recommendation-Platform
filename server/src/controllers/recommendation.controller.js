const { recommendationService } = require("../services/recommendation.service");
const { catchAsync } = require("../utils/catch-async");

const getRecommendations = catchAsync(async (req, res) => {
  const recommendations = await recommendationService.getRecommendationsForUser(
    req.params.userId
  );
  res.status(200).json(recommendations);
});

module.exports = { getRecommendations };
