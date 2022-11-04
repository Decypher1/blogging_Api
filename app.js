const express = require("express");
const db = require("./db");
const blogController = require("./controllers/blogController");
const validatePassword = require("./utils/validatePassword");
const authController = require("./controllers/authController");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");

const app = express();

app.use(express.json());
app.use("/user", userRoute);

app.get("/", (req, res) => {
  console.log("Starting my exam!!!");
  return res.status(200).json({
    status: "success",
    message: "Welcome to my Blog Website",
  });
});

// catching all  undefined routes
app.all("*", (req, res, next) => {
  next(res.status(404).send(`Page not found!`));
});

module.exports = app;