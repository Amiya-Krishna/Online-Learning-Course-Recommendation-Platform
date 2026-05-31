const { Router } = require("express");

const { getRecommendations } = require("../controllers/recommendation.controller");
const { validateRequest } = require("../middleware/validate-request");
const { objectIdParamValidator } = require("../validators/course.validator");

const router = Router();

router.get("/:userId", objectIdParamValidator("userId"), validateRequest, getRecommendations);

module.exports = router;
