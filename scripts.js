const heroCanvas = document.getElementById('heroCanvas');
const heroContext = heroCanvas.getContext('2d');
const heroVideo = document.createElement('video');
const heroFallbackImage = new Image();
heroVideo.muted = true;
heroVideo.loop = true;
heroVideo.autoplay = true;
heroVideo.playsInline = true;
heroVideo.preload = 'auto';
let heroFrameRequested = false;
let lastHeroRenderTime = 0;
const heroRenderInterval = 1000 / 15;
const maxHeroCanvasWidth = 640;
const maxHeroCanvasHeight = 360;
// Set from 0 (original color) to 100 (fully grayscale).
const HERO_GRAYSCALE_PERCENT = 100;
const heroGrayscaleAmount = Math.min(100, Math.max(0, HERO_GRAYSCALE_PERCENT)) / 100;
let heroFallbackActive = false;

// Draw each video frame to the canvas and apply its grayscale, grain, and transparency effects.
function drawHeroSource(source, sourceWidth, sourceHeight) {
    const width = heroCanvas.clientWidth;
    const height = heroCanvas.clientHeight;
    if (!width || !height) return;

    const scale = Math.min(
        window.devicePixelRatio || 1,
        1,
        maxHeroCanvasWidth / width,
        maxHeroCanvasHeight / height
    );
    const canvasWidth = Math.max(1, Math.round(width * scale));
    const canvasHeight = Math.max(1, Math.round(height * scale));
    if (heroCanvas.width !== canvasWidth || heroCanvas.height !== canvasHeight) {
        heroCanvas.width = canvasWidth;
        heroCanvas.height = canvasHeight;
    }
    heroContext.setTransform(canvasWidth / width, 0, 0, canvasHeight / height, 0, 0);

    const imageWidth = sourceWidth;
    const imageHeight = sourceHeight;
    const sourceRatio = imageWidth / imageHeight;
    const targetRatio = width / height;
    let sourceX = 0;
    let sourceY = 0;

    if (sourceRatio > targetRatio) {
        sourceWidth = imageHeight * targetRatio;
        sourceX = (imageWidth - sourceWidth) / 2;
    } else {
        sourceHeight = imageWidth / targetRatio;
        sourceY = (imageHeight - sourceHeight) * 0.45;
    }

    heroContext.drawImage(
        source,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, width, height
    );

    const imageData = heroContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;

    for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        let gray = (red + green + blue) / 3;
        gray = gray < 100 ? gray * 0.8 : gray * 1.2;

        const noise = (Math.random() - 0.5) * 40;
        const opacity = Math.min(1, Math.max(0, (gray - 35) / 100));
        pixels[index] = Math.min(255, Math.max(0, red + (gray - red) * heroGrayscaleAmount + noise));
        pixels[index + 1] = Math.min(255, Math.max(0, green + (gray - green) * heroGrayscaleAmount + noise));
        pixels[index + 2] = Math.min(255, Math.max(0, blue + (gray - blue) * heroGrayscaleAmount + noise));
        pixels[index + 3] *= opacity;
    }

    heroContext.putImageData(imageData, 0, 0);
}

