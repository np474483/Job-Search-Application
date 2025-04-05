document.addEventListener("DOMContentLoaded", () => {
  // Fetch all jobs
  fetchJobs();
});

async function fetchJobs() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/jobs");
    const jobs = await response.json();

    displayJobs(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    alert("Failed to load jobs. Please try again later.");
  }
}

function displayJobs(jobs) {
  const tableBody = document.getElementById("jobsTableBody");
  tableBody.innerHTML = "";

  jobs.forEach((job) => {
    const row = document.createElement("tr");
    const postedDate = new Date(job.postedDate).toLocaleDateString();

    row.innerHTML = `
        <td>${job.title}</td>
        <td>${job.company}</td>
        <td>${job.location}</td>
        <td>${job.category}</td>
        <td><span class="status-badge status-${job.status}">${formatStatus(
      job.status
    )}</span></td>
        <td>${postedDate}</td>
        <td>
          <a href="admin-edit-job.html?id=${
            job._id
          }" class="table-action-btn view-btn">View/Edit</a>
          <button class="table-action-btn delete-btn" onclick="deleteJob('${
            job._id
          }')">Delete</button>
        </td>
      `;

    tableBody.appendChild(row);
  });
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
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
        fetchJobs();
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

function searchJobs() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;
  const categoryFilter = document.getElementById("categoryFilter").value;

  const rows = document.querySelectorAll("#jobsTableBody tr");

  rows.forEach((row) => {
    const title = row.cells[0].textContent.toLowerCase();
    const company = row.cells[1].textContent.toLowerCase();
    const category = row.cells[3].textContent.toLowerCase();
    const status = row.cells[4].textContent.toLowerCase();

    const matchesSearch =
      title.includes(searchTerm) || company.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || status.toLowerCase() === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || category.toLowerCase() === categoryFilter;

    if (matchesSearch && matchesStatus && matchesCategory) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function filterJobs() {
  searchJobs(); // Reuse the search function which also handles filtering
}
