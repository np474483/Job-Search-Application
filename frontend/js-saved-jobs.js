// Simple JavaScript for the saved jobs page
function removeJob(jobId, button) {
    if (confirm("Are you sure you want to remove this job from your saved jobs?")) {
      const jobCard = button.closest(".job-card")
      jobCard.style.display = "none"
  
      // Check if there are any visible job cards left
      const visibleCards = document.querySelectorAll('.job-card[style=""]')
      if (visibleCards.length === 0) {
        document.getElementById("noJobsMessage").style.display = "block"
      }
  
      alert("Job removed from saved jobs")
    }
  }
  
  function applyForJob(jobId) {
    alert("Redirecting to application form... (In a real application, this would take you to the job application page)")
    // In a real application, you would redirect to an application form
    window.location.href = "js-job-application.html?job=" + jobId
  }
  
  // Check if there are any job cards on page load
  window.addEventListener("load", () => {
    const jobCards = document.querySelectorAll(".job-card")
    if (jobCards.length === 0) {
      document.getElementById("noJobsMessage").style.display = "block"
    }
  })
  
  