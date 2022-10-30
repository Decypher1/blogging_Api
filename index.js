const express = require('express');
const mongoose = require('mongoose');
const connectToMongoDB = require('./db');
require("dotenv").config()
PORT = process.env.PORT

const db = require("./db")

const app = express()

app.get('/', (req, res) => {
    res.send("Welcome to homepage")
})

//Connecting to server
connectToMongoDB()

app.listen(PORT, () => {
    console.log(`Server is running on:https://localhost:${PORT}`)
})