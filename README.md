# Santisima Fu3ga Electronic Press Kit

A static electronic press kit (EPK) for Santisima Fu3ga, designed as a dark,
terminal-inspired artist page. It includes artist information, music links,
selected gigs, press imagery, a technical rider, booking contact information,
and an animated code-themed background.

## Features

- Responsive two-column EPK layout that adapts to smaller screens.
- Animated code background displayed behind the page content.
- Hero video drawn in a canvas with grayscale, contrast, grain, and
  brightness-based transparency effects, processed at up to 15 frames per
  second and capped at 640 × 360 pixels for mobile performance.
- Press photo drawn into a canvas with grayscale and contrast filtering.
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
| `scripts.js` | Canvas image processing, system clock, and GitHub update lookup |
| `background.html` | Animated code background rendered in the page iframe |
| `media/pinterest-video.mp4` | Local source video for the canvas hero banner |
| `media/press-photo.jpg` | Local source image for the press-photo canvas |


## Pending

Before publishing, complete or verify these items in `index.html`:

- Replace both placeholder biography paragraphs with the final artist bio.
- Add the real SoundCloud player embed and link to the artist's profile.
- Replace the sample gig entries with confirmed events, venues, dates, and
  locations; remove any unconfirmed listings.
- Link the press-kit download button to the actual downloadable press-kit file.
- Replace `booking@yourdomain.com` with the active booking email address.
- Replace the `#` social links with the artist's Instagram, SoundCloud, and
  Resident Advisor profile URLs.

## Changelog

### 0.0.3

- Replaced the static hero-banner image with a looping local video rendered
  frame-by-frame through canvas.
- Preserved the hero's grayscale blend, contrast, grain, and transparent dark
  pixels, with a configurable 0–100 grayscale setting.
- Limited video canvas processing to 15 frames per second and a maximum
  640 × 360 canvas size for improved mobile performance.

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
