# Santisima Fu3ga Electronic Press Kit

A static electronic press kit (EPK) for Santisima Fu3ga, designed as a dark,
terminal-inspired artist page. It includes artist information, a Mixcloud
archive link, selected gigs, press imagery, a technical rider, booking contact
information, and an animated code-themed background.

## Features

- Responsive two-column EPK layout that adapts to smaller screens.
- Monochrome Python code background scrolls using a lightweight CSS animation,
  with no JavaScript animation loop or repeated DOM updates.
- Hero video drawn in a canvas with grayscale, contrast, grain, and
  brightness-based transparency effects, processed at up to 15 frames per
  second and capped at 640 × 360 pixels for mobile performance.
- Hero video playback frame rate is reported to the browser console for
  performance monitoring.
- Falls back to the locally processed hero image if video playback fails.
- Does not load the animated code-background iframe on mobile viewports.
- Press photo drawn into a canvas with grayscale and contrast filtering.
- Links to the artist's Mixcloud archive, Instagram, and booking email.
- System clock showing the viewer's local time.
- Latest repository commit date fetched from the GitHub API and displayed in
  UTC. If the request fails, the status displays `SYS_UPDATE: OFFLINE`.
- Reduced page styling is organized in a dedicated stylesheet; page behavior
  is in a separate JavaScript file.

## Project files

| Path | Purpose |
| --- | --- |
| `index.html` | Main press kit page and content markup; GitHub Pages entry point |
| `styles.css` | Page styling, responsive layout, and background layering |
| `scripts.js` | Canvas image processing, video FPS logging, system clock, and GitHub update lookup |
| `background.html` | Animated code background rendered in the page iframe |
| `media/video-hero.mp4` | Local source video for the canvas hero banner |
| `media/hero-banner.jpg` | Still-image fallback for the canvas hero banner |
| `media/bio_photo.jpg` | Local source image for the press-photo canvas |


## Pending

- Add the downloadable press-kit ZIP or PDF and link the press-kit download
  button in `index.html` to it.

## Changelog

### 0.0.5

- Replaced the animated background's repeated JavaScript text generation and
  highlighting with static monochrome Python code and a CSS-only scrolling
  animation.
- Added periodic hero-video FPS logging to help identify playback performance
  issues on different devices.
- Set the hero banner height to 70% of the viewport.
- Updated the displayed page version to `0.0.5`.

### 0.0.4

- Added the current hero video, fallback banner image, and press photo to the
  local `media/` assets.
- Updated the artist biography, selected gigs, and technical rider information.
- Linked the recorded-sets section to the artist's Mixcloud archive.
- Updated booking contact and social profile links.
- Updated the displayed page version to `0.0.4`.

### 0.0.3

- Updated the artist biography and selected gigs sections.
- Replaced the static hero-banner image with a looping local video rendered
  frame-by-frame through canvas.
- Preserved the hero's grayscale blend, contrast, grain, and transparent dark
  pixels, with a configurable 0–100 grayscale setting.
- Limited video canvas processing to 15 frames per second and a maximum
  640 × 360 canvas size for improved mobile performance.
- Added a processed still-image fallback for browsers where the hero video
  fails to load or play.
- Removed the animated background iframe on mobile and deferred loading it on
  larger viewports.

### 0.0.2

- Added a live GitHub API lookup to show the repository's latest commit date in
  the terminal status bar.
- Added comments in the JavaScript describing the primary image, clock, and
  repository-date functions.
- Split page styles into `styles.css` and behavior into `scripts.js`.
- Added a local hero-banner image rendered through canvas, with grayscale,
  contrast, grain, and transparent dark pixels.
- Added a local press photo rendered through canvas with grayscale and contrast
  filtering.
- Added the animated code background and layered it behind the press-kit page.
- Used CSS nesting to group related styles.

### 0.0.1

- Created the initial artist press-kit layout with biography, music, gigs,
  press image, technical rider, booking contact, and footer sections.
- Added a terminal-inspired visual theme and system clock.
