document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("id");

  if (!jobId) {
    showError("No job ID provided");
    return;
  }

  setupNavigation();
  loadJobDetails(jobId);
});

function setupNavigation() {
  const navLinks = document.getElementById("navLinks");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    // Not logged in
    navLinks.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="contact.html">Contact Us</a></li>
      <li><a href="SignIn.html">Login</a></li>
      <li><a href="CreateAccount.html">Create Account</a></li>
    `;
  } else if (userInfo.userType === "job_seeker") {
    // Job seeker navigation
    navLinks.innerHTML = `
      <li><a href="job-seeker-dashboard.html">Dashboard</a></li>
      <li><a href="js-my-profile.html">My Profile</a></li>
      <li><a href="js-job-listing.html">Job Listing</a></li>
      <li><a href="js-saved-jobs.html">Saved Jobs</a></li>
      <li><a href="js-applied-jobs.html">Applied Jobs</a></li>
      <li><a href="index.html" onclick="localStorage.removeItem('userInfo')">Log Out</a></li>
    `;
  } else if (userInfo.userType === "recruiter") {
    // Recruiter navigation
    navLinks.innerHTML = `
      <li><a href="recruiter-dashboard.html">Dashboard</a></li>
      <li><a href="post-job.html">Post Job</a></li>
      <li><a href="manage-jobs.html">Manage Jobs</a></li>
      <li><a href="view-applications.html">Applications</a></li>
      <li><a href="recruiter-profile.html">My Profile</a></li>
      <li><a href="index.html" onclick="localStorage.removeItem('userInfo')">Log Out</a></li>
    `;
  }
}

async function loadJobDetails(jobId) {
  try {
    const response = await fetch(`http://localhost:3000/api/jobs/${jobId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch job details");
    }

    const job = await response.json();
    displayJobDetails(job);
  } catch (error) {
    console.error("Error loading job details:", error);
    showError("Failed to load job details");
  }
}

function displayJobDetails(job) {
  // Hide loading message and show job details
  document.getElementById("loadingMessage").style.display = "none";
  document.getElementById("jobDetailsContainer").style.display = "block";

  // Set job details
  document.getElementById("jobTitle").textContent = job.title;
  document.getElementById("jobCompany").textContent = job.company;
  document.getElementById("jobLocation").textContent = job.location;
  document.getElementById("jobType").textContent = formatJobType(job.jobType);

  const postedDate = new Date(job.postedDate).toLocaleDateString();
  document.getElementById("jobPostedDate").textContent = postedDate;

  document.getElementById("jobDescription").textContent = job.description;
  document.getElementById("jobRequirements").textContent = job.requirements;
  document.getElementById(
    "jobSalary"
  ).textContent = `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()} per month`;

  // Set up action buttons based on user type
  setupActionButtons(job);
}

function setupActionButtons(job) {
  const actionsContainer = document.getElementById("jobActions");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    // Not logged in
    actionsContainer.innerHTML = `
      <a href="SignIn.html" class="action-btn apply-btn">Login to Apply</a>
    `;
  } else if (userInfo.userType === "job_seeker") {
    // Job seeker actions
    actionsContainer.innerHTML = `
      <button class="action-btn apply-btn" onclick="applyForJob('${job._id}', '${job.recruiterId}')">Apply Now</button>
      <button class="action-btn save-btn" id="saveJobBtn" onclick="saveJob('${job._id}')">Save Job</button>
    `;

    // Check if job is already saved
    checkIfJobIsSaved(job._id);

    // Check if already applied
    checkIfAlreadyApplied(job._id);
  } else if (
    userInfo.userType === "recruiter" &&
    job.recruiterId === userInfo.userId
  ) {
    // Recruiter actions (only if they own this job)
    actionsContainer.innerHTML = `
      <a href="post-job.html?edit=${job._id}" class="action-btn edit-btn">Edit Job</a>
      <button class="action-btn delete-btn" onclick="deleteJob('${job._id}')">Delete Job</button>
      <a href="view-applications.html?job=${job._id}" class="action-btn apply-btn">View Applications</a>
    `;
  }
}

async function checkIfJobIsSaved(jobId) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo) return;

  try {
    const response = await fetch(
      `http://localhost:3000/api/job-seekers/saved-jobs/${userInfo.userId}`
    );
    if (!response.ok) return;

    const savedJobs = await response.json();
    const isJobSaved = savedJobs.some(
      (savedJob) => savedJob.jobId._id === jobId
    );

    const saveButton = document.getElementById("saveJobBtn");
    if (isJobSaved && saveButton) {
      saveButton.classList.add("saved");
      saveButton.textContent = "Saved";
    }
  } catch (error) {
    console.error("Error checking saved job:", error);
  }
}

