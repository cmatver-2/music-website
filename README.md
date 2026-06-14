# ♪ BeatWave

A responsive music streaming website built with vanilla HTML, CSS, and JavaScript. Discover and stream independent tracks across a range of genres — all without any frameworks or build tools.

**Live site:** [cmatver-2.github.io/music-website](https://cmatver-2.github.io/music-website/)

---

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero section, featured tracks, genre browser |
| `music.html` | Music library — searchable, filterable track grid |
| `artist.html` | Artist profile page |
| `about.html` | About BeatWave |
| `contact.html` | Contact form |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |

## Features

- **Audio playback** — play/pause tracks directly in the browser via the HTML `<audio>` API
- **Search** — live search across song titles and artists
- **Genre filtering** — filter tracks by Pop, Hip-Hop, Electronic, Lo-Fi, Rock, and more
- **Favorites** — mark tracks as favorites (heart toggle)
- **Dark / light mode** — theme toggle persisted across the session
- **Scroll animations** — elements animate in as they enter the viewport (`data-reveal`)
- **Responsive design** — mobile-first layout with a hamburger nav on small screens
- **Toast notifications** — lightweight feedback for user actions

## Project Structure

```
music-website/
├── index.html          # Home page
├── music.html          # Music library
├── artist.html         # Artist profile
├── about.html          # About page
├── contact.html        # Contact page
├── privacy.html        # Privacy policy
├── terms.html          # Terms of use
├── css/
│   ├── style.css       # Global base styles & CSS variables
│   ├── home.css        # Home page-specific styles
│   ├── music.css       # Music library styles
│   └── responsive.css  # Media queries & mobile overrides
├── js/
│   ├── main.js         # Shared logic (nav, theme, scroll reveal, toasts)
│   ├── home.js         # Home page logic
│   └── music.js        # Music player, search, and filter logic
├── audio/              # Audio files (song1.mp3 … song6.mp3)
└── images/             # Album art and other images
```

## Getting Started

No build step required — just open the files in a browser.

```bash
git clone https://github.com/cmatver-2/music-website.git
cd music-website
# Open index.html in your browser, or serve with any static server:
npx serve .
```

> **Note:** Audio playback requires the `.mp3` files to be present in the `audio/` directory. The repo includes placeholder tracks sourced from [Pixabay](https://pixabay.com).

## Tech Stack

- **HTML5** — semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- **CSS3** — custom properties (CSS variables), Flexbox, Grid, keyframe animations
- **Vanilla JavaScript** — no libraries or frameworks
- **Google Fonts** — Playfair Display + DM Sans
- **GitHub Pages** — hosting

## Branches

| Branch | Description |
|--------|-------------|
| `main` | Current version — cleaned up and maintained |
| `claude-vibecode` | Original vibe-coded version with inline comments explaining the thought process as it was built |

The `vibe` branch is kept as a snapshot of how the site came together — messy, intuitive, and commented as it was written. Good reference if you want to see the reasoning behind early decisions.

## Credits

Music and images are sourced from [Pixabay](https://pixabay.com) and remain the property of their respective creators. This project is for educational and non-commercial purposes only.

## License

This project is open source and available under the [MIT License](LICENSE).
