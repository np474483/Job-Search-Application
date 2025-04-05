// Simple JavaScript for the applied jobs page
function viewApplication(jobId) {
    alert("Viewing application details... (In a real application, this would show your application details)")
  }
  
  // Check if there are any job cards on page load
  window.addEventListener("load", () => {
    const jobCards = document.querySelectorAll(".job-card")
    if (jobCards.length === 0) {
      document.getElementById("noJobsMessage").style.display = "block"
    }
  })
  
  