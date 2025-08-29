const router = require("express").Router();
const numberController = require("../controllers/numberController");

// User can only read numbers by sessionId
router.get("/:sessionId", numberController.getNumbersBySession);

module.exports = router;
