// ============================================================
// main.js — Shared JavaScript for all pages
// ============================================================
// CONCEPT: What is JavaScript?
// JavaScript (JS) makes web pages INTERACTIVE.
// HTML = structure, CSS = appearance, JS = behaviour.
//
// KEY CONCEPTS IN THIS FILE:
// 1. Selecting HTML elements with querySelector
// 2. Listening for events (clicks, scrolls) with addEventListener
// 3. Adding/removing CSS classes to change appearance
// 4. Functions — reusable blocks of code
// ============================================================

// ============================================================
// CONCEPT: document.addEventListener('DOMContentLoaded', ...)
// This waits until the entire HTML page has loaded before
// running our JS. If we don't wait, elements we try to select
// might not exist yet and we'd get errors.
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // ── 1. NAVBAR SCROLL EFFECT ─────────────────────────────
  // CONCEPT: querySelector finds an HTML element by CSS selector.
  // It returns the FIRST matching element (or null if not found).
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    // CONCEPT: addEventListener listens for an 'event'.
    // When the user scrolls, this function runs.
    window.addEventListener('scroll', function () {
      // CONCEPT: window.scrollY = how many pixels scrolled down
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');    // Add the class
      } else {
        navbar.classList.remove('scrolled'); // Remove the class
      }
    });
  }

  // ── 2. HAMBURGER MENU (Mobile Navigation) ───────────────
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      // CONCEPT: classList.toggle adds a class if absent, removes if present
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      // Prevent body scrolling when menu is open
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 3. ACTIVE NAV LINK ──────────────────────────────────
  // Mark the current page's link as active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    // getAttribute gets the value of an HTML attribute (here, href)
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ── 4. THEME TOGGLE (Dark / Light) ──────────────────────
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon   = document.querySelector('.theme-icon');

  // CONCEPT: localStorage stores data in the browser that
  // persists even after the page is closed (like a cookie).
  // We use it to remember whether user chose dark or light mode.
  const savedTheme = localStorage.getItem('beatwave-theme') || 'dark';

  // Apply saved theme on page load
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isLight = document.body.classList.contains('light-theme');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // CONCEPT: Functions - reusable code blocks.
  // We use a function here so we can call applyTheme() from
  // multiple places without repeating the same code.
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) themeIcon.textContent = '☀️';
      localStorage.setItem('beatwave-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      localStorage.setItem('beatwave-theme', 'dark');
    }
  }

  // ── 5. SCROLL REVEAL ANIMATION ──────────────────────────
  // CONCEPT: IntersectionObserver watches if an element is
  // visible on screen. We use this to animate elements as
  // the user scrolls down.
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {  // Element is visible
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop watching once revealed
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% visible

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

});

// ============================================================
// TOAST NOTIFICATION SYSTEM
// CONCEPT: We export this function so other JS files can use it.
// A toast is a temporary popup message.
//
// Usage: showToast('Song added to favorites!', 'success')
//        showToast('Please fill all fields', 'error')
//        showToast('Now playing...', 'info')
// ============================================================
function showToast(message, type = 'info', duration = 3000) {
  // Get or create the toast container
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Choose icon based on type
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  // CONCEPT: createElement creates a new HTML element in memory.
  // innerHTML sets the HTML content inside it.
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // CONCEPT: setTimeout runs a function after a delay (in ms).
  // Here, we remove the toast after 'duration' milliseconds.
  setTimeout(function () {
    toast.classList.add('hide');
    // Wait for fade-out animation, then remove from DOM
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, duration);
}
