import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Tab functionality
function showTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

window.showTab = showTab;

// Form submission
const volunteerForm = document.getElementById("volunteerForm");
const registerBtn = document.getElementById("registerBtn");

volunteerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    age: parseInt(document.getElementById("age").value),
    location: document.getElementById("location").value.trim(),
    skill: document.getElementById("skill").value,
    availability: document.getElementById("availability").value,
    experience: document.getElementById("experience").value.trim(),
    available: true,
    registeredAt: new Date()
  };

  // Basic validation
  if (!formData.name || !formData.email || !formData.phone || !formData.age || !formData.location || !formData.skill || !formData.availability) {
    alert("Please fill in all required fields.");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Registering...";

  try {
    await addDoc(collection(db, "volunteers"), formData);
    alert("Volunteer registered successfully!");
    volunteerForm.reset();
    showTab('status'); // Switch to status tab after registration
  } catch (error) {
    console.error("Error registering volunteer:", error);
    alert("Error registering. Please try again.");
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "Register as Volunteer";
  }
});

// Load volunteer status
const volunteerStatus = document.getElementById("volunteerStatus");

function loadVolunteerStatus() {
  // For demo purposes, we'll show all volunteers. In a real app, filter by user
  onSnapshot(collection(db, "volunteers"), (snapshot) => {
    volunteerStatus.innerHTML = "";

    if (snapshot.empty) {
      volunteerStatus.innerHTML = "<p>You haven't registered yet. Please register first.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const volunteer = { id: doc.id, ...doc.data() };
      const statusItem = document.createElement("div");
      statusItem.className = "status-item";
      statusItem.innerHTML = `
        <div class="status-info">
          <h4>${volunteer.name}</h4>
          <p><strong>Status:</strong> <span class="status-${volunteer.available ? 'available' : 'assigned'}">${volunteer.available ? 'Available' : 'Assigned'}</span></p>
          <p><strong>Skill:</strong> ${volunteer.skill}</p>
          <p><strong>Location:</strong> ${volunteer.location}</p>
          <p><strong>Availability:</strong> ${volunteer.availability}</p>
          <p><strong>Registered:</strong> ${volunteer.registeredAt?.toDate()?.toLocaleDateString() || 'N/A'}</p>
        </div>
        <div class="status-actions">
          <button class="btn-secondary" onclick="updateAvailability('${volunteer.id}', ${!volunteer.available})">
            Mark as ${volunteer.available ? 'Unavailable' : 'Available'}
          </button>
        </div>
      `;
      volunteerStatus.appendChild(statusItem);
    });
  });
}

async function updateAvailability(volunteerId, available) {
  // In a real app, you'd update the document
  alert(`Availability update functionality would update the volunteer status to ${available ? 'available' : 'unavailable'}.`);
}

window.updateAvailability = updateAvailability;

// Initialize
loadVolunteerStatus();