'use strict';
require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = ({ _id, name, username }) => {
  return jwt.sign(
    {
      _id,
      name,
      username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

module.exports = { createToken };
