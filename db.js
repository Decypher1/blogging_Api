const mongoose = require("mongoose")

const Schema = mongoose.Schema;
require("dotenv").config();

const mongodbConnectionString = process.env.mongodbConnectionString;

const connectToMongoDB = () => {
  mongoose.connect(mongodbConnectionString);

  mongoose.connection.on("connected", () => {
    console.log("Successfully Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error Connecting to MongoDB", err);
  });
};


module.exports = connectToMongoDB;