async function checkIfAlreadyApplied(jobId) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo) return;

  try {
    const response = await fetch(
      `http://localhost:3000/api/job-seekers/applications/${userInfo.userId}`
    );
    if (!response.ok) return;

    const applications = await response.json();
    const hasApplied = applications.some(
      (app) => app.jobId._id === jobId || app.jobId === jobId
    );

    const applyButton = document.querySelector(".apply-btn");
    if (hasApplied && applyButton) {
      applyButton.disabled = true;
      applyButton.textContent = "Already Applied";
      applyButton.style.backgroundColor = "#ccc";
      applyButton.style.cursor = "not-allowed";
    }
  } catch (error) {
    console.error("Error checking application status:", error);
  }
}

async function saveJob(jobId) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo) {
    alert("Please log in to save jobs");
    window.location.href = "SignIn.html";
    return;
  }

  const saveButton = document.getElementById("saveJobBtn");

  if (saveButton.classList.contains("saved")) {
    // Unsave job
    try {
      const response = await fetch(
        `http://localhost:3000/api/job-seekers/unsave-job/${jobId}/${userInfo.userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        saveButton.classList.remove("saved");
        saveButton.textContent = "Save Job";
        alert("Job removed from saved jobs");
      } else {
        alert("Failed to remove job from saved jobs");
      }
    } catch (error) {
      console.error("Error unsaving job:", error);
      alert("An error occurred. Please try again later.");
    }
  } else {
    // Save job
    try {
      const response = await fetch(
        "http://localhost:3000/api/job-seekers/save-job",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: jobId,
            userId: userInfo.userId,
          }),
        }
      );

      if (response.ok) {
        saveButton.classList.add("saved");
        saveButton.textContent = "Saved";
        alert("Job saved successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to save job");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("An error occurred. Please try again later.");
    }
  }
}

async function applyForJob(jobId, recruiterId) {
  console.log('Starting application process...');
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo) {
    console.error('No user info found in localStorage');
    alert("Please log in to apply for jobs");
    window.location.href = "SignIn.html";
    return;
  }

  try {
    console.log('Fetching user profile...');
    const profileResponse = await fetch(
      `http://localhost:3000/api/job-seekers/profile/${userInfo.userId}`
    );
    let profile = {};

    if (profileResponse.ok) {
      profile = await profileResponse.json();
      console.log('User profile fetched:', profile);
    } else {
      console.error('Profile fetch failed:', profileResponse.status, profileResponse.statusText);
    }

    // Ensure recruiterId is properly formatted
    console.log('Original recruiterId:', recruiterId);
    const recruiterIdStr = typeof recruiterId === 'object' ? recruiterId._id : recruiterId;
    console.log('Formatted recruiterId:', recruiterIdStr);

    const applicationData = {
      jobId: jobId,
      jobSeekerId: userInfo.userId,
      recruiterId: recruiterIdStr,
      resume: profile.resumeName || "resume-" + Date.now() + ".pdf",
      coverLetter: "I am interested in this position and would like to apply.",
      experience: profile.experience || "1-3 years",
      skills: profile.skills || "Various skills",
      availability: "Immediate",
      status: "new",
    };

    console.log('Preparing application data:', applicationData);

    const response = await fetch(
      "http://localhost:3000/api/job-seekers/apply",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      }
    );

    console.log('Application response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Application failed:', errorData);
      throw new Error(errorData.message || `Failed to submit application. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Application successful:', result);

    alert("Application submitted successfully!");

    const applyButton = document.querySelector(".apply-btn");
    if (applyButton) {
      applyButton.disabled = true;
      applyButton.textContent = "Already Applied";
      applyButton.style.backgroundColor = "#ccc";
      applyButton.style.cursor = "not-allowed";
    }
  } catch (error) {
    console.error("Detailed application error:", {
      error: error,
      message: error.message,
      stack: error.stack
    });
    alert(
      `Application Error: ${error.message}\n\nPlease check console for details.`
    );
  }
}

async function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job posting?")) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/recruiters/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Job deleted successfully!");
        window.location.href = "manage-jobs.html";
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("An error occurred. Please try again later.");
    }
  }
}

function formatJobType(jobType) {
  return jobType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function showError(message) {
  document.getElementById("loadingMessage").style.display = "none";
  document.getElementById("jobDetailsContainer").style.display = "none";

  const errorElement = document.getElementById("errorMessage");
  errorElement.style.display = "block";
  errorElement.querySelector("p").textContent = message;
}
