const express = require("express");
const Job = require("../models/Jobs");
const Application = require("../models/Applications");
const SavedJob = require("../models/SavedJobs");

const router = express.Router();

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" }).populate(
      "recruiterId",
      "firstName lastName"
    );
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

router.get("/jobs/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate(
      "recruiterId",
      "firstName lastName"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job details", error });
  }
});

router.post("/apply", async (req, res) => {
  try {
    const {
      jobId,
      jobSeekerId,
      recruiterId,
      resume,
      coverLetter,
      experience,
      skills,
      availability,
    } = req.body;

    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const newApplication = new Application({
      jobId,
      jobSeekerId,
      recruiterId,
      resume,
      coverLetter,
      experience,
      skills,
      availability,
    });

    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    res.status(400).json({ message: "Error submitting application", error });
  }
});

router.get("/applications/:jobSeekerId", async (req, res) => {
  try {
    const applications = await Application.find({
      jobSeekerId: req.params.jobSeekerId,
    })
      .populate("jobId", "title company location jobType")
      .populate("recruiterId", "firstName lastName");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
});

router.post("/save-job", async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    const existingSavedJob = await SavedJob.findOne({
      jobId,
      userId,
    });

    if (existingSavedJob) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const newSavedJob = new SavedJob({
      jobId,
      userId,
    });

    await newSavedJob.save();

    res.status(201).json({
      message: "Job saved successfully",
      savedJob: newSavedJob,
    });
  } catch (error) {
    res.status(400).json({ message: "Error saving job", error });
  }
});

router.delete("/unsave-job/:jobId/:userId", async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    const deletedSavedJob = await SavedJob.findOneAndDelete({
      jobId,
      userId,
    });

    if (!deletedSavedJob) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    res.status(200).json({ message: "Job removed from saved jobs" });
  } catch (error) {
    res.status(500).json({ message: "Error removing saved job", error });
  }
});

router.get("/saved-jobs/:userId", async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      userId: req.params.userId,
    }).populate({
      path: "jobId",
      populate: {
        path: "recruiterId",
        select: "firstName lastName",
      },
    });

    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved jobs", error });
  }
});

module.exports = router;
