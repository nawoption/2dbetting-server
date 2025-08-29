const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { validateBody } = require("../middlewares/validate");
const { createSessionSchema } = require("../validations/sessionValidation");
// 🔹 Create sessions
router.post("/2d", validateBody(createSessionSchema), protect, adminOnly, sessionController.createSession2D);
router.post("/3d", validateBody(createSessionSchema), protect, adminOnly, sessionController.createSession3D);
router.post("/4d", validateBody(createSessionSchema), protect, adminOnly, sessionController.createSession4D);

// 🔹 Common
router.get("/", protect, adminOnly, sessionController.getSessions);
router.get("/:id", protect, adminOnly, sessionController.getSessionById);
router.put("/:id/result", protect, adminOnly, sessionController.updateResult);
router.delete("/:id", protect, adminOnly, sessionController.deleteSession);

module.exports = router;
