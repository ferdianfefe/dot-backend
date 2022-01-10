require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user");

/* Create express app */
const app = express();

/* Body parser */
app.use(express.json({ limit: "25mb" }));

/* Enable CORS */
app.use(cors());

/* MongoDB connection */
mongoose.connect(process.env.MONGOURI, (err) => {
  if (err) throw err;
  console.log("Connected to MongoDB");
});

/* Routes */
const userRouter = require("./routes/user");

app.use("/api/user", userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
