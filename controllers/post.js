const sharp = require("sharp");
const Post = require("../models/post");

async function getAllPosts(req, res) {
  const posts = await Post.find({}).populate(
    "creator",
    "name username decodedProfileImage"
  );
  if (posts.length) {
    return res.status(200).json({
      success: true,
      data: posts,
    });
  }
  return res.status(404).json({
    success: false,
    message: "Post not found",
  });
}

async function createPost(req, res) {
  const { type, caption } = req.body;
  let outputImg = null;

  if (type === "image") {
    outputImg = await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("png")
      .toBuffer();
  }

  const newPost = new Post({
    creator: req.user._id,
    type,
    image: outputImg,
    caption: caption,
    imageType: req.file.mimetype,
  });

  newPost.save().then((post) => {
    if (post) {
      return res.status(201).json({
        message: "Post created successfully",
        data: post,
      });
    }

    return res.status(500).json({
      message: err.message,
    });
  });
}

function likePost(req, res) {
  User.findOne({ _id: req.body.userId }, (err, target) => {
    if (err) throw err;
    target.posts.findOne({ _id: req.body.postId }, (err, post) => {
      if (err) throw err;
      if (post.likes.indexOf(req.user._id) < 0) {
        // belum like
        post.likes.push(req.user._id);
        post.save((err) => {
          if (err) throw err;
          res.status(201).json({
            success: true,
            message: "Successfully like post",
          });
        });
      } else {
        // sudah like
        post.likes.splice(post.likes.indexOf(req.user._id), 1);
        post.save((err) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            message: "Successfully unlike post",
          });
        });
      }
    });
  });
}

function deletePost(req, res) {}

function createComment(req, res) {
  User.findOne({ _id: req.body.userId }, (err, target) => {
    if (err) throw err;
    target.posts.findOne({ _id: req.body.postId }, (err, post) => {
      if (err) throw err;
      post.comments.push({
        creator: req.user._id,
        content: req.body.comment,
      });
      post.save((err) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          message: "Successfully comment post",
        });
      });
    });
  });
}

module.exports = {
  getAllPosts,
  createPost,
  likePost,
  deletePost,
  createComment,
};
