document.addEventListener("DOMContentLoaded", () => {
  // Fetch all users
  fetchUsers();
});

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/users");
    const users = await response.json();

    displayUsers(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("Failed to load users. Please try again later.");
  }
}

function displayUsers(users) {
  const tableBody = document.getElementById("usersTableBody");
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${formatUserType(user.userType)}</td>
        <td>
          <a href="admin-edit-user.html?id=${
            user._id
          }" class="table-action-btn view-btn">View/Edit</a>
          <button class="table-action-btn delete-btn" onclick="deleteUser('${
            user._id
          }')">Delete</button>
        </td>
      `;

    tableBody.appendChild(row);
  });
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
        fetchUsers();
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

function searchUsers() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const userTypeFilter = document.getElementById("userTypeFilter").value;

  const rows = document.querySelectorAll("#usersTableBody tr");

  rows.forEach((row) => {
    const name = row.cells[0].textContent.toLowerCase();
    const email = row.cells[1].textContent.toLowerCase();
    const userType = row.cells[3].textContent.toLowerCase();

    const matchesSearch =
      name.includes(searchTerm) || email.includes(searchTerm);
    const matchesFilter =
      userTypeFilter === "all" ||
      userType.includes(userTypeFilter.replace("_", " "));

    if (matchesSearch && matchesFilter) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function filterUsers() {
  searchUsers(); // Reuse the search function which also handles filtering
}
