const router = require("express").Router();
const UserController = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");

router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);
router.get("/current_user", verifyToken, UserController.getMyProfile);
router.post("/like", verifyToken, UserController.like);
router.post("/coment", verifyToken, UserController.coment);

module.exports = router;
