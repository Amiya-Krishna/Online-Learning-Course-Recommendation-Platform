const { userService } = require("../services/user.service");
const { catchAsync } = require("../utils/catch-async");

const getDashboard = catchAsync(async (req, res) => {
  const dashboard = await userService.getDashboard(req.auth.sub);
  res.status(200).json(dashboard);
});

module.exports = { getDashboard };
