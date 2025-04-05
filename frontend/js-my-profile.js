document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo || userInfo.userType !== "job_seeker") {
    window.location.href = "SignIn.html";
    return;
  }

  // Load user profile data
  loadUserProfile(userInfo);

  // Personal Information Edit
  const editPersonalInfoBtn = document.getElementById("editPersonalInfo");
  const personalInfoForm = document.getElementById("personalInfoForm");
  const personalInfoInputs = personalInfoForm.querySelectorAll("input");
  const personalInfoActions = personalInfoForm.querySelector(".form-actions");
  const cancelPersonalEditBtn = document.getElementById("cancelPersonalEdit");

  // Professional Information Edit
  const editProfessionalInfoBtn = document.getElementById(
    "editProfessionalInfo"
  );
  const professionalInfoForm = document.getElementById("professionalInfoForm");
  const professionalInfoInputs = professionalInfoForm.querySelectorAll(
    "input, select, textarea"
  );
  const professionalInfoActions =
    professionalInfoForm.querySelector(".form-actions");
  const cancelProfessionalEditBtn = document.getElementById(
    "cancelProfessionalEdit"
  );

  // Education Section
  const addEducationBtn = document.getElementById("addEducation");
  const educationForm = document.getElementById("educationForm");
  const addEducationForm = document.getElementById("addEducationForm");
  const cancelEducationBtn = document.getElementById("cancelEducation");
  const educationList = document.getElementById("educationList");

  // Work Experience Section
  const addExperienceBtn = document.getElementById("addExperience");
  const experienceForm = document.getElementById("experienceForm");
  const addExperienceForm = document.getElementById("addExperienceForm");
  const cancelExperienceBtn = document.getElementById("cancelExperience");
  const experienceList = document.getElementById("experienceList");
  const currentJobCheckbox = document.getElementById("currentJob");
  const endDateInput = document.getElementById("endDate");

  // Resume Upload
  const uploadResumeBtn = document.getElementById("uploadResumeBtn");
  const resumeUpload = document.getElementById("resumeUpload");
  const resumeFileName = document.getElementById("resumeFileName");
  const resumeUploadDate = document.getElementById("resumeUploadDate");
  const viewResumeBtn = document.getElementById("viewResumeBtn");

  // Profile Image Upload
  const avatarContainer = document.querySelector(".avatar-container");
  const avatarUpload = document.getElementById("avatarUpload");
  const profileImage = document.getElementById("profileImage");

  // Personal Information Edit Functionality
  editPersonalInfoBtn.addEventListener("click", () => {
    toggleEditMode(personalInfoInputs, true);
    personalInfoActions.style.display = "flex";
    editPersonalInfoBtn.style.display = "none";
  });

  cancelPersonalEditBtn.addEventListener("click", () => {
    toggleEditMode(personalInfoInputs, false);
    personalInfoActions.style.display = "none";
    editPersonalInfoBtn.style.display = "flex";
    personalInfoForm.reset(); // Reset to original values
    loadUserProfile(userInfo); // Reload the original data
  });

  personalInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validatePersonalInfo()) {
      // Here you would typically save the data to your backend
      const formData = new FormData(personalInfoForm);
      const updatedUserData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        location: formData.get("location"),
      };

      // Update user info in localStorage
      const updatedUserInfo = { ...userInfo, ...updatedUserData };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      // Update UI
      toggleEditMode(personalInfoInputs, false);
      personalInfoActions.style.display = "none";
      editPersonalInfoBtn.style.display = "flex";

      showNotification("Personal information updated successfully!");
    }
  });

  // Professional Information Edit Functionality
  editProfessionalInfoBtn.addEventListener("click", () => {
    toggleEditMode(professionalInfoInputs, true);
    professionalInfoActions.style.display = "flex";
    editProfessionalInfoBtn.style.display = "none";
  });

  cancelProfessionalEditBtn.addEventListener("click", () => {
    toggleEditMode(professionalInfoInputs, false);
    professionalInfoActions.style.display = "none";
    editProfessionalInfoBtn.style.display = "flex";
    professionalInfoForm.reset(); // Reset to original values
  });

  professionalInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateProfessionalInfo()) {
      // Here you would typically save the data to your backend
      toggleEditMode(professionalInfoInputs, false);
      professionalInfoActions.style.display = "none";
      editProfessionalInfoBtn.style.display = "flex";
      showNotification("Professional information updated successfully!");
    }
  });

  // Education Form Functionality
  addEducationBtn.addEventListener("click", () => {
    educationForm.style.display = "block";
    addEducationBtn.style.display = "none";
  });

  cancelEducationBtn.addEventListener("click", () => {
    educationForm.style.display = "none";
    addEducationBtn.style.display = "flex";
    addEducationForm.reset();
  });

  addEducationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateEducationForm()) {
      const degree = document.getElementById("degree").value;
      const institution = document.getElementById("institution").value;
      const startYear = document.getElementById("startYear").value;
      const endYear = document.getElementById("endYear").value;

      // Create new education item
      const educationItem = createEducationItem(
        degree,
        institution,
        startYear,
        endYear
      );
      educationList.appendChild(educationItem);

      // Reset and hide form
      addEducationForm.reset();
      educationForm.style.display = "none";
      addEducationBtn.style.display = "flex";

      showNotification("Education added successfully!");
    }
  });

  // Work Experience Form Functionality
  addExperienceBtn.addEventListener("click", () => {
    experienceForm.style.display = "block";
    addExperienceBtn.style.display = "none";
  });

  cancelExperienceBtn.addEventListener("click", () => {
    experienceForm.style.display = "none";
    addExperienceBtn.style.display = "flex";
    addExperienceForm.reset();
  });

  currentJobCheckbox.addEventListener("change", function () {
    endDateInput.disabled = this.checked;
    if (this.checked) {
      endDateInput.value = "";
    }
  });

  addExperienceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateExperienceForm()) {
      const position = document.getElementById("jobPosition").value;
      const company = document.getElementById("company").value;
      const startDate = formatDate(document.getElementById("startDate").value);
      const endDate = currentJobCheckbox.checked
        ? "Present"
        : formatDate(document.getElementById("endDate").value);
      const description = document.getElementById("jobDescription").value;

      // Create new experience item
      const experienceItem = createExperienceItem(
        position,
        company,
        startDate,
        endDate,
        description
      );
      experienceList.appendChild(experienceItem);

      // Reset and hide form
      addExperienceForm.reset();
      experienceForm.style.display = "none";
      addExperienceBtn.style.display = "flex";

      showNotification("Work experience added successfully!");
    }
  });

  // Resume Upload Functionality
  uploadResumeBtn.addEventListener("click", () => {
    resumeUpload.click();
  });

  resumeUpload.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      const allowedTypes = [".pdf", ".doc", ".docx"];
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();

      if (allowedTypes.includes(fileExtension)) {
        resumeFileName.textContent = file.name;
        const today = new Date();
        resumeUploadDate.textContent = today.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        viewResumeBtn.style.display = "inline-block";
        showNotification("Resume uploaded successfully!");
      } else {
        showNotification("Please upload a PDF, DOC, or DOCX file.", "error");
      }
    }
  });

  viewResumeBtn.addEventListener("click", () => {
    // In a real application, this would open the resume file
    alert(
      "Viewing resume... (In a real application, this would open your resume file)"
    );
  });

  // Profile Image Upload Functionality
  avatarContainer.addEventListener("click", () => {
    avatarUpload.click();
  });

  avatarUpload.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        profileImage.src = e.target.result;
        showNotification("Profile picture updated successfully!");
      };

      reader.readAsDataURL(file);
    }
  });

  // Add event listeners for edit and delete buttons in education and experience items
  document.addEventListener("click", (e) => {
    if (e.target.closest(".edit-small-btn")) {
      // Handle edit functionality
      const item = e.target.closest(".education-item, .experience-item");
      // You would implement edit functionality here
      showNotification("Edit functionality to be implemented");
    } else if (e.target.closest(".delete-btn")) {
      // Handle delete functionality
      const item = e.target.closest(".education-item, .experience-item");
      if (confirm("Are you sure you want to delete this item?")) {
        item.remove();
        showNotification("Item deleted successfully!");
      }
    }
  });
});

