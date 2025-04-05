document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || userInfo.userType !== "recruiter") {
    window.location.href = "SignIn.html";
    return;
  }

  // Check if we're in edit mode
  const urlParams = new URLSearchParams(window.location.search);
  const editJobId = urlParams.get("edit");

  if (editJobId) {
    // We're in edit mode
    document.getElementById("page-title").textContent = "Edit Job Posting";
    document.getElementById("page-subtitle").textContent =
      "Update the details of your job listing";
    document.getElementById("submitButton").textContent = "Update Job";

    // Load job data
    loadJobData(editJobId);
  } else {
    // We're in create mode
    // Pre-fill company name if available
    loadCompanyInfo(userInfo.userId);
  }

  // Handle form submission
  const jobForm = document.getElementById("jobForm");
  jobForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Show loading state
        const submitButton = document.getElementById("submitButton");
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = editJobId ? "Updating..." : "Posting...";
        submitButton.disabled = true;

        // Get form data
        const formData = new FormData(jobForm);

        // Create job data object
        const jobData = {
          title: formData.get("title"),
          company: formData.get("company"),
          category: formData.get("category"),
          jobType: formData.get("jobType"),
          salary: {
            min: Number.parseInt(formData.get("salaryMin")),
            max: Number.parseInt(formData.get("salaryMax")),
          },
          location: formData.get("location"),
          description: formData.get("description"),
          requirements: formData.get("requirements"),
          recruiterId: userInfo.userId,
          status: "active",
        };

        let response;

        if (editJobId) {
          // Update existing job
          response = await fetch(
            `http://localhost:3000/api/recruiters/jobs/${editJobId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jobData),
            }
          );
        } else {
          // Create new job
          response = await fetch("http://localhost:3000/api/recruiters/jobs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jobData),
          });
        }

        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;

        if (!response.ok) {
          throw new Error("Failed to save job");
        }

        const data = await response.json();

        // Show success message
        showNotification(
          editJobId ? "Job updated successfully!" : "Job posted successfully!"
        );

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "recruiter-dashboard.html";
        }, 1500);
      } catch (error) {
        console.error("Error saving job:", error);
        showNotification("Error saving job. Please try again.", "error");

        // Reset button state
        const submitButton = document.getElementById("submitButton");
        submitButton.textContent = editJobId ? "Update Job" : "Post Job";
        submitButton.disabled = false;
      }
    }
  });

  // Handle cancel button
  const cancelButton = document.getElementById("cancelButton");
  cancelButton.addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      window.location.href = "recruiter-dashboard.html";
    }
  });
});

async function loadCompanyInfo(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/recruiters/profile/${userId}`
    );

    if (response.status === 404) {
      // Profile doesn't exist yet, that's okay
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to load company info");
    }

    const profile = await response.json();

    // Pre-fill company name
    document.getElementById("company").value = profile.companyName || "";
  } catch (error) {
    console.error("Error loading company info:", error);
  }
}

async function loadJobData(jobId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/recruiters/jobs/${jobId}`
    );

    if (!response.ok) {
      throw new Error("Failed to load job data");
    }

    const job = await response.json();

    // Populate form fields
    document.getElementById("title").value = job.title || "";
    document.getElementById("company").value = job.company || "";
    document.getElementById("category").value = job.category || "";
    document.getElementById("jobType").value = job.jobType || "";
    document.getElementById("salaryMin").value = job.salary?.min || "";
    document.getElementById("salaryMax").value = job.salary?.max || "";
    document.getElementById("location").value = job.location || "";
    document.getElementById("description").value = job.description || "";
    document.getElementById("requirements").value = job.requirements || "";
  } catch (error) {
    console.error("Error loading job data:", error);
    showNotification("Error loading job data. Please try again.", "error");
  }
}

function validateForm() {
  // Get form fields
  const title = document.getElementById("title").value.trim();
  const company = document.getElementById("company").value.trim();
  const category = document.getElementById("category").value;
  const jobType = document.getElementById("jobType").value;
  const salaryMin = document.getElementById("salaryMin").value.trim();
  const salaryMax = document.getElementById("salaryMax").value.trim();
  const location = document.getElementById("location").value.trim();
  const description = document.getElementById("description").value.trim();
  const requirements = document.getElementById("requirements").value.trim();

  // Validate required fields
  if (!title) {
    showNotification("Please enter a job title", "error");
    return false;
  }

  if (!company) {
    showNotification("Please enter a company name", "error");
    return false;
  }

  if (!category) {
    showNotification("Please select a job category", "error");
    return false;
  }

  if (!jobType) {
    showNotification("Please select a job type", "error");
    return false;
  }

  if (!salaryMin || !salaryMax) {
    showNotification("Please enter both minimum and maximum salary", "error");
    return false;
  }

  if (!location) {
    showNotification("Please enter a job location", "error");
    return false;
  }

  if (!description) {
    showNotification("Please enter a job description", "error");
    return false;
  }

  if (!requirements) {
    showNotification("Please enter required skills", "error");
    return false;
  }

  // Validate salary
  if (Number.parseInt(salaryMin) > Number.parseInt(salaryMax)) {
    showNotification(
      "Minimum salary cannot be greater than maximum salary",
      "error"
    );
    return false;
  }

  return true;
}

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add to body
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add CSS for notifications
const style = document.createElement("style");
style.textContent = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    z-index: 1000;
    transform: translateY(-20px);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
  }
  
  .notification.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .notification.success {
    background-color: #10b981;
  }
  
  .notification.error {
    background-color: #ef4444;
  }
`;
document.head.appendChild(style);
