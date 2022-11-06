const connectToMongoDB = require('./db');
const app = require("./app")
require("dotenv").config()
PORT = process.env.PORT


//Connecting to local server
connectToMongoDB()

app.listen(PORT, () => {
    console.log(`Server is running on:https://localhost:${PORT}`)
})