const colorThief = new ColorThief();
const img = document.querySelector('.bgi');
// const palletesContainer = document.querySelector('.colors');
const searchInput = document.getElementById('searchInput');
const themePalette = document.querySelector('.themePalette');
const clockdiv = document.querySelector('.clock');
// const cardd = document.querySelectorAll('.card');
    // Make sure image is finished loading

if (img.complete) {
    colorThief.getColor(img);
} else {
    img.addEventListener('load', function() {
    colorThief.getColor(img);
    });
}



const palletes = colorThief.getPalette(img, 6);

const opacity = 0.2;
let rgbValue = `rgba(${palletes[0][0]},${palletes[0][1]},${palletes[0][2]},${opacity})`
searchInput.style.backgroundColor = rgbValue;

themePalette.innerHTML = '';

clockdiv.style.color = `rgb(${palletes[1][0]},${palletes[1][1]},${palletes[1][2]})`;

palletes.forEach(pallete => {
    let colorDiv = document.createElement('div');
    colorDiv.classList.add('pcolors')
    let colValue = `rgb(${pallete[0]},${pallete[1]},${pallete[2]})`
    colorDiv.style.backgroundColor = colValue;
    themePalette.appendChild(colorDiv);
    console.log(pallete);
});


