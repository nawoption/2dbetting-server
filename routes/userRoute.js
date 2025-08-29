const router = require("express").Router();
const userController = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// user routes
router.get("/profile", protect, userController.getUserById);

// admin routes
router.get("/", protect, adminOnly, userController.getAllUsers);
router
    .route("/:id")
    .get(protect, adminOnly, userController.getUserById)
    .patch(protect, adminOnly, userController.updateUser)
    .delete(protect, adminOnly, userController.deleteUser);

module.exports = router;
