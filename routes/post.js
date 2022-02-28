const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth");
const PostController = require("../controllers/post");
const multer = require("multer");

router.get("/", PostController.getAllPosts);
router.post("/comment", verifyToken, PostController.createComment);
router.post(
  "/",
  verifyToken,
  multer().single("image"),
  PostController.createPost
);

module.exports = router;
