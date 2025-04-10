const express = require("express");
const Job = require("../models/Jobs");
const Application = require("../models/Applications");
const User = require("../models/Users");
const RecruiterProfile = require("../models/RecruiterProfile");

const router = express.Router();

// Get recruiter profile
router.get("/profile/:recruiterId", async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({
      userId: req.params.recruiterId,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Create or update recruiter profile
router.post("/profile", async (req, res) => {
  try {
    const {
      userId,
      companyName,
      industry,
      companyEmail,
      companyPhone,
      companyLocation,
      companyDescription,
      companyWebsite,
    } = req.body;

    // Check if profile already exists
    let profile = await RecruiterProfile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.companyName = companyName;
      profile.industry = industry;
      profile.companyEmail = companyEmail;
      profile.companyPhone = companyPhone;
      profile.companyLocation = companyLocation;
      profile.companyDescription = companyDescription;
      profile.companyWebsite = companyWebsite;
      profile.updatedAt = Date.now();

      await profile.save();

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    }

    // Create new profile
    profile = new RecruiterProfile({
      userId,
      companyName,
      industry,
      companyEmail,
      companyPhone,
      companyLocation,
      companyDescription,
      companyWebsite,
    });

    await profile.save();

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(400).json({ message: "Error saving profile", error });
  }
});

// Upload company logo
router.post("/profile/logo/:recruiterId", async (req, res) => {
  try {
    // In a real application, you would handle file upload here
    // For now, we'll just update the logo URL
    const { logoUrl } = req.body;

    const profile = await RecruiterProfile.findOne({
      userId: req.params.recruiterId,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.companyLogo = logoUrl;
    profile.updatedAt = Date.now();

    await profile.save();

    res.status(200).json({
      message: "Logo updated successfully",
      logoUrl: profile.companyLogo,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating logo", error });
  }
});

// Get all jobs posted by a recruiter
router.get("/jobs/:recruiterId", async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.params.recruiterId }).sort({
      postedDate: -1,
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// Post a new job
router.post("/jobs", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(400).json({ message: "Error posting job", error });
  }
});

// Update a job
router.put("/jobs/:jobId", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(400).json({ message: "Error updating job", error });
  }
});

// Delete a job
router.delete("/jobs/:jobId", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Also delete all applications for this job
    await Application.deleteMany({ jobId: req.params.jobId });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
});

// Get applications for a specific job
router.get("/applications/job/:jobId", async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("jobId", "title company location jobType")
      .populate("jobSeekerId", "firstName lastName email phone")
      .populate("recruiterId", "firstName lastName");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res
      .status(500)
      .json({ message: "Error fetching applications", error: error.message });
  }
});

// Get all applications for a recruiter
router.get("/applications/:recruiterId", async (req, res) => {
  try {
    const applications = await Application.find({
      recruiterId: req.params.recruiterId,
    })
      .populate("jobId", "title company location jobType")
      .populate("jobSeekerId", "firstName lastName email phone");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching recruiter applications:", error);
    res
      .status(500)
      .json({ message: "Error fetching applications", error: error.message });
  }
});

// Update application status
router.put("/applications/:applicationId", async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (feedback) updateData.feedback = feedback;

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.applicationId,
      updateData,
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error updating application:", error);
    res
      .status(500)
      .json({ message: "Error updating application", error: error.message });
  }
});

// Add feedback to an application
router.post("/applications/:applicationId/feedback", async (req, res) => {
  try {
    const { feedback } = req.body;

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { feedback },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error adding feedback:", error);
    res
      .status(500)
      .json({ message: "Error adding feedback", error: error.message });
  }
});

// Get recruiter dashboard stats
router.get("/stats/:recruiterId", async (req, res) => {
  try {
    const activeJobs = await Job.countDocuments({
      recruiterId: req.params.recruiterId,
      status: "active",
    });

    const totalApplications = await Application.countDocuments({
      recruiterId: req.params.recruiterId,
    });

    const newApplications = await Application.countDocuments({
      recruiterId: req.params.recruiterId,
      status: "new",
    });

    res.status(200).json({
      activeJobs,
      totalApplications,
      newApplications,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
});

module.exports = router;
