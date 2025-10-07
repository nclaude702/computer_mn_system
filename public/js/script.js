document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
});
// Handle User Registration Form
document.getElementById("userRegisterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("userName").value;
  const password = document.getElementById("userPassword").value;

  fetch("/register-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      this.reset();
    })
    .catch(err => {
      console.error("❌ Error registering user:", err);
      alert("User registration failed");
    });
});

// Handle Computer Registration Form
document.getElementById("computerRegisterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const computer_code = document.getElementById("computerCode").value;
  const description = document.getElementById("computerDescription").value;
  const serial_number = document.getElementById("computerSerial").value;

  fetch("/register-computer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ computer_code, description, serial_number }),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      this.reset();
    })
    .catch(err => {
      console.error("❌ Error registering computer:", err);
      alert("Computer registration failed");
    });
});

//view computer

// View, Delete, Update Computers
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("computerTableBody");

  // Load computers from backend
  fetch("/api/computers")
    .then(res => res.json())
    .then(computers => {
      computers.forEach(computer => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><input value="${computer.computer_code}" data-id="${computer.id}" class="edit-code" /></td>
          <td><input value="${computer.description}" class="edit-description" /></td>
          <td><input value="${computer.serial_number}" class="edit-serial" /></td>
          <td>
            <button class="btn update" data-id="${computer.id}">Update</button>
            <button class="btn delete" data-id="${computer.id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      // Add delete handlers
      document.querySelectorAll(".btn.delete").forEach(button => {
        button.addEventListener("click", function () {
          const id = this.dataset.id;
          if (confirm("Are you sure you want to delete this computer?")) {
            fetch(`/api/computers/${id}`, {
              method: "DELETE"
            })
              .then(res => res.json())
              .then(data => {
                alert(data.message);
                location.reload();
              });
          }
        });
      });

      // Add update handlers
      document.querySelectorAll(".btn.update").forEach(button => {
        button.addEventListener("click", function () {
          const id = this.dataset.id;
          const row = this.closest("tr");
          const computer_code = row.querySelector(".edit-code").value;
          const description = row.querySelector(".edit-description").value;
          const serial_number = row.querySelector(".edit-serial").value;

          fetch(`/api/computers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ computer_code, description, serial_number })
          })
            .then(res => res.json())
            .then(data => {
              alert(data.message);
              location.reload();
            });
        });
      });
    })
    .catch(err => {
      console.error(" Error loading computers:", err);
    });
});

