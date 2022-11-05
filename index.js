const connectToMongoDB = require('./db');
const app = require("./app")
require("dotenv").config()
PORT = process.env.PORT


app.get('/', (req, res) => {
    res.send("Welcome to my homepage, Please Signup or login")
})

//Connecting to local server
connectToMongoDB()

app.listen(PORT, () => {
    console.log(`Server is running on:https://localhost:${PORT}`)
})