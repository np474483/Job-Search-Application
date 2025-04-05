document.addEventListener("DOMContentLoaded", () => {
  // Handle delete job buttons
  const deleteButtons = document.querySelectorAll(".delete-job")

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const jobId = this.getAttribute("data-job-id")

      if (confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
        // Here you would typically make an API call to delete the job
        console.log(`Deleting job with ID: ${jobId}`)

        // For demo purposes, we'll just remove the job row from the table
        const jobRow = this.closest("tr")
        jobRow.style.opacity = "0"
        setTimeout(() => {
          jobRow.remove()

          // Update the job count
          const jobCountElement = document.getElementById("jobCount")
          const currentCount = Number.parseInt(jobCountElement.textContent)
          jobCountElement.textContent = currentCount - 1

          showNotification("Job posting deleted successfully!")
        }, 300)
      }
    })
  })

  // Handle search functionality
  const searchInput = document.getElementById("searchJobs")
  searchInput.addEventListener("input", filterJobs)

  // Handle filter dropdowns
  const statusFilter = document.getElementById("statusFilter")
  const categoryFilter = document.getElementById("categoryFilter")

  statusFilter.addEventListener("change", filterJobs)
  categoryFilter.addEventListener("change", filterJobs)

  // Handle clear filters button
  const clearFiltersButton = document.getElementById("clearFilters")
  clearFiltersButton.addEventListener("click", () => {
    searchInput.value = ""
    statusFilter.value = "all"
    categoryFilter.value = "all"

    // Reset all table rows to visible
    const tableRows = document.querySelectorAll("#jobsTableBody tr")
    tableRows.forEach((row) => {
      row.style.display = ""
    })

    // Update job count
    updateJobCount()
  })

  // Function to filter jobs based on search and filter criteria
  function filterJobs() {
    const searchTerm = searchInput.value.toLowerCase()
    const statusValue = statusFilter.value
    const categoryValue = categoryFilter.value

    const tableRows = document.querySelectorAll("#jobsTableBody tr")

    tableRows.forEach((row) => {
      const jobTitle = row.querySelector(".job-title").textContent.toLowerCase()
      const jobLocation = row.querySelector("td:nth-child(3)").textContent.toLowerCase()
      const jobCategory = row.querySelector("td:nth-child(2)").textContent.toLowerCase()
      const jobStatus = row.querySelector(".status-badge").classList.contains(statusValue)

      // Check if row matches all filter criteria
      const matchesSearch = jobTitle.includes(searchTerm) || jobLocation.includes(searchTerm)
      const matchesStatus = statusValue === "all" || row.querySelector(".status-badge").classList.contains(statusValue)
      const matchesCategory = categoryValue === "all" || jobCategory.includes(categoryValue.replace("_", " "))

      // Show/hide row based on filter matches
      if (matchesSearch && matchesStatus && matchesCategory) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })

    // Update job count
    updateJobCount()
  }

  // Function to update the job count based on visible rows
  function updateJobCount() {
    const visibleRows = document.querySelectorAll('#jobsTableBody tr[style=""]').length
    document.getElementById("jobCount").textContent = visibleRows
  }

  // Function to show notifications
  function showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Add to body
    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 3000)
  }

  // Add CSS for notifications
  const style = document.createElement("style")
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
    `
  document.head.appendChild(style)
})

// Simple JavaScript for the manage jobs page
function confirmDelete(jobId) {
  if (confirm("Are you sure you want to delete this job posting?")) {
    alert("Job deleted successfully!")
    // In a real application, you would send a request to your backend here
    // For now, we'll just hide the element for demonstration
    const jobItem = event.target.closest(".job-item")
    if (jobItem) {
      jobItem.style.display = "none"
    }
  }
}

function searchJobs() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const jobItems = document.querySelectorAll(".job-item")

  jobItems.forEach((item) => {
    const jobTitle = item.querySelector("h3").textContent.toLowerCase()
    const jobDetails = item.querySelector(".job-details").textContent.toLowerCase()

    if (jobTitle.includes(searchTerm) || jobDetails.includes(searchTerm)) {
      item.style.display = ""
    } else {
      item.style.display = "none"
    }
  })
}

