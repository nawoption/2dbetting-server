const router = require("express").Router();
const paymentMethodController = require("../controllers/paymentMethodController");
const { validateBody } = require("../middlewares/validate");
const { createPaymentMethodSchema } = require("../validations/paymentMethodValidation");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// User routes
router.get("/active", protect, paymentMethodController.getActivePaymentMethods);

// admin routes
router.post(
    "/",
    protect,
    adminOnly,
    validateBody(createPaymentMethodSchema),
    paymentMethodController.createPaymentMethod
);
router.get("/", protect, adminOnly, paymentMethodController.getAllPaymentMethods);

router
    .route("/:id")
    .get(protect, adminOnly, paymentMethodController.getPaymentMethodById)
    .patch(protect, adminOnly, paymentMethodController.updatePaymentMethod)
    .delete(protect, adminOnly, paymentMethodController.deletePaymentMethod);

module.exports = router;
