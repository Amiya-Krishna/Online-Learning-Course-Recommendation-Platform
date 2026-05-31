const { Router } = require("express");

const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/authenticate");
const { validateRequest } = require("../middleware/validate-request");
const { registerValidator, loginValidator } = require("../validators/auth.validator");

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
