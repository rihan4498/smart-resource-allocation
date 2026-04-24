// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update icon
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    if (isDark) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('.sun-icon').style.display = 'none';
    themeToggle.querySelector('.moon-icon').style.display = 'block';
  } else {
    themeToggle.querySelector('.sun-icon').style.display = 'block';
    themeToggle.querySelector('.moon-icon').style.display = 'none';
  }
}

function openLoginModal() {
  const modal = document.getElementById('loginModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('loginModal');
  if (e.target === modal) {
    closeLoginModal();
  }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLoginModal();
  }
});

function loginAsNGO() {
  // Add loading animation
  const btn = event.target;
  btn.classList.add('loading');
  setTimeout(() => {
    window.location.href = "ngo.html";
  }, 1000);
}

function loginAsDonor() {
  // Add loading animation
  const btn = event.target;
  btn.classList.add('loading');
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}

// Typing animation for tagline
const tagline = document.querySelector('.tagline');
if (tagline) {
  const text = tagline.textContent;
  tagline.textContent = '';
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      tagline.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }

  setTimeout(typeWriter, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  body.classList.add('loaded');
});