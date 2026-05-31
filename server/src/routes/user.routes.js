const { Router } = require("express");

const { getDashboard } = require("../controllers/user.controller");
const { authenticate } = require("../middleware/authenticate");

const router = Router();

router.get("/dashboard", authenticate, getDashboard);

module.exports = router;
