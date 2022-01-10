require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { createToken } = require("../helpers/jwt");

async function signup(req, res) {
  let { name, username, password } = req.body;
  let user = await User.findOne({ username });

  if (user) {
    return res.status(400).json({
      message: "Username already exists",
    });
  }

  /* Encrypt password */
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ name, username, password: hashedPassword });
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
  let { username, password } = req.body;

  let user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({
      message: "Username does not exist",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Password is incorrect",
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
      user,
    },
  });
}

module.exports = { signup, signin };