// Function to load user profile data
function loadUserProfile(userInfo) {
  // Set personal information
  document.getElementById("firstName").value = userInfo.firstName || "";
  document.getElementById("lastName").value = userInfo.lastName || "";
  document.getElementById("email").value = userInfo.email || "";
  document.getElementById("phone").value = userInfo.phone || "";
  document.getElementById("location").value = userInfo.location || "";

  // Set professional information (this would typically come from the backend)
  document.getElementById("jobTitle").value = "Software Developer"; // Example data
  document.getElementById("experience").value = "1-3"; // Example data
  document.getElementById("skills").value = "JavaScript, HTML, CSS, React"; // Example data
  document.getElementById("bio").value =
    "Passionate software developer with experience in web development."; // Example data

  // Load education and experience data (this would typically come from the backend)
  // For now, we'll add some example data
  const educationList = document.getElementById("educationList");
  educationList.innerHTML = ""; // Clear existing items

  // Example education item
  const educationItem = createEducationItem(
    "Bachelor of Technology in Computer Science",
    "University of Technology",
    "2018",
    "2022"
  );
  educationList.appendChild(educationItem);

  // Load experience data
  const experienceList = document.getElementById("experienceList");
  experienceList.innerHTML = ""; // Clear existing items

  // Example experience item
  const experienceItem = createExperienceItem(
    "Junior Developer",
    "Tech Solutions Inc.",
    "Jan 2023",
    "Present",
    "Developed and maintained web applications using React and Node.js."
  );
  experienceList.appendChild(experienceItem);
}

