// Global variables to store slider values
let currentMinValue = null;
let currentMaxValue = null;



// range slider circles
const sliderMin = document.querySelector('.range-min'); // Selects the minimum range slider
const sliderMax = document.querySelector('.range-max'); // Selects the maximum range slider

// progress bar
const progressBar = document.querySelector('.progress'); // Selects the progress bar element

// price input fields
const numberInputMin = document.querySelector('.input-min'); // Selects the minimum price input field
const numberInputMax = document.querySelector('.input-max'); // Selects the maximum price input field

// Function to update the UI of the slider and progress bar
function updateSliderUI(){
    const sliderMinValue = parseInt(sliderMin.value);
    const sliderMaxValue = parseInt(sliderMax.value);

    // Ensure that the minimum slider value is always less than the maximum slider value
    if (sliderMinValue >= sliderMaxValue) {
        sliderMin.value = sliderMaxValue - 100;
    }
    if (sliderMaxValue <= sliderMinValue) {
        sliderMax.value = sliderMinValue + 100;
    }

    // Calculate the positions of the sliders as a percentage of their maximum value
    const minPosition = (sliderMin.value / sliderMin.max * 100);
    const maxPosition = (sliderMax.value / sliderMax.max * 100);


    // Update the progress bar's left and right positions based on the slider values
    progressBar.style.left = `${minPosition}%`;
    progressBar.style.right = `${100 - maxPosition}%`;

    // Update the input fields with the current slider values
    numberInputMin.value = sliderMin.value; // Set the value of the minimum input field
    numberInputMax.value = sliderMax.value; // Set the value of the maximum input field

    // Adding to global variables for use in other files.
    currentMinValue = sliderMin.value;
    currentMaxValue = sliderMax.value;
    console.log(currentMinValue, currentMaxValue);

}

// Event listeners to update the UI whenever the slider values change
sliderMin.addEventListener("input", updateSliderUI);
sliderMax.addEventListener("input", updateSliderUI);

// Event listeners for when the input fields change, to update the corresponding slider
numberInputMin.addEventListener("change", ()=>{
    sliderMin.value = numberInputMin.value;
    updateSliderUI();
});

numberInputMax.addEventListener("change", ()=>{
    sliderMax.value = numberInputMax.value;
    updateSliderUI();
});

// Initial setup to display the correct UI state
updateSliderUI();

export function getSliderValues(){
    return{
        min: currentMinValue,
        max: currentMaxValue
    }
}
