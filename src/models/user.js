const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["Candidate", "Recruiter"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true },
);

// TO DO: check for min length of firstName and lastName

const User = mongoose.model("User", userSchema);
module.exports = User;
