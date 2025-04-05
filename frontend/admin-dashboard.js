document.addEventListener("DOMContentLoaded", () => {
  // Fetch dashboard stats
  fetchDashboardStats();

  // Fetch recent users
  fetchRecentUsers();

  // Fetch recent jobs
  fetchRecentJobs();
});

async function fetchDashboardStats() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/stats");
    const data = await response.json();

    // Update stats on the page
    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("jobSeekers").textContent = data.jobSeekers;
    document.getElementById("recruiters").textContent = data.recruiters;
    document.getElementById("totalJobs").textContent = data.totalJobs;
    document.getElementById("activeJobs").textContent = data.activeJobs;
    document.getElementById("totalApplications").textContent =
      data.totalApplications;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
}

async function fetchRecentUsers() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/users");
    const users = await response.json();

    const recentUsersTable = document.getElementById("recentUsersTable");
    recentUsersTable.innerHTML = "";

    // Display only the 5 most recent users
    const recentUsers = users.slice(0, 5);

    recentUsers.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${user.firstName} ${user.lastName}</td>
          <td>${user.email}</td>
          <td>${formatUserType(user.userType)}</td>
          <td>
            <a href="admin-edit-user.html?id=${
              user._id
            }" class="table-action-btn view-btn">View</a>
            <button class="table-action-btn delete-btn" onclick="deleteUser('${
              user._id
            }')">Delete</button>
          </td>
        `;

      recentUsersTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
  }
}

async function fetchRecentJobs() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/jobs");
    const jobs = await response.json();

    const recentJobsTable = document.getElementById("recentJobsTable");
    recentJobsTable.innerHTML = "";

    // Display only the 5 most recent jobs
    const recentJobs = jobs.slice(0, 5);

    recentJobs.forEach((job) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${job.title}</td>
          <td>${job.company}</td>
          <td>${job.location}</td>
          <td><span class="status-badge status-${job.status}">${formatStatus(
        job.status
      )}</span></td>
          <td>
            <a href="admin-edit-job.html?id=${
              job._id
            }" class="table-action-btn view-btn">View</a>
            <button class="table-action-btn delete-btn" onclick="deleteJob('${
              job._id
            }')">Delete</button>
          </td>
        `;

      recentJobsTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
  }
}

function formatUserType(userType) {
  switch (userType) {
    case "job_seeker":
      return "Job Seeker";
    case "recruiter":
      return "Recruiter";
    case "admin":
      return "Admin";
    default:
      return userType;
  }
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

async function deleteUser(userId) {
  if (
    confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    )
  ) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("User deleted successfully");
        // Refresh the user list
        fetchRecentUsers();
        // Refresh stats
        fetchDashboardStats();
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user");
    }
  }
}

async function deleteJob(jobId) {
  if (
    confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    )
  ) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Job deleted successfully");
        // Refresh the job list
        fetchRecentJobs();
        // Refresh stats
        fetchDashboardStats();
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("An error occurred while deleting the job");
    }
  }
}
