"use strict";
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  /* If token does not exist */
  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  /* Check if token is valid */
  try {
    const decoded = await jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err)
      return res.status(500).json({
        message: "Token is not valid",
      });
  }
};

module.exports = { verifyToken };
