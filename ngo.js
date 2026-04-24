import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Tab functionality
function showTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

window.showTab = showTab;

// Form submission
const needForm = document.getElementById("needForm");
const submitBtn = document.getElementById("submitBtn");

needForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    ngoName: document.getElementById("ngoName").value.trim(),
    resourceType: document.getElementById("resourceType").value.trim(),
    quantity: parseInt(document.getElementById("quantity").value),
    urgency: document.getElementById("urgency").value,
    location: document.getElementById("location").value.trim(),
    description: document.getElementById("description").value.trim(),
    skill: document.getElementById("skill").value.trim(),
    title: `${document.getElementById("resourceType").value} - ${document.getElementById("location").value}`,
    status: "Unassigned",
    submittedAt: new Date()
  };

  // Basic validation
  if (!formData.ngoName || !formData.resourceType || !formData.quantity || !formData.urgency || !formData.location) {
    alert("Please fill in all required fields.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    await addDoc(collection(db, "needs"), formData);
    alert("Need submitted successfully!");
    needForm.reset();
    showTab('manage'); // Switch to manage tab after submission
  } catch (error) {
    console.error("Error adding need:", error);
    alert("Error submitting need. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Request";
  }
});

// Load and display user's needs
const needsList = document.getElementById("needsList");

function loadUserNeeds() {
  // For demo purposes, we'll show all needs. In a real app, filter by user/NGO
  onSnapshot(collection(db, "needs"), (snapshot) => {
    needsList.innerHTML = "";

    if (snapshot.empty) {
      needsList.innerHTML = "<p>No needs submitted yet.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const need = { id: doc.id, ...doc.data() };
      const needItem = document.createElement("div");
      needItem.className = "need-item";
      needItem.innerHTML = `
        <div class="need-info">
          <h4>${need.title}</h4>
          <p><strong>Status:</strong> <span class="status-${need.status.toLowerCase()}">${need.status}</span></p>
          <p><strong>Urgency:</strong> ${need.urgency}</p>
          <p><strong>Location:</strong> ${need.location}</p>
          <p><strong>Quantity:</strong> ${need.quantity}</p>
        </div>
        <div class="need-actions">
          <button class="btn-secondary" onclick="editNeed('${need.id}')">Edit</button>
          <button class="btn-danger" onclick="deleteNeed('${need.id}')">Delete</button>
        </div>
      `;
      needsList.appendChild(needItem);
    });
  });
}

async function deleteNeed(needId) {
  if (confirm("Are you sure you want to delete this need?")) {
    try {
      await deleteDoc(doc(db, "needs", needId));
      alert("Need deleted successfully!");
    } catch (error) {
      console.error("Error deleting need:", error);
      alert("Error deleting need. Please try again.");
    }
  }
}

function editNeed(needId) {
  // For simplicity, switch to submit tab and populate form
  // In a real app, you'd load the data into the form
  alert("Edit functionality would populate the form with existing data.");
  showTab('submit');
}

window.deleteNeed = deleteNeed;
window.editNeed = editNeed;

// Initialize
loadUserNeeds();