document.addEventListener("DOMContentLoaded", () => {
  // Check if we're viewing applications for a specific job
  const urlParams = new URLSearchParams(window.location.search)
  const jobId = urlParams.get("job")

  if (jobId) {
    // Update page title and subtitle based on the job
    const jobTitles = {
      1: "Senior Product Designer",
      2: "Full Stack Developer",
      3: "Marketing Manager",
      4: "Customer Support Specialist",
    }

    if (jobTitles[jobId]) {
      document.getElementById("page-title").textContent = `Applications for ${jobTitles[jobId]}`
      document.getElementById("page-subtitle").textContent =
        `Review and manage applications for the ${jobTitles[jobId]} position`

      // Set the job filter to the current job
      document.getElementById("jobFilter").value = jobId

      // Filter applications to show only those for this job
      filterApplications()
    }
  }

  // Handle status buttons
  const statusButtons = document.querySelectorAll(".status-btn")

  statusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".application-card")
      const status = this.getAttribute("data-status")

      // Remove active class from all status buttons in this card
      card.querySelectorAll(".status-btn").forEach((btn) => {
        btn.classList.remove("active")
      })

      // Add active class to clicked button
      this.classList.add("active")

      // Update the status badge
      const statusBadge = card.querySelector(".status-badge")
      statusBadge.className = `status-badge ${status}`
      statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1)

      // Update the card's data-status attribute
      card.setAttribute("data-status", status)

      // Show notification
      showNotification(`Application status updated to ${status}`)
    })
  })

  // Handle notes toggle
  const notesToggleButtons = document.querySelectorAll(".notes-toggle")

  notesToggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const notesContainer = this.nextElementSibling

      if (notesContainer.style.display === "none") {
        notesContainer.style.display = "flex"
        this.innerHTML = '<i class="fas fa-sticky-note"></i> Hide Notes'
      } else {
        notesContainer.style.display = "none"

        // Check if there's text in the textarea to determine the button text
        const textarea = notesContainer.querySelector("textarea")
        if (textarea.value.trim()) {
          this.innerHTML = '<i class="fas fa-sticky-note"></i> View Notes'
        } else {
          this.innerHTML = '<i class="fas fa-sticky-note"></i> Add Notes'
        }
      }
    })
  })

  // Handle save notes buttons
  const saveNotesButtons = document.querySelectorAll(".save-notes")

  saveNotesButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const notesContainer = this.closest(".notes-container")
      const textarea = notesContainer.querySelector("textarea")
      const notesToggle = notesContainer.previousElementSibling

      // Here you would typically save the notes to your backend
      console.log("Saving notes:", textarea.value)

      // Hide the notes container
      notesContainer.style.display = "none"

      // Update the toggle button text
      if (textarea.value.trim()) {
        notesToggle.innerHTML = '<i class="fas fa-sticky-note"></i> View Notes'
        showNotification("Notes saved successfully!")
      } else {
        notesToggle.innerHTML = '<i class="fas fa-sticky-note"></i> Add Notes'
        showNotification("Notes cleared")
      }
    })
  })

  // Handle search and filters
  const searchInput = document.getElementById("searchApplications")
  const jobFilter = document.getElementById("jobFilter")
  const statusFilter = document.getElementById("statusFilter")
  const clearFiltersButton = document.getElementById("clearFilters")

  searchInput.addEventListener("input", filterApplications)
  jobFilter.addEventListener("change", filterApplications)
  statusFilter.addEventListener("change", filterApplications)

  clearFiltersButton.addEventListener("click", () => {
    searchInput.value = ""
    jobFilter.value = "all"
    statusFilter.value = "all"

    // Reset all application cards to visible
    const applicationCards = document.querySelectorAll(".application-card")
    applicationCards.forEach((card) => {
      card.style.display = ""
    })

    // Update application count
    updateApplicationCount()
  })

  // Function to filter applications based on search and filter criteria
  function filterApplications() {
    const searchTerm = searchInput.value.toLowerCase()
    const jobValue = jobFilter.value
    const statusValue = statusFilter.value

    const applicationCards = document.querySelectorAll(".application-card")

    applicationCards.forEach((card) => {
      const applicantName = card.querySelector(".applicant-details h3").textContent.toLowerCase()
      const applicantEmail = card.querySelector(".applicant-details p").textContent.toLowerCase()
      const cardJobId = card.getAttribute("data-job-id")
      const cardStatus = card.getAttribute("data-status")

      // Check if card matches all filter criteria
      const matchesSearch = applicantName.includes(searchTerm) || applicantEmail.includes(searchTerm)
      const matchesJob = jobValue === "all" || cardJobId === jobValue
      const matchesStatus = statusValue === "all" || cardStatus === statusValue

      // Show/hide card based on filter matches
      if (matchesSearch && matchesJob && matchesStatus) {
        card.style.display = ""
      } else {
        card.style.display = "none"
      }
    })

    // Update application count
    updateApplicationCount()
  }

  // Function to update the application count based on visible cards
  function updateApplicationCount() {
    const visibleCards = document.querySelectorAll('.application-card[style=""]').length
    document.getElementById("applicationsCount").textContent = visibleCards
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

  // Initialize filters if a job ID is specified
  if (jobId) {
    filterApplications()
  }
})

// Simple JavaScript for the view applications page
function viewResume() {
  alert("Opening resume... (In a real application, this would open the applicant's resume)")
}

function updateStatus(button, status) {
  const card = button.closest(".application-card")
  const statusSpan = card.querySelector(".status")

  // Update the status display
  statusSpan.className = "status " + status
  statusSpan.textContent = status.charAt(0).toUpperCase() + status.slice(1)

  // Update the data attribute for filtering
  card.setAttribute("data-status", status)

  // Disable the clicked button and enable others
  const buttons = card.querySelectorAll(".action-btn")
  buttons.forEach((btn) => {
    if (btn.classList.contains(status)) {
      btn.disabled = true
    } else if (btn.classList.contains("shortlist") || btn.classList.contains("reject")) {
      btn.disabled = false
    }
  })

  alert(`Applicant status updated to ${status}`)
}

function filterApplications() {
  const jobFilter = document.getElementById("jobFilter").value
  const statusFilter = document.getElementById("statusFilter").value
  const cards = document.querySelectorAll(".application-card")

  cards.forEach((card) => {
    const jobMatch = jobFilter === "all" || card.getAttribute("data-job") === jobFilter
    const statusMatch = statusFilter === "all" || card.getAttribute("data-status") === statusFilter

    if (jobMatch && statusMatch) {
      card.style.display = ""
    } else {
      card.style.display = "none"
    }
  })
}

