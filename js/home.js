// ============================================================
// home.js — JavaScript specific to the Home page
// ============================================================
// CONCEPTS COVERED:
// - Functions
// - DOM manipulation (changing page content with JS)
// - Event handling
// - localStorage (saving data in the browser)
// - Array methods (forEach)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── FAVORITE TOGGLE FUNCTIONALITY ─────────────────────
  // We'll make this global (outside DOMContentLoaded)
  // so the inline onclick="" in HTML can access it.

  // ── ANIMATE NUMBERS (Count-up effect) ─────────────────
  // CONCEPT: We find all .stat-number elements and animate
  // them counting up from 0 to their target value.
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(function (el) {
    // Get the text content and parse the number
    // CONCEPT: parseInt converts "500+" → 500 (a number)
    const text   = el.textContent;
    const suffix = text.replace(/[0-9]/g, ''); // Everything except digits ("+", "K")
    const target = parseInt(text);             // Just the number part

    let current = 0;
    const step  = target / 60; // 60 frames for smooth animation

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer); // Stop the interval when done
      }
      el.textContent = Math.floor(current) + suffix;
    }, 20); // Run every 20ms
  });

});

// ── FAVORITE TOGGLE ──────────────────────────────────────
// CONCEPT: This function is GLOBAL (not inside any other function)
// so it can be called from onclick="" in HTML.
//
// 'this' in onclick= refers to the button element.
// We pass it as the first argument: toggleFavorite(this, ...)
function toggleFavorite(btn, songName) {
  // CONCEPT: We store favorites as a JSON array in localStorage.
  // JSON.parse converts the stored string back to an array.
  let favorites = JSON.parse(localStorage.getItem('beatwave-favorites') || '[]');

  const index = favorites.indexOf(songName);

  if (index === -1) {
    // Song is NOT in favorites — add it
    favorites.push(songName);
    btn.textContent = '❤️';           // Filled heart
    btn.title = 'Remove from Favorites';
    showToast(`❤️ "${songName}" added to favorites!`, 'success');
  } else {
    // Song IS in favorites — remove it
    favorites.splice(index, 1);       // Remove 1 element at index
    btn.textContent = '🤍';           // Empty heart
    btn.title = 'Add to Favorites';
    showToast(`Removed "${songName}" from favorites`, 'info');
  }

  // CONCEPT: JSON.stringify converts array → string for storage
  localStorage.setItem('beatwave-favorites', JSON.stringify(favorites));
}

// Restore favorite button states on page load
// (So hearts stay filled after page refresh)
document.addEventListener('DOMContentLoaded', function () {
  const favorites = JSON.parse(localStorage.getItem('beatwave-favorites') || '[]');

  document.querySelectorAll('.fav-btn').forEach(function (btn) {
    // Find the song name from nearest card title
    const card = btn.closest('.featured-card');
    if (!card) return;

    const songName = card.querySelector('.card-title').textContent;
    if (favorites.includes(songName)) {
      btn.textContent = '❤️';
      btn.title = 'Remove from Favorites';
    }
  });
});
