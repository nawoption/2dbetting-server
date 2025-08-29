const router = require("express").Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.use("/auth", require("./authRoute"));

router.use("/user", require("./userRoute"));

router.use("/payment-methods", require("./paymentMethodRoute"));

router.use("/cashin", require("./cashinRoute"));

router.use("/cashout", require("./cashoutRoute"));

router.use("/session", require("./sessionRoute"));

router.use("/number", require("./numberRoute"));

router.use("/bet-slips", require("./betSlipRoute"));

module.exports = router;
