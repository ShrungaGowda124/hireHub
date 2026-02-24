const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token
    if(!token) return res.status(401).send("Please login")

    let decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
    let loggedInUser = await User.findById(decodedJWT.id)

    if (!loggedInUser) {
      throw new Error("User does not exist");
    }
    req.user = loggedInUser

    next()
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ERROR: err.message})
  }
};

module.exports = userAuth
