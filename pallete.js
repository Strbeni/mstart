const colorThief = new ColorThief();
const img = document.querySelector('.bgi');
const searchInput = document.getElementById('searchInput');
const themePalette = document.querySelector('.themePalette');
const inputBox = document.querySelector('.input-wrapper');
const clockdiv = document.querySelector('.clock');

// Function to generate palette and apply colors
// Can be called with a custom image element or defaults to the .bgi element
function generatePalette(imageElement = img) {
    try {
        // Check if image is loaded and has valid dimensions
        if (!imageElement.complete || imageElement.naturalWidth === 0) {
            console.warn('Image not loaded yet, skipping palette generation');
            return;
        }

        const palletes = colorThief.getPalette(imageElement, 6);

        const opacity = 0.2;
        let rgbValue = `rgba(${palletes[0][0]},${palletes[0][1]},${palletes[0][2]},${opacity})`;
        searchInput.style.backgroundColor = rgbValue;

        themePalette.innerHTML = '';

        clockdiv.style.color = `rgb(${palletes[1][0]},${palletes[1][1]},${palletes[1][2]})`;

        palletes.forEach(pallete => {
            let colorDiv = document.createElement('div');
            colorDiv.classList.add('pcolors');
            let colValue = `rgb(${pallete[0]},${pallete[1]},${pallete[2]})`;
            colorDiv.style.backgroundColor = colValue;
            colorDiv.addEventListener('click', () => {
                const cardd = document.querySelectorAll('.card');
                cardd.forEach(card => {
                    card.style.backgroundColor = colValue;
                });
                clockdiv.style.color = colValue;
                inputBox.style.backgroundColor = colValue;
            });
            themePalette.appendChild(colorDiv);
        });
    } catch (error) {
        console.error('Error generating palette:', error);
    }
}

// Make palette generation function globally accessible
window.generatePalette = generatePalette;

// Make sure image is finished loading
if (img.complete && img.naturalWidth > 0) {
    generatePalette();
} else {
    img.addEventListener('load', function () {
        generatePalette();
    });
    // Add error handler in case image fails to load
    img.addEventListener('error', function () {
        console.error('Failed to load background image');
    });
}
