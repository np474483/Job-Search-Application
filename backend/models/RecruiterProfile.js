const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRegistration",
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  companyPhone: {
    type: String,
    required: true,
  },
  companyLocation: {
    type: String,
    required: true,
  },
  companyDescription: {
    type: String,
    required: true,
  },
  companyWebsite: {
    type: String,
  },
  companyLogo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const RecruiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema
);

module.exports = RecruiterProfile;
