const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "50mb" }));

app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

mongoose
  .connect("mongodb://localhost:27017/JSB_DB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const userRoutes = require("./routes/UserRoutes");
const recruiterRoutes = require("./routes/RecruiterRoutes");
const jobSeekerRoutes = require("./routes/JobSeekerRoutes");
const jobSeekerProfileRoutes = require("./routes/JobSeekerProfileRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const jobRoutes = require("./routes/JobRoutes");

app.use("/api/users", userRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/job-seekers", jobSeekerRoutes);
app.use("/api/job-seekers", jobSeekerProfileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
