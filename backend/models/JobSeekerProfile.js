const mongoose = require("mongoose");

const jobSeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRegistration",
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
  },
  experience: {
    type: String,
  },
  skills: {
    type: String,
  },
  bio: {
    type: String,
  },
  resumeName: {
    type: String,
  },
  resumeDate: {
    type: Date,
  },
  profileImage: {
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

const JobSeekerProfile = mongoose.model(
  "JobSeekerProfile",
  jobSeekerProfileSchema
);

module.exports = JobSeekerProfile;
