const router = require("express").Router();
const betSlipController = require("../controllers/betSlipController");
const { validateBody } = require("../middlewares/validate");
const { betSlipSchema } = require("../validations/betSlipValidation");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, validateBody(betSlipSchema), betSlipController.createBetSlip);
router.get("/session-type/:sessionType", protect, betSlipController.getUserSlips);
router.get("/:slipId", protect, betSlipController.getSlipDetails);

module.exports = router;
