const { Router } = require("express");

const authRoutes = require("./auth.routes");
const courseRoutes = require("./course.routes");
const userRoutes = require("./user.routes");
const recommendationRoutes = require("./recommendation.routes");
const paymentRoutes = require("./payment.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/user", userRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