// Render the current video frame, unless the still-image fallback is active.
function drawHeroVideoFrame() {
    if (heroFallbackActive || heroVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    drawHeroSource(heroVideo, heroVideo.videoWidth, heroVideo.videoHeight);
}

// Keep canvas processing synchronized to video frames, with a fallback for older browsers.
function requestHeroFrame() {
    if (heroFrameRequested || heroVideo.paused || heroVideo.ended) return;
    heroFrameRequested = true;

    const renderFrame = function () {
        heroFrameRequested = false;
        const now = performance.now();
        if (now - lastHeroRenderTime >= heroRenderInterval) {
            drawHeroVideoFrame();
            lastHeroRenderTime = now;
        }
        requestHeroFrame();
    };

    if (typeof heroVideo.requestVideoFrameCallback === 'function') {
        heroVideo.requestVideoFrameCallback(renderFrame);
    } else {
        window.requestAnimationFrame(renderFrame);
    }
}

// Fall back to the processed local banner image if video loading or playback fails.
function showHeroVideoError() {
    if (heroFallbackActive) return;
    heroFallbackActive = true;
    heroVideo.pause();
    heroVideo.removeAttribute('src');
    heroVideo.load();
    heroFallbackImage.onload = function () {
        drawHeroSource(heroFallbackImage, heroFallbackImage.naturalWidth, heroFallbackImage.naturalHeight);
    };
    heroFallbackImage.onerror = function () {
        const errorMessage = document.getElementById('hero-media-error');
        errorMessage.textContent = 'HERO VIDEO AND FALLBACK IMAGE FAILED TO LOAD';
        errorMessage.hidden = false;
    };
    heroFallbackImage.src = 'media/hero-banner.jpg';
}

heroVideo.addEventListener('loadeddata', function () {
    drawHeroVideoFrame();
    requestHeroFrame();
});
heroVideo.addEventListener('playing', requestHeroFrame);
heroVideo.addEventListener('error', showHeroVideoError);
heroVideo.src = 'media/pinterest-video.mp4';
heroVideo.play().catch(showHeroVideoError);
window.addEventListener('resize', function () {
    if (heroFallbackActive && heroFallbackImage.complete) {
        drawHeroSource(heroFallbackImage, heroFallbackImage.naturalWidth, heroFallbackImage.naturalHeight);
    } else {
        drawHeroVideoFrame();
    }
}, { passive: true });

// Load the animated code background only on non-mobile viewports.
const mobileViewport = window.matchMedia('(max-width: 767px)');
const backgroundFrame = document.getElementById('background-frame');
const backgroundSource = backgroundFrame.dataset.src;

function updateBackgroundForViewport() {
    if (mobileViewport.matches) {
        backgroundFrame.remove();
        return;
    }

    if (!backgroundFrame.isConnected) {
        document.body.prepend(backgroundFrame);
    }
    if (!backgroundFrame.hasAttribute('src')) {
        backgroundFrame.src = backgroundSource;
    }
}

mobileViewport.addEventListener('change', updateBackgroundForViewport);
updateBackgroundForViewport();

const pressCanvas = document.getElementById('pressCanvas');
const pressContext = pressCanvas.getContext('2d');
const pressImage = new Image();

// Size the press-photo canvas and draw the filtered local image.
pressImage.onload = function () {
    pressCanvas.width = pressImage.naturalWidth;
    pressCanvas.height = pressImage.naturalHeight;
    pressContext.filter = 'grayscale(1) contrast(1.2)';
    pressContext.drawImage(pressImage, 0, 0);
};

// Show a visible status message if the press photo cannot be loaded.
pressImage.onerror = function () {
    const errorMessage = document.getElementById('press-image-error');
    errorMessage.textContent = 'PRESS IMAGE FAILED TO LOAD';
    errorMessage.hidden = false;
};

pressImage.src = 'media/press-photo.jpg';

// Refresh the displayed system clock using the viewer's local time.
function updateClock() {
    const clockElement = document.getElementById('sys-clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `SYS_TIME: ${hours}:${minutes}:${seconds}`;
}

window.setInterval(updateClock, 1000);
updateClock();

// Fetch the repository's latest commit date from GitHub and display it in UTC.
async function displayLastUpdate() {
    const updateElement = document.getElementById('sys-update');
    const url = 'https://api.github.com/repos/nocturnouy/epk/commits?per_page=1';

    try {
        const response = await fetch(url, {
            headers: { Accept: 'application/vnd.github+json' }
        });
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const [latestCommit] = await response.json();
        const commitDate = new Date(latestCommit.commit.committer.date);
        if (Number.isNaN(commitDate.getTime())) {
            throw new Error('GitHub returned an invalid commit date');
        }

        const formattedDate = commitDate.toISOString().replace('T', ' ').slice(0, 16);
        updateElement.textContent = `SYS_UPDATE: ${formattedDate} UTC`;
    } catch (error) {
        console.error('Could not fetch the latest repository commit date.', error);
        updateElement.textContent = 'SYS_UPDATE: OFFLINE';
    }
}

displayLastUpdate();
