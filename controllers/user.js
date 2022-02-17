require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { createToken } = require("../helpers/jwt");

async function signup(req, res) {
  let { email, name, username, password } = req.body;
  console.log(req.body);
  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: "Email already registered",
    });
  }

  /* Encrypt password */
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ email, name, username, password: hashedPassword });
  user.save((err) => {
    if (err)
      return res.status(500).json({
        message: err.message,
      });

    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  });
}

async function signin(req, res) {
  let { unOrEmail, password } = req.body;

  console.log(req.body);

  let user = await User.findOne({
    $or: [{ username: unOrEmail }, { email: unOrEmail }],
  });

  if (!user) {
    return res.status(400).json({
      message: "Username or email does not exist",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }

  /* Generate token */
  const token = createToken({
    _id: user._id,
    name: user.name,
    username: user.username,
  });

  if (!token) {
    return res.status(500).json({
      message: "Token generation failed",
    });
  }

  return res.status(200).json({
    message: "User signed in successfully",
    data: {
      token,
    },
  });
}

async function getMyProfile(req, res) {
  let user = await User.findById(req.user._id);
  return res.status(200).json({
    message: "User profile",
    data: user,
  });
}

function like(req,res) {
  User.findOne({_id: req.body.userId}, (err, target) => {
      if (err) throw err;
      target.posts.findOne({_id: req.body.postId}, (err, post) => {
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

function coment(req,res) {
  User.findOne({_id: req.body.userId}, (err, target) => {
      if (err) throw err;
      target.posts.findOne({_id: req.body.postId}, (err, post) => {
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

module.exports = { signup, signin, getMyProfile, like, coment };
