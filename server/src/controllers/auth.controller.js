const { authService } = require("../services/auth.service");
const { catchAsync } = require("../utils/catch-async");

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.status(200).json(result);
});

const getCurrentUser = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.auth.sub);
  res.status(200).json(user);
});

module.exports = { register, login, getCurrentUser };
