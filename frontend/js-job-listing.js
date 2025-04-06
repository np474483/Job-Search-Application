// Simple JavaScript for the job listing page
function searchJobs() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const jobCards = document.querySelectorAll(".job-card");

  jobCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const company = card
      .querySelector(".company-name")
      .textContent.toLowerCase();
    const description = card
      .querySelector(".job-description")
      .textContent.toLowerCase();

    if (
      title.includes(searchTerm) ||
      company.includes(searchTerm) ||
      description.includes(searchTerm)
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function filterJobs() {
  const locationFilter = document.getElementById("locationFilter").value;
  const jobTypeFilter = document.getElementById("jobTypeFilter").value;
  const jobCards = document.querySelectorAll(".job-card");

  jobCards.forEach((card) => {
    const location = card.getAttribute("data-location");
    const jobType = card.getAttribute("data-type");

    const locationMatch =
      locationFilter === "all" || location === locationFilter;
    const jobTypeMatch = jobTypeFilter === "all" || jobType === jobTypeFilter;

    if (locationMatch && jobTypeMatch) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function saveJob(jobId, button) {
  if (button.classList.contains("saved")) {
    button.classList.remove("saved");
    button.textContent = "Save Job";
    alert("Job removed from saved jobs");
  } else {
    button.classList.add("saved");
    button.textContent = "Saved";
    alert("Job saved successfully!");
  }
}

function applyForJob(jobId) {
  window.location.href = "job-details.html?id=" + jobId;
}
