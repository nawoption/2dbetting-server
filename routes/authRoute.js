const router = require("express").Router();
const authController = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validations/authValidation");
const { validateBody } = require("../middlewares/validate");

router.post("/login", validateBody(loginSchema), authController.login);
router.post("/register", validateBody(registerSchema), authController.register);

module.exports = router;
