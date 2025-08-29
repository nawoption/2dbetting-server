const router = require("express").Router();
const cashinController = require("../controllers/cashinController");
const { validateBody } = require("../middlewares/validate");
const { createCashInSchema } = require("../validations/cashinValidation");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// User routes
router.post("/", protect, validateBody(createCashInSchema), cashinController.createCashIn);
router.get("/my", protect, cashinController.getMyCashIns);
router.get("/my/:id", protect, cashinController.getMyCashInById);

// Admin routes
router.get("/", protect, adminOnly, cashinController.getAllCashIns);
router.put("/:id/approve", protect, adminOnly, cashinController.approveCashIn);
router.put("/:id/reject", protect, adminOnly, cashinController.rejectCashIn);

module.exports = router;
