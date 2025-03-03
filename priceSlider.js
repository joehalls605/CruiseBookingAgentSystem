// Select elements

// Left slider input
const rangeMin = document.querySelector(".range-min");
// Right slider input
const rangeMax = document.querySelector(".range-max");
// Progress blue bar between the sliders
const progress = document.querySelector(".progress");
// Number input for the minimum value
const inputMin = document.querySelector(".input-min");
// Number input for the maximum value
const inputMax = document.querySelector(".input-max");

// Define slider boundaries

// Minimum possible value took from min attribute of rangeMin
const minRange = parseInt(rangeMin.min);
// Maximum possible value took from max attribute of rangeMax
const maxRange = parseInt(rangeMax.max);
// Difference allowed between min and max values
let priceGap = 500; // Minimum difference between min and max values

// Function to update slider and progress bar
function updateSlider() {

    // Getting the current value of both sliders
    let minVal = parseInt(rangeMin.value);
    let maxVal = parseInt(rangeMax.value);

    // Checking if the difference between the sliders is less than (500)
    if (maxVal - minVal < priceGap) {
        // If the user is moving minimum slider, adjust minimum slider to maintain the gap
        // If the user is moving the maximum slider, adjust the maximum slider to maintain the gap
        if (document.activeElement === rangeMin) {
            rangeMin.value = maxVal - priceGap;
        } else {
            rangeMax.value = minVal + priceGap;
        }
    } else {
        // If the gap is acceptable
        // Update the number fields with the current slider values
        inputMin.value = minVal;
        inputMax.value = maxVal;

        // Calculate the percentage of both sliders (relative to full range)
        let minPercent = ((minVal - minRange) / (maxRange - minRange)) * 100;
        let maxPercent = ((maxVal - minRange) / (maxRange - minRange)) * 100;

        // Adjust blue bar's left and right positions based on these percentages
        progress.style.left = minPercent + "%";
        progress.style.right = (100 - maxPercent) + "%";
    }
}

// Event listeners for sliders
rangeMin.addEventListener("input", updateSlider);
rangeMax.addEventListener("input", updateSlider);

// Event listeners for number inputs
inputMin.addEventListener("input", function () {
    // Sourcing values from elements
    let minVal = parseInt(inputMin.value);
    let maxVal = parseInt(rangeMax.value);

    // If the new value maintains the gap and is not less than the minimum allowed value
    if (maxVal - minVal >= priceGap && minVal >= minRange) {
        // Update the slider position and call updateSlider to update the progress bar
        rangeMin.value = minVal;
        updateSlider();
    } else {
        // If invalid, reset the slider to current value
        inputMin.value = rangeMin.value;
    }
});

// Applying the same logic above to upper value
inputMax.addEventListener("input", function () {
    let maxVal = parseInt(inputMax.value);
    let minVal = parseInt(rangeMin.value);

    if (maxVal - minVal >= priceGap && maxVal <= maxRange) {
        rangeMax.value = maxVal;
        updateSlider();
    } else {
        inputMax.value = rangeMax.value;
    }
});

// Initialise slider positions as default
updateSlider();