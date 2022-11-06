//Dependencies
const express = require("express");

const logger = require("morgan")

//ROUTES
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
require("dotenv").config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}))


app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);



app.use("/", userRoute);
app.use("/blog", blogRoute);

app.get("/api/v1", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome to my Decypher's Blog Website",
  });
});

// catching all  undefined routes
app.all("*", (req, res, next) => {
  next(res.status(404).json({message : 'Page not found!'}));
});

module.exports = app;