const createOrderPlaceholder = (_req, res) => {
  res.status(202).json({
    message: "Payment integration is not wired yet. Add Stripe or Razorpay next.",
  });
};

module.exports = { createOrderPlaceholder };
