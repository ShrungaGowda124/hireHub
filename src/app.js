require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth")
const jobsRouter = require("./routes/jobs")
const appRouter = require("./routes/applications")

const app = express();
app.use("/", authRouter)
app.use("/", jobsRouter)
app.use("/", appRouter)

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT, (req, res) => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to DB", err));
