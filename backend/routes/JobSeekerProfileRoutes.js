const express = require("express");
const router = express.Router();
const JobSeekerProfile = require("../models/JobSeekerProfile");
const Education = require("../models/Education");
const Experience = require("../models/Experience");

// Get job seeker profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({
      userId: req.params.userId,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Create or update job seeker profile
router.post("/profile", async (req, res) => {
  try {
    const { userId, firstName, lastName, email, phone, location } = req.body;

    // Check if profile already exists
    let profile = await JobSeekerProfile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.email = email;
      profile.phone = phone;
      profile.location = location;
      profile.updatedAt = Date.now();

      await profile.save();

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    }

    // Create new profile
    profile = new JobSeekerProfile({
      userId,
      firstName,
      lastName,
      email,
      phone,
      location,
    });

    await profile.save();

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error saving profile", error: error.message });
  }
});

// Update professional information
router.post("/professional", async (req, res) => {
  try {
    const { userId, jobTitle, experience, skills, bio } = req.body;

    // Find profile
    const profile = await JobSeekerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update professional info
    profile.jobTitle = jobTitle;
    profile.experience = experience;
    profile.skills = skills;
    profile.bio = bio;
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      message: "Professional information updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Error updating professional information",
        error: error.message,
      });
  }
});

// Add education
router.post("/education", async (req, res) => {
  try {
    const { userId, degree, institution, startYear, endYear } = req.body;

    const education = new Education({
      userId,
      degree,
      institution,
      startYear,
      endYear,
    });

    await education.save();

    res.status(201).json({
      message: "Education added successfully",
      education,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding education", error: error.message });
  }
});

// Get all education for a user
router.get("/education/:userId", async (req, res) => {
  try {
    const education = await Education.find({ userId: req.params.userId }).sort({
      endYear: -1,
    });

    res.status(200).json(education);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching education", error: error.message });
  }
});

// Delete education
router.delete("/education/:id", async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting education", error: error.message });
  }
});

// Add experience
router.post("/experience", async (req, res) => {
  try {
    const {
      userId,
      position,
      company,
      startDate,
      endDate,
      description,
      currentJob,
    } = req.body;

    const experience = new Experience({
      userId,
      position,
      company,
      startDate,
      endDate,
      description,
      currentJob,
    });

    await experience.save();

    res.status(201).json({
      message: "Experience added successfully",
      experience,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding experience", error: error.message });
  }
});

// Get all experience for a user
router.get("/experience/:userId", async (req, res) => {
  try {
    const experience = await Experience.find({
      userId: req.params.userId,
    }).sort({ startDate: -1 });

    res.status(200).json(experience);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching experience", error: error.message });
  }
});

// Delete experience
router.delete("/experience/:id", async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting experience", error: error.message });
  }
});

// Update resume info
router.post("/resume", async (req, res) => {
  try {
    const { userId, resumeName, resumeDate } = req.body;

    // Find profile
    const profile = await JobSeekerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update resume info
    profile.resumeName = resumeName;
    profile.resumeDate = resumeDate;
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      message: "Resume information updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Error updating resume information",
        error: error.message,
      });
  }
});

// Update profile image
router.post("/profile-image", async (req, res) => {
  try {
    const { userId, profileImage } = req.body;

    // Find profile
    const profile = await JobSeekerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update profile image
    profile.profileImage = profileImage;
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      message: "Profile image updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating profile image", error: error.message });
  }
});

module.exports = router;
