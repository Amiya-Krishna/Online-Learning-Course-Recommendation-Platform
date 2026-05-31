const { Router } = require("express");

const { createOrderPlaceholder } = require("../controllers/payment.controller");

const router = Router();

router.post("/create-order", createOrderPlaceholder);

module.exports = router;
