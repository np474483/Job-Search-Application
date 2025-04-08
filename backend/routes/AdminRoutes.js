const express = require("express");
const User = require("../models/Users");
const Job = require("../models/Jobs");
const Application = require("../models/Applications");

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, userType: "admin" });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get user by ID
router.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Update user
router.put("/users/:userId", async (req, res) => {
  try {
    // Don't allow updating password through this route for security
    const { password, ...updateData } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updateData,
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
});

// Update user status (activate/deactivate)
router.put("/users/:userId/status", async (req, res) => {
  try {
    const { isActive } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating user status", error });
  }
});

// Delete user
router.delete("/users/:userId", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete all jobs and applications associated with this user
    if (deletedUser.userType === "recruiter") {
      const jobs = await Job.find({ recruiterId: req.params.userId });

      // Delete all applications for these jobs
      for (const job of jobs) {
        await Application.deleteMany({ jobId: job._id });
      }

      // Delete all jobs
      await Job.deleteMany({ recruiterId: req.params.userId });
    } else if (deletedUser.userType === "job_seeker") {
      // Delete all applications by this job seeker
      await Application.deleteMany({ jobSeekerId: req.params.userId });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Get all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate(
      "recruiterId",
      "firstName lastName email"
    );
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// Get job by ID
router.get("/jobs/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "recruiterId",
      "firstName lastName email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
});

// Update job status
router.put("/jobs/:jobId/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "expired", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      { status },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job status updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating job status", error });
  }
});

// Flag/unflag job
router.put("/jobs/:jobId/flag", async (req, res) => {
  try {
    const { isFlagged } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      { isFlagged },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: `Job ${isFlagged ? "flagged" : "unflagged"} successfully`,
      job: updatedJob,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating job flag status", error });
  }
});

// Delete job
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

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const jobSeekers = await User.countDocuments({ userType: "job_seeker" });
    const recruiters = await User.countDocuments({ userType: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      totalUsers,
      jobSeekers,
      recruiters,
      totalJobs,
      activeJobs,
      totalApplications,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
});

module.exports = router;