// Helper Functions
function toggleEditMode(inputs, editable) {
  inputs.forEach((input) => {
    input.disabled = !editable;
  });
}

function validatePersonalInfo() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!firstName || !lastName || !email || !phone || !location) {
    showNotification("Please fill out all fields.", "error");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showNotification("Please enter a valid email address.", "error");
    return false;
  }

  const phonePattern = /^\d{10}$/;
  if (!phonePattern.test(phone)) {
    showNotification("Please enter a valid 10-digit phone number.", "error");
    return false;
  }

  return true;
}

function validateProfessionalInfo() {
  const jobTitle = document.getElementById("jobTitle").value.trim();
  const experience = document.getElementById("experience").value;
  const skills = document.getElementById("skills").value.trim();
  const bio = document.getElementById("bio").value.trim();

  if (!jobTitle || !experience || !skills || !bio) {
    showNotification("Please fill out all fields.", "error");
    return false;
  }

  return true;
}

function validateEducationForm() {
  const degree = document.getElementById("degree").value.trim();
  const institution = document.getElementById("institution").value.trim();
  const startYear = document.getElementById("startYear").value;
  const endYear = document.getElementById("endYear").value;

  if (!degree || !institution || !startYear || !endYear) {
    showNotification("Please fill out all fields.", "error");
    return false;
  }

  if (Number.parseInt(startYear) > Number.parseInt(endYear)) {
    showNotification("Start year cannot be greater than end year.", "error");
    return false;
  }

  return true;
}

function validateExperienceForm() {
  const position = document.getElementById("jobPosition").value.trim();
  const company = document.getElementById("company").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const currentJob = document.getElementById("currentJob").checked;
  const description = document.getElementById("jobDescription").value.trim();

  if (
    !position ||
    !company ||
    !startDate ||
    (!endDate && !currentJob) ||
    !description
  ) {
    showNotification("Please fill out all required fields.", "error");
    return false;
  }

  if (!currentJob && new Date(startDate) > new Date(endDate)) {
    showNotification("Start date cannot be after end date.", "error");
    return false;
  }

  return true;
}

function createEducationItem(degree, institution, startYear, endYear) {
  const div = document.createElement("div");
  div.className = "education-item";
  div.innerHTML = `
      <div class="education-header">
        <h3>${degree}</h3>
        <div class="education-actions">
          <button class="edit-small-btn"><i class="fas fa-edit"></i></button>
          <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <p class="institution">${institution}</p>
      <p class="education-date">${startYear} - ${endYear}</p>
    `;
  return div;
}

function createExperienceItem(
  position,
  company,
  startDate,
  endDate,
  description
) {
  const div = document.createElement("div");
  div.className = "experience-item";
  div.innerHTML = `
      <div class="experience-header">
        <h3>${position}</h3>
        <div class="experience-actions">
          <button class="edit-small-btn"><i class="fas fa-edit"></i></button>
          <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <p class="company">${company}</p>
      <p class="experience-date">${startDate} - ${endDate}</p>
      <p class="experience-description">${description}</p>
    `;
  return div;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
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
