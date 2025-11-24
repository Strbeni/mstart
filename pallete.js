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
if (img.complete) {
    generatePalette();
} else {
    img.addEventListener('load', function () {
        generatePalette();
    });
}
