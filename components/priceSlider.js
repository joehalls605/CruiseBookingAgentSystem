// range slider circles
const sliderMin = document.querySelector('.range-min');
const sliderMax = document.querySelector('.range-max');

// progress bar
const progressBar = document.querySelector('.progress');

// price input fields
const numberInputMin = document.querySelector('.input-min');
const numberInputMax = document.querySelector('.input-max');

function updateSliderUI(){
    const sliderMinValue = parseInt(sliderMin.value);
    const sliderMaxValue = parseInt(sliderMax.value);

    if (sliderMinValue >= sliderMaxValue - 100) {
        sliderMin.value = sliderMaxValue - 100;
    }
    if (sliderMaxValue <= sliderMinValue + 100) {
        sliderMax.value = sliderMinValue + 100;
    }


    const minPosition = (sliderMin.value / sliderMin.max * 100);
    const maxPosition = (sliderMax.value / sliderMax.max * 100);

    progressBar.style.left = `${minPosition}%`;
    progressBar.style.right = `${100 - maxPosition}%`;

    sliderMin.value = numberInputMin.value;
    sliderMax.value = numberInputMax.value;
}

// Event listeners to activate sliders
sliderMin.addEventListener("change", updateSliderUI);
sliderMax.addEventListener("change", updateSliderUI);

numberInputMin.addEventListener("change", ()=>{
    sliderMin.value = numberInputMin.value;
    updateSliderUI();
});

numberInputMax.addEventListener("change", ()=>{
    sliderMax.value = numberInputMax.value;
    updateSliderUI();
});

// Initial setup
updateSliderUI();


