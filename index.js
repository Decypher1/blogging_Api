const express = require('express');

require("dotenv").config()
PORT = process.env.PORT

const app = express()

app.get('/', (req, res) => {
    res.send("Welcome to homepage")
})


app.listen(PORT, () => {
    console.log(`Server is running on:https://localhost:${PORT}`)
})