document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || userInfo.userType !== "job_seeker") {
    window.location.href = "SignIn.html";
    return;
  }

  // Fetch applied jobs from database
  fetchAppliedJobs(userInfo.userId);

  // Set up modal
  const modal = document.getElementById("messageModal");
  const closeBtn = document.getElementsByClassName("close")[0];

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

async function fetchAppliedJobs(userId) {
  try {
    const loadingElement = document.getElementById("loadingJobs");
    loadingElement.style.display = "block";

    const response = await fetch(
      `http://localhost:3000/api/job-seekers/applications/${userId}`
    );

    loadingElement.style.display = "none";

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    const applications = await response.json();
    displayAppliedJobs(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    document.getElementById("loadingJobs").style.display = "none";
    document.getElementById("jobList").innerHTML = `
      <div class="error-message">
        <p>Failed to load applications. Please try again later.</p>
      </div>
    `;
  }
}

function displayAppliedJobs(applications) {
  const jobList = document.getElementById("jobList");
  jobList.innerHTML = "";

  if (applications.length === 0) {
    document.getElementById("noJobsMessage").style.display = "block";
    return;
  }

  document.getElementById("noJobsMessage").style.display = "none";

  applications.forEach((application) => {
    // Check if jobId is an object (populated) or just an ID
    const job =
      typeof application.jobId === "object"
        ? application.jobId
        : {
            title: "Job Title",
            company: "Company",
            location: "Location",
            jobType: "full-time",
          };

    const appliedDate = new Date(application.appliedDate).toLocaleDateString();

    const jobCard = document.createElement("div");
    jobCard.className = "job-card";

    jobCard.innerHTML = `
      <h3>${job.title}</h3>
      <p class="company-name">${job.company}</p>
      <p class="job-location">${job.location}</p>
      <p class="job-type">${formatJobType(job.jobType)}</p>
      <p class="applied-date">Applied on: ${appliedDate}</p>
      <div class="status-container">
        <p class="status-label">Status:</p>
        <span class="status-badge ${application.status}">${formatStatus(
      application.status
    )}</span>
      </div>
      <div class="job-actions">
        <a href="job-details.html?id=${
          typeof application.jobId === "object"
            ? application.jobId._id
            : application.jobId
        }" class="view-details-btn">View Job Details</a>
        ${
          application.message
            ? `<button class="message-btn" onclick="viewMessage('${application._id}')">View Message</button>`
            : ""
        }
      </div>
    `;

    jobList.appendChild(jobCard);
  });
}

function viewMessage(applicationId) {
  // In a real app, you would fetch the message from the database
  // For now, we'll just show a sample message
  const modal = document.getElementById("messageModal");
  const messageContent = document.getElementById("messageContent");

  // Sample messages based on application status
  const messages = {
    new: "Thank you for your application. We are currently reviewing your profile and will get back to you soon.",
    reviewed:
      "We have reviewed your application and are impressed with your profile. We would like to schedule an interview with you. Please check your email for details.",
    shortlisted:
      "Congratulations! You have been shortlisted for the next round. Our HR team will contact you shortly to schedule an interview.",
    rejected:
      "Thank you for your interest in our company. After careful consideration, we have decided to move forward with other candidates whose qualifications better match our current needs.",
  };

  // Get the application status from the DOM
  const statusBadge = document
    .querySelector(
      `.job-card button[onclick="viewMessage('${applicationId}')"]`
    )
    .closest(".job-card")
    .querySelector(".status-badge");

  const status = statusBadge.classList[1];

  messageContent.innerHTML = `<p>${messages[status]}</p>`;
  modal.style.display = "block";
}

function formatJobType(jobType) {
  if (!jobType) return "Not specified";
  return jobType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatStatus(status) {
  const statusMap = {
    new: "New",
    reviewed: "Under Review",
    shortlisted: "Interview Scheduled",
    rejected: "Rejected",
  };

  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}
