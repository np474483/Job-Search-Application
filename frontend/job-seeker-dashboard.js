// Job Seeker Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  if (!userInfo || userInfo.userType !== "job_seeker") {
    window.location.href = "SignIn.html"
    return
  }

  // Set user name in welcome message
  document.getElementById("userName").textContent = `${userInfo.firstName} ${userInfo.lastName}`

  // Fetch recommended jobs
  fetchRecommendedJobs()

  // Fetch user activity stats
  fetchUserStats(userInfo.userId)
})

async function fetchRecommendedJobs() {
  try {
    const response = await fetch("http://localhost:3000/api/job-seekers/jobs")
    if (!response.ok) {
      throw new Error("Failed to fetch jobs")
    }

    const jobs = await response.json()
    displayJobs(jobs.slice(0, 3)) // Display only first 3 jobs as recommendations
  } catch (error) {
    console.error("Error fetching recommended jobs:", error)
    document.querySelector(".job-list").innerHTML = `
      <div class="error-message">
        <p>Failed to load recommended jobs. Please try again later.</p>
      </div>
    `
  }
}

function displayJobs(jobs) {
  const jobListContainer = document.querySelector(".job-list")

  if (jobs.length === 0) {
    jobListContainer.innerHTML = `
      <div class="no-jobs-message">
        <p>No jobs available at the moment. Please check back later.</p>
      </div>
    `
    return
  }

  jobListContainer.innerHTML = ""

  jobs.forEach((job) => {
    const jobCard = document.createElement("div")
    jobCard.className = "job-card"

    jobCard.innerHTML = `
      <h3>${job.title}</h3>
      <p class="company-name">${job.company}</p>
      <p class="job-location">${job.location}</p>
      <p class="job-type">${formatJobType(job.jobType)}</p>
      <p class="job-salary">₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()} per month</p>
      <div class="job-actions">
        <button class="save-btn" onclick="saveJob('${job._id}', this)">Save Job</button>
        <button class="apply-btn" onclick="applyForJob('${job._id}')">Apply Now</button>
      </div>
    `

    jobListContainer.appendChild(jobCard)
  })

  // Check if any jobs are saved
  checkSavedJobs()
}

function formatJobType(jobType) {
  return jobType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

async function fetchUserStats(userId) {
  try {
    // Fetch applied jobs count
    const appliedResponse = await fetch(`http://localhost:3000/api/job-seekers/applications/${userId}`)
    const appliedJobs = await appliedResponse.json()

    // Fetch saved jobs count
    const savedResponse = await fetch(`http://localhost:3000/api/job-seekers/saved-jobs/${userId}`)
    const savedJobs = await savedResponse.json()

    // Update stats on the page
    document.getElementById("appliedJobsCount").textContent = appliedJobs.length
    document.getElementById("savedJobsCount").textContent = savedJobs.length

    // For interviews, we could add this feature later
    // For now, we'll just show 0
    document.getElementById("interviewsCount").textContent = "0"
  } catch (error) {
    console.error("Error fetching user stats:", error)
  }
}

async function saveJob(jobId, button) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  if (!userInfo) {
    alert("Please log in to save jobs")
    window.location.href = "SignIn.html"
    return
  }

  try {
    if (button.classList.contains("saved")) {
      // Unsave job
      const response = await fetch(`http://localhost:3000/api/job-seekers/unsave-job/${jobId}/${userInfo.userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        button.classList.remove("saved")
        button.textContent = "Save Job"

        // Update saved jobs count
        const savedCountElement = document.getElementById("savedJobsCount")
        const currentCount = Number.parseInt(savedCountElement.textContent)
        savedCountElement.textContent = Math.max(0, currentCount - 1)

        alert("Job removed from saved jobs")
      } else {
        alert("Failed to remove job from saved jobs")
      }
    } else {
      // Save job
      const response = await fetch("http://localhost:3000/api/job-seekers/save-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: jobId,
          userId: userInfo.userId,
        }),
      })

      if (response.ok) {
        button.classList.add("saved")
        button.textContent = "Saved"

        // Update saved jobs count
        const savedCountElement = document.getElementById("savedJobsCount")
        const currentCount = Number.parseInt(savedCountElement.textContent)
        savedCountElement.textContent = currentCount + 1

        alert("Job saved successfully!")
      } else {
        const data = await response.json()
        alert(data.message || "Failed to save job")
      }
    }
  } catch (error) {
    console.error("Error saving/unsaving job:", error)
    alert("An error occurred. Please try again later.")
  }
}

async function applyForJob(jobId) {
  // Store the job ID in session storage to use on the application page
  sessionStorage.setItem("applyingForJobId", jobId)
  window.location.href = "js-job-application.html?job=" + jobId
}

async function checkSavedJobs() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  if (!userInfo) return

  try {
    const response = await fetch(`http://localhost:3000/api/job-seekers/saved-jobs/${userInfo.userId}`)
    const savedJobs = await response.json()

    // Get all save buttons
    const saveButtons = document.querySelectorAll(".save-btn")

    // Create a set of saved job IDs for faster lookup
    const savedJobIds = new Set(savedJobs.map((job) => job.jobId))

    // Update button state for each job
    saveButtons.forEach((button) => {
      const jobId = button.onclick.toString().match(/'([^']+)'/)[1]

      if (savedJobIds.has(jobId)) {
        button.classList.add("saved")
        button.textContent = "Saved"
      }
    })
  } catch (error) {
    console.error("Error checking saved jobs:", error)
  }
}

function searchJobs() {
  alert("Searching for jobs... (In a real application, this would search for jobs based on your criteria)")
  // This would be implemented to search jobs from the database
}

