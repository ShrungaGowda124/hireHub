require('dotenv').config()
const express = require("express")

const app = express()

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server running at port ${process.env.PORT}`);
})