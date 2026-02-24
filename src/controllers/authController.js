const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
let User = require("../models/user");

const getJWT = async (id) => {
  try {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return token;
  } catch (err) {
    console.error(err);
  }
};

module.exports = getJWT;
