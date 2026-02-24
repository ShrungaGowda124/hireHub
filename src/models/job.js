const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobSchehma = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: "true" },
    description: { type: String, required: "true" },
    company: { type: String, required: "true" },
    salary: { type: Number, default: null },
    location: { type: String, required: "true" },
    skills: { type: [String], required: "true" },
  },
  { timestamps: true },
);

const Job = mongoose.model("Job", jobSchehma);
module.exports = Job;
