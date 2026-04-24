import { db } from "./firebase.js";
import { collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let allNeeds = [];
const needsContainer = document.getElementById("needsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const urgencyFilter = document.getElementById("urgencyFilter");
const statusFilter = document.getElementById("statusFilter");

// Stats elements
const totalNeedsEl = document.getElementById("totalNeeds");
const unassignedNeedsEl = document.getElementById("unassignedNeeds");
const highUrgencyEl = document.getElementById("highUrgency");

// Real-time listener for needs
onSnapshot(collection(db, "needs"), (snapshot) => {
  allNeeds = [];
  snapshot.forEach(doc => {
    allNeeds.push({ id: doc.id, ...doc.data() });
  });
  updateStats();
  renderNeeds();
});

// Search and filter functionality
searchBtn.addEventListener("click", renderNeeds);
searchInput.addEventListener("input", renderNeeds);
urgencyFilter.addEventListener("change", renderNeeds);
statusFilter.addEventListener("change", renderNeeds);

function renderNeeds() {
  const searchTerm = searchInput.value.toLowerCase();
  const urgencyValue = urgencyFilter.value;
  const statusValue = statusFilter.value;

  const filteredNeeds = allNeeds.filter(need => {
    const matchesSearch = need.title?.toLowerCase().includes(searchTerm) ||
                         need.location?.toLowerCase().includes(searchTerm) ||
                         need.skill?.toLowerCase().includes(searchTerm);
    const matchesUrgency = !urgencyValue || need.urgency === urgencyValue;
    const matchesStatus = !statusValue || need.status === statusValue;
    return matchesSearch && matchesUrgency && matchesStatus;
  });

  needsContainer.innerHTML = "";

  if (filteredNeeds.length === 0) {
    needsContainer.innerHTML = '<div class="no-results">No needs found matching your criteria.</div>';
    return;
  }

  filteredNeeds.forEach(need => {
    const needCard = document.createElement("div");
    needCard.className = "need-card";
    needCard.innerHTML = `
      <div class="need-header">
        <h3>${need.title || 'Untitled Need'}</h3>
        <span class="urgency-badge urgency-${need.urgency?.toLowerCase() || 'medium'}">${need.urgency || 'Medium'}</span>
      </div>
      <div class="need-details">
        <p><strong>Location:</strong> ${need.location || 'Not specified'}</p>
        <p><strong>Skill Required:</strong> ${need.skill || 'Not specified'}</p>
        <p><strong>Status:</strong> <span class="status-${need.status?.toLowerCase() || 'unassigned'}">${need.status || 'Unassigned'}</span></p>
      </div>
      <div class="need-actions">
        <button class="btn-primary" onclick="claimNeed('${need.id}')">Claim Need</button>
        <button class="btn-secondary" onclick="viewDetails('${need.id}')">View Details</button>
      </div>
    `;
    needsContainer.appendChild(needCard);
  });
}

function updateStats() {
  const total = allNeeds.length;
  const unassigned = allNeeds.filter(n => n.status === 'Unassigned').length;
  const highUrgency = allNeeds.filter(n => n.urgency === 'High').length;

  totalNeedsEl.textContent = total;
  unassignedNeedsEl.textContent = unassigned;
  highUrgencyEl.textContent = highUrgency;
}

async function claimNeed(needId) {
  if (confirm('Are you sure you want to claim this need?')) {
    try {
      await updateDoc(doc(db, "needs", needId), {
        status: "Assigned"
      });
      alert('Need claimed successfully!');
    } catch (error) {
      console.error('Error claiming need:', error);
      alert('Error claiming need. Please try again.');
    }
  }
}

function viewDetails(needId) {
  const need = allNeeds.find(n => n.id === needId);
  if (need) {
    alert(`Details for: ${need.title}\nLocation: ${need.location}\nSkill: ${need.skill}\nUrgency: ${need.urgency}\nStatus: ${need.status}`);
  }
}

// Make functions global for onclick
window.claimNeed = claimNeed;
window.viewDetails = viewDetails;