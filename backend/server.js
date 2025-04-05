const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors"); // Import CORS

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // Middleware to parse JSON bodies

app.use(cors()); // Use CORS middleware
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve static files from the frontend directory

// Database connection
mongoose
  .connect("mongodb://localhost:27017/JSB_DB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Import routes
const userRoutes = require("./routes/UserRoutes");
const recruiterRoutes = require("./routes/RecruiterRoutes");
const jobSeekerRoutes = require("./routes/JobSeekerRoutes");
const adminRoutes = require("./routes/AdminRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/job-seekers", jobSeekerRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
