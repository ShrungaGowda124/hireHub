const mongoose = require("mongoose");
const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    candidateId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: {
        values: ["Applied", "Shortlisted", "Rejected"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true },
);

//Unique compound index: (jobId + candidateId)
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema)
module.exports = Application