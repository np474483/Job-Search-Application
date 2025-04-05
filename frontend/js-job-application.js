// Simple JavaScript for the job application page
// Get job ID from URL parameter
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search)
    const jobId = urlParams.get("job")
  
    // In a real application, you would fetch job details from the server
    // For now, we'll just use some sample data
    if (jobId === "2") {
      document.getElementById("jobTitle").textContent = "UI/UX Designer"
      document.getElementById("companyName").textContent = "Creative Solutions"
      document.getElementById("jobLocation").textContent = "Mumbai, Maharashtra"
      document.getElementById("jobType").textContent = "Part-time"
    } else if (jobId === "3") {
      document.getElementById("jobTitle").textContent = "Marketing Specialist"
      document.getElementById("companyName").textContent = "Global Marketing"
      document.getElementById("jobLocation").textContent = "Bangalore, Karnataka"
      document.getElementById("jobType").textContent = "Full-time"
    } else if (jobId === "4") {
      document.getElementById("jobTitle").textContent = "Software Development Intern"
      document.getElementById("companyName").textContent = "Tech Innovators"
      document.getElementById("jobLocation").textContent = "Delhi, Delhi"
      document.getElementById("jobType").textContent = "Internship"
    }
  })
  
  function submitApplication() {
    // Basic validation
    const fullName = document.getElementById("fullName").value.trim()
    const email = document.getElementById("email").value.trim()
    const phone = document.getElementById("phone").value.trim()
    const resume = document.getElementById("resume").value
    const coverLetter = document.getElementById("coverLetter").value.trim()
    const experience = document.getElementById("experience").value
    const skills = document.getElementById("skills").value.trim()
    const availability = document.getElementById("availability").value
  
    // Check required fields
    if (!fullName) {
      alert("Please enter your full name")
      return false
    }
  
    if (!email) {
      alert("Please enter your email")
      return false
    }
  
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address")
      return false
    }
  
    if (!phone) {
      alert("Please enter your phone number")
      return false
    }
  
    if (!resume) {
      alert("Please upload your resume")
      return false
    }
  
    if (!coverLetter) {
      alert("Please enter a cover letter")
      return false
    }
  
    if (!experience) {
      alert("Please select your years of experience")
      return false
    }
  
    if (!skills) {
      alert("Please enter your skills")
      return false
    }
  
    if (!availability) {
      alert("Please select your availability to start")
      return false
    }
  
    // If all validations pass
    alert("Application submitted successfully!")
    window.location.href = "js-applied-jobs.html"
    return false // Prevent actual form submission
  }
  
  