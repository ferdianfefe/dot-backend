const router = require("express").Router();
const UserController = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");

router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);

module.exports = router;
