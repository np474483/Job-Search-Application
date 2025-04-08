const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  salary: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  jobType: {
    type: String,
    required: true,
    enum: ["full-time", "part-time", "contract", "internship"],
  },
  category: {
    type: String,
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRegistration",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "closed"],
    default: "active",
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
