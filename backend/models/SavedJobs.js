const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRegistration",
    required: true,
  },
  savedDate: {
    type: Date,
    default: Date.now,
  },
});

const SavedJob = mongoose.model("SavedJob", savedJobSchema);

module.exports = SavedJob;
