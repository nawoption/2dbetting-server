const router = require("express").Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.use("/auth", require("./authRoute"));

router.use("/user", protect, adminOnly, require("./userRoute"));

module.exports = router;
