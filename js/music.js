// ============================================================
// music.js — Music Player Logic
// ============================================================
// CONCEPTS COVERED:
// 1. The HTML Audio API — playing audio in the browser
// 2. Data attributes — storing data in HTML elements
// 3. Querying multiple elements — querySelectorAll + forEach
// 4. State management — tracking what's currently playing
// 5. Search filtering with string methods
// 6. CSS class toggling for visual state changes
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── STEP 1: AUDIO PLAYER SETUP ──────────────────────────
  // CONCEPT: new Audio() creates an HTML audio player in JS.
  // We don't put it in HTML — JS creates it invisibly.
  // We'll use ONE Audio object and change its src to play
  // different songs. This ensures only 1 song plays at a time.
  const audioPlayer = new Audio();

  // Track which card is currently playing
  // null means nothing is playing
  let currentlyPlayingCard = null;

  // ── STEP 2: ATTACH PLAY BUTTONS ─────────────────────────
  // CONCEPT: querySelectorAll returns a NodeList of ALL matching
  // elements. We then use forEach to loop through and attach
  // a click listener to each button.
  const playButtons = document.querySelectorAll('.play-pause-btn');

  playButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // CONCEPT: dataset.xxx reads data-xxx attributes from HTML.
      // <button data-src="audio/song1.mp3" data-song="Midnight Drive">
      // btn.dataset.src  → "audio/song1.mp3"
      // btn.dataset.song → "Midnight Drive"
      const src      = btn.dataset.src;
      const songName = btn.dataset.song;

      // Find the parent card (closest ancestor with .music-card class)
      const card = btn.closest('.music-card');

      // ── Logic: Is this song already playing? ──
      if (currentlyPlayingCard === card && !audioPlayer.paused) {
        // PAUSE: Same card clicked while playing
        pauseAll();
      } else {
        // PLAY: New song clicked, or paused song resumed
        playSong(card, src, songName);
      }
    });
  });

  // ── STEP 3: PLAY FUNCTION ───────────────────────────────
  function playSong(card, src, songName) {
    // First, stop whatever is currently playing
    if (currentlyPlayingCard) {
      resetCard(currentlyPlayingCard);
    }

    // Set the new audio source and play
    audioPlayer.src = src;

    // CONCEPT: audioPlayer.play() returns a Promise.
    // .catch() handles errors (e.g. file not found).
    audioPlayer.play().catch(function (err) {
      // Audio file not found (expected in demo without real audio)
      // We still update the UI to show "playing" state
      console.log('Audio note:', err.message);
    });

    // Update state: remember which card is playing
    currentlyPlayingCard = card;

    // Update UI: mark card as playing
    setCardPlaying(card, songName, true);
  }

  // ── STEP 4: PAUSE FUNCTION ──────────────────────────────
  function pauseAll() {
    audioPlayer.pause();
    if (currentlyPlayingCard) {
      setCardPlaying(currentlyPlayingCard, null, false);
      currentlyPlayingCard = null;
    }
  }

  // ── STEP 5: VISUAL STATE FUNCTIONS ──────────────────────
  // CONCEPT: We change what the user SEES by adding/removing
  // CSS classes and changing button text.

  function setCardPlaying(card, songName, isPlaying) {
    // Get the buttons inside this specific card
    const buttons = card.querySelectorAll('.play-pause-btn');
    const waves   = card.querySelector('.music-waves');

    if (isPlaying) {
      card.classList.add('playing');
      // Change all play buttons in this card to show "Pause"
      buttons.forEach(function (b) {
        const icon = b.querySelector('.play-icon');
        if (icon) icon.textContent = '⏸';         // Change ▶ to ⏸
        if (b.tagName === 'BUTTON' && b.classList.contains('btn-primary')) {
          b.textContent = '⏸ Pause';
        }
      });
      if (waves) waves.style.display = 'flex';    // Show sound waves
      if (songName) showToast(`🎵 Now Playing: ${songName}`, 'info');
    } else {
      resetCard(card);
    }
  }

  function resetCard(card) {
    card.classList.remove('playing');
    const buttons = card.querySelectorAll('.play-pause-btn');
    const waves   = card.querySelector('.music-waves');

    buttons.forEach(function (b) {
      const icon = b.querySelector('.play-icon');
      if (icon) icon.textContent = '▶';
      if (b.tagName === 'BUTTON' && b.classList.contains('btn-primary')) {
        b.textContent = '▶ Play';
      }
    });

    if (waves) waves.style.display = 'none';
  }

  // Stop playing when song ends naturally
  audioPlayer.addEventListener('ended', function () {
    if (currentlyPlayingCard) {
      resetCard(currentlyPlayingCard);
      currentlyPlayingCard = null;
      showToast('⏭ Song ended', 'info');
    }
  });


  // ── STEP 6: SEARCH FUNCTIONALITY ────────────────────────
  // CONCEPT: We listen for every keystroke on the search input.
  // On each keystroke, we check each card to see if the song
  // name or artist matches the search text.
  const searchInput = document.getElementById('music-search');
  const musicGrid   = document.getElementById('music-grid');
  const noResults   = document.getElementById('no-results');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      // CONCEPT: .toLowerCase() makes search case-insensitive.
      // "LUNA" === "luna" would be false, but
      // "LUNA".toLowerCase() === "luna".toLowerCase() is true.
      const query = searchInput.value.toLowerCase().trim();

      filterCards(query, getActiveFilter());
    });
  }


  // ── STEP 7: GENRE FILTER FUNCTIONALITY ──────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Remove active from all buttons
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      // Add active to clicked button
      btn.classList.add('active');

      const genre = btn.dataset.filter;
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      filterCards(query, genre);
    });
  });

  function getActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
  }

  // Combined filter: search text + genre filter
  function filterCards(query, genre) {
    const cards = document.querySelectorAll('.music-card');
    let visibleCount = 0;

    cards.forEach(function (card) {
      const songName   = card.querySelector('.music-name')?.textContent.toLowerCase()   || '';
      const artistName = card.querySelector('.music-artist')?.textContent.toLowerCase() || '';
      const cardGenre  = card.dataset.genre || '';

      // CONCEPT: && means AND. Both conditions must be true to show the card.
      const matchesSearch = query === '' || songName.includes(query) || artistName.includes(query);
      const matchesGenre  = genre === 'all' || cardGenre === genre;

      if (matchesSearch && matchesGenre) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
        // Stop audio if the playing card is hidden
        if (card === currentlyPlayingCard) {
          pauseAll();
        }
      }
    });

    // Show/hide "no results" message
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

});
