const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { userRepository } = require("../repositories/user.repository");
const { ApiError } = require("../utils/api-error");
const { sanitizeUser } = require("../utils/sanitize-user");

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const authService = {
  async register(payload) {
    const existingUser = await userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const user = await userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    return {
      token: signToken(user),
      user: sanitizeUser(user),
    };
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password.");
    }

    return {
      token: signToken(user),
      user: sanitizeUser(user),
    };
  },

  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return sanitizeUser(user);
  },
};

module.exports = { authService };
