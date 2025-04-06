document.addEventListener("DOMContentLoaded", () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || userInfo.userType !== "recruiter") {
    window.location.href = "SignIn.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("job");

  if (jobId) {
    fetchApplicationsForJob(jobId);
  } else {
    fetchAllApplications(userInfo.userId);
  }

  const jobFilter = document.getElementById("jobFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (jobFilter) jobFilter.addEventListener("change", filterApplications);
  if (statusFilter) statusFilter.addEventListener("change", filterApplications);
});

async function fetchApplicationsForJob(jobId) {
  try {
    const jobResponse = await fetch(
      `http://localhost:3000/api/recruiters/jobs/${jobId}`
    );

    if (!jobResponse.ok) {
      throw new Error("Failed to fetch job details");
    }

    const job = await jobResponse.json();

    const pageTitle = document.querySelector("h1");
    if (pageTitle) {
      pageTitle.textContent = `Applications for ${job.title}`;
    }

    const applicationsResponse = await fetch(
      `http://localhost:3000/api/recruiters/applications/job/${jobId}`
    );

    if (!applicationsResponse.ok) {
      throw new Error("Failed to fetch applications");
    }

    const applications = await applicationsResponse.json();
    displayApplications(applications, job);
  } catch (error) {
    console.error("Error fetching applications:", error);
    document.querySelector(".applications-container").innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <p>Failed to load applications. Please try again later.</p>
      </div>
    `;
  }
}

async function fetchAllApplications(recruiterId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/recruiters/applications/${recruiterId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    const applications = await response.json();

    const jobsResponse = await fetch(
      `http://localhost:3000/api/recruiters/jobs/${recruiterId}`
    );

    if (!jobsResponse.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const jobs = await jobsResponse.json();

    populateJobFilter(jobs);

    displayApplications(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    document.querySelector(".applications-container").innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <p>Failed to load applications. Please try again later.</p>
      </div>
    `;
  }
}

function populateJobFilter(jobs) {
  const jobFilter = document.getElementById("jobFilter");

  if (!jobFilter) return;

  while (jobFilter.options.length > 1) {
    jobFilter.remove(1);
  }

  jobs.forEach((job) => {
    const option = document.createElement("option");
    option.value = job._id;
    option.textContent = job.title;
    jobFilter.appendChild(option);
  });
}

function displayApplications(applications, job = null) {
  const container = document.querySelector(".applications-container");

  if (applications.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <p>No applications found${job ? ` for ${job.title}` : ""}.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  applications.forEach((application) => {
    const appliedDate = new Date(application.appliedDate).toLocaleDateString();

    const jobTitle = job
      ? job.title
      : application.jobId
      ? application.jobId.title
      : "Unknown Job";

    const applicant = application.jobSeekerId || {};
    const applicantName =
      `${applicant.firstName || ""} ${applicant.lastName || ""}`.trim() ||
      "Unknown Applicant";

    const card = document.createElement("div");
    card.className = "application-card";
    card.setAttribute(
      "data-job",
      job ? job._id : application.jobId ? application.jobId._id : ""
    );
    card.setAttribute("data-status", application.status);

    card.innerHTML = `
      <div class="applicant-info">
        <h3>${applicantName}</h3>
        <p class="applicant-email">${applicant.email || "No email provided"}</p>
        <p class="applicant-phone">${applicant.phone || "No phone provided"}</p>
      </div>
      <div class="application-details">
        <p class="job-applied">Applied for: <strong>${jobTitle}</strong></p>
        <p class="application-date">Applied on: ${appliedDate}</p>
        <p class="application-status">Status: <span class="status ${
          application.status
        }">${formatStatus(application.status)}</span></p>
      </div>
      <div class="application-actions">
        <button class="action-btn view" onclick="viewResume('${
          application._id
        }')">View Resume</button>
        <button class="action-btn shortlist" onclick="updateStatus('${
          application._id
        }', 'shortlisted', this)" ${
      application.status === "shortlisted" ? "disabled" : ""
    }>Shortlist</button>
        <button class="action-btn reject" onclick="updateStatus('${
          application._id
        }', 'rejected', this)" ${
      application.status === "rejected" ? "disabled" : ""
    }>Reject</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function filterApplications() {
  const jobFilter = document.getElementById("jobFilter");
  const statusFilter = document.getElementById("statusFilter");

  const jobValue = jobFilter ? jobFilter.value : "all";
  const statusValue = statusFilter ? statusFilter.value : "all";

  const cards = document.querySelectorAll(".application-card");

  cards.forEach((card) => {
    const jobMatch =
      jobValue === "all" || card.getAttribute("data-job") === jobValue;
    const statusMatch =
      statusValue === "all" || card.getAttribute("data-status") === statusValue;

    if (jobMatch && statusMatch) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function viewResume(applicationId) {
  alert(
    "Viewing resume... (In a real application, this would open the applicant's resume file)"
  );
}

async function updateStatus(applicationId, status, button) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/recruiters/applications/${applicationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    const card = button.closest(".application-card");
    const statusSpan = card.querySelector(".status");

    statusSpan.className = `status ${status}`;
    statusSpan.textContent = formatStatus(status);

    card.setAttribute("data-status", status);

    const buttons = card.querySelectorAll(".action-btn");
    buttons.forEach((btn) => {
      if (btn.classList.contains(status)) {
        btn.disabled = true;
      } else if (
        btn.classList.contains("shortlist") ||
        btn.classList.contains("reject")
      ) {
        btn.disabled = false;
      }
    });

    alert(`Application status updated to ${formatStatus(status)}`);
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update application status");
  }
}
