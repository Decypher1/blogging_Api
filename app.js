//Dependencies
const express = require("express");

const cookieParser = require("cookie-parser")
const morgan = require("morgan")

//ROUTES
const accountRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
require("dotenv").config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}))

app.use(morgan());
app.use(cookieParser())


app.use("/", accountRoute);
app.use("/blog", blogRoute);


// catching all  undefined routes
app.all("*", (req, res, next) => {
  next(res.status(404).json({message : 'Page not found!'}));
});

module.exports = app;