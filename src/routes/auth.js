const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bodyParser = require("body-parser");
const { validateSignupData } = require("../utils/helpers");
const bcrypt = require("bcrypt");
const getJWT = require("../controllers/authController");
const saltRounds = 10;

router.use(bodyParser.json());

router.post("/signup", async (req, res) => {
  try {
    let { firstName, lastName, emailId, password, role } = req.body;
    validateSignupData(req);

    let hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      role,
    });
    let isExistingUser = await User.find({ emailId });

    if (isExistingUser.length !== 0) throw new Error("User already exist");

    let data = await newUser.save();
    res.status(201).json({
      message: "User added",
      data: {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        emailId: data.emailId,
        role: data.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ERROR: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    let user = await User.findOne({ emailId });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    let token = await getJWT(user._id);

    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ERROR: err.message });
  }
});

module.exports = router;
