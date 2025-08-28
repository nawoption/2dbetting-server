const router = require("express").Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.route("/:id").get(userController.getUserById).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
