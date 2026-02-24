const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
}

module.exports = connectDB
