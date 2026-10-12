const heroCanvas = document.getElementById('heroCanvas');
const heroContext = heroCanvas.getContext('2d');
const heroImage = new Image();

// Draw the hero image to the canvas and apply its grayscale, grain, and transparency effects.
function drawHeroImage() {
    const width = heroCanvas.clientWidth;
    const height = heroCanvas.clientHeight;
    if (!width || !height || !heroImage.complete) return;

    const pixelRatio = window.devicePixelRatio || 1;
    heroCanvas.width = Math.round(width * pixelRatio);
    heroCanvas.height = Math.round(height * pixelRatio);
    heroContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const sourceRatio = heroImage.naturalWidth / heroImage.naturalHeight;
    const targetRatio = width / height;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = heroImage.naturalWidth;
    let sourceHeight = heroImage.naturalHeight;

    if (sourceRatio > targetRatio) {
        sourceWidth = heroImage.naturalHeight * targetRatio;
        sourceX = (heroImage.naturalWidth - sourceWidth) / 2;
    } else {
        sourceHeight = heroImage.naturalWidth / targetRatio;
        sourceY = (heroImage.naturalHeight - sourceHeight) * 0.45;
    }

    heroContext.drawImage(
        heroImage,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, width, height
    );

    const imageData = heroContext.getImageData(0, 0, heroCanvas.width, heroCanvas.height);
    const pixels = imageData.data;

    for (let index = 0; index < pixels.length; index += 4) {
        let gray = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        gray = gray < 100 ? gray * 0.8 : gray * 1.2;

        const noise = (Math.random() - 0.5) * 40;
        const value = Math.min(255, Math.max(0, gray + noise));
        const opacity = Math.min(1, Math.max(0, (gray - 35) / 100));
        pixels[index] = value;
        pixels[index + 1] = value;
        pixels[index + 2] = value;
        pixels[index + 3] *= opacity;
    }

    heroContext.putImageData(imageData, 0, 0);
}

heroImage.onload = drawHeroImage;
// Show a visible status message if the hero image cannot be loaded.
heroImage.onerror = function () {
    const errorMessage = document.getElementById('hero-image-error');
    errorMessage.textContent = 'HERO IMAGE FAILED TO LOAD';
    errorMessage.hidden = false;
};
heroImage.src = 'media/hero-banner.jpg';
window.addEventListener('resize', drawHeroImage, { passive: true });

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
