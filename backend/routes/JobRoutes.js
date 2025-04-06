const express = require("express");
const Job = require("../models/Jobs");

const router = express.Router();

router.get("/recent", async (req, res) => {
  try {
    const recentJobs = await Job.find({ status: "active" })
      .sort({ postedDate: -1 })
      .limit(10)
      .populate("recruiterId", "firstName lastName");

    res.status(200).json(recentJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent jobs", error });
  }
});

router.get("/:jobId", async (req, res) => {
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
    res.status(500).json({ message: "Error fetching job", error });
  }
});

module.exports = router;
