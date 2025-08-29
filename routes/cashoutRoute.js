const router = require("express").Router();
const cashoutController = require("../controllers/cashoutController");
const { validateBody } = require("../middlewares/validate");
const { createCashOutSchema } = require("../validations/cashoutValidation");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// User routes
router.post("/", protect, validateBody(createCashOutSchema), cashoutController.createCashOut);
router.get("/my", protect, cashoutController.getMyCashOuts);
router.get("/my/:id", protect, cashoutController.getMyCashOutById);

// Admin routes
router.get("/", protect, adminOnly, cashoutController.getAllCashOuts);
router.put("/:id/approve", protect, adminOnly, cashoutController.approveCashOut);
router.put("/:id/reject", protect, adminOnly, cashoutController.rejectCashOut);

module.exports = router;
