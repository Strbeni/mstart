// Wallpaper Upload Module
// Handles custom wallpaper uploads from local files or URLs
// Manages state persistence using localStorage

const STORAGE_KEY = 'custom_wallpaper';

// Load saved wallpaper on page load
function loadSavedWallpaper() {
    const savedWallpaper = localStorage.getItem(STORAGE_KEY);

    if (savedWallpaper) {
        try {
            const wallpaperData = JSON.parse(savedWallpaper);
            applyWallpaper(wallpaperData.url, wallpaperData.type);
        } catch (error) {
            console.error('Error loading saved wallpaper:', error);
            localStorage.removeItem(STORAGE_KEY);
        }
    }
}

// Apply wallpaper and regenerate palette
function applyWallpaper(url, type = 'url') {
    // Update body background
    document.body.style.backgroundImage = `url('${url}')`;

    // Create a temporary image element for ColorThief
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous'; // Handle CORS for external URLs

    tempImg.onload = function () {
        // Regenerate palette with the new image
        if (window.generatePalette) {
            window.generatePalette(tempImg);
        }
    };

    tempImg.onerror = function () {
        console.error('Failed to load wallpaper:', url);
        alert('Failed to load the wallpaper. Please try another image.');
    };

    tempImg.src = url;

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ url, type }));
}

// Handle local file upload
function handleFileUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }

    // Read file as data URL
    const reader = new FileReader();

    reader.onload = function (e) {
        applyWallpaper(e.target.result, 'file');
    };

    reader.onerror = function () {
        alert('Failed to read the file. Please try again.');
    };

    reader.readAsDataURL(file);
}

// Handle URL input
function handleUrlInput() {
    const urlInput = document.getElementById('wallpaperUrl');
    const url = urlInput.value.trim();

    if (!url) {
        alert('Please enter a valid image URL.');
        return;
    }

    // Basic URL validation
    try {
        new URL(url);
        applyWallpaper(url, 'url');
        urlInput.value = ''; // Clear input after successful upload
    } catch (error) {
        alert('Please enter a valid URL.');
    }
}

// Reset to default wallpaper
function resetWallpaper() {
    localStorage.removeItem(STORAGE_KEY);
    document.body.style.backgroundImage = "url('./assets/bg2.jpg')";

    // Regenerate palette with default image
    const defaultImg = document.querySelector('.bgi');
    if (defaultImg && window.generatePalette) {
        if (defaultImg.complete) {
            window.generatePalette(defaultImg);
        } else {
            defaultImg.addEventListener('load', function () {
                window.generatePalette(defaultImg);
            });
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Load saved wallpaper if exists
    loadSavedWallpaper();

    // Set up file upload listener
    const fileInput = document.getElementById('wallpaperFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    // Set up URL input listener
    const urlButton = document.getElementById('applyUrlBtn');
    if (urlButton) {
        urlButton.addEventListener('click', handleUrlInput);
    }

    // Set up reset button listener
    const resetButton = document.getElementById('resetWallpaper');
    if (resetButton) {
        resetButton.addEventListener('click', resetWallpaper);
    }

    // Allow Enter key to submit URL
    const urlInput = document.getElementById('wallpaperUrl');
    if (urlInput) {
        urlInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleUrlInput();
            }
        });
    }
});
