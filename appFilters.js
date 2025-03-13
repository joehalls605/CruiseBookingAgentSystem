// Import needed functions
import { renderCruiseCatalogue } from './appRenderFunctions.js';
import {getSelectedMonths} from './components/dateModal.js';
import {storeDestination} from './storeDestination.js';
import {cruiseCatalogue} from './app.js';
import { getSliderValues } from './components/priceSlider.js';


const applyFiltersButton = document.getElementById("applyFilters");
if (applyFiltersButton) {
    applyFiltersButton.addEventListener("click", applyFilters);
}

const discountRange = document.getElementById("discountRange");
const discountValue = document.getElementById("discountValue");


if(discountRange){
    discountRange.addEventListener("input", function(){
        const discountPercentage = Number(discountRange.value) || 0;
        discountValue.textContent = `${discountRange.value}%`
    })
}


// APPLY FILTERS

export function applyFilters() {

    let sliderValues = getSliderValues();
    let minSliderPrice = Number(sliderValues.min);
    let maxSliderPrice = Number(sliderValues.max);

    console.log("Filter by price:", minSliderPrice, maxSliderPrice);

    const applyFiltersButton = document.getElementById("applyFilters");
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", applyFilters);
    }

    const durationOptionsElement = document.getElementById("durationOptions");

    // FILTER BY PRICE
    const minPrice = minSliderPrice;
    const maxPrice = maxSliderPrice;

    const destinationElement = document.getElementById("destinationOptions");
    const destination = destinationElement.value;
    const selectedDestination = storeDestination();

    // Ternary practice
    let isSelectedDestinationTrue = (selectedDestination) ? "Yes it is true" : "No it is not true";
    console.log(isSelectedDestinationTrue);


    const duration = Number(durationOptionsElement.value) || 0;

    console.log("Current cruiseCatalogue:", cruiseCatalogue);

    let filteredCatalogue = cruiseCatalogue.filter(function (element) {
        /* If the element passes all the conditions above, the function includes it in the filtered array */

        // Checking the price range
        if (maxPrice > 0 && element.pricePerPerson > maxPrice) return false;
        if (element.pricePerPerson < minPrice) return false;

        // Checking the destination
        if(destination === "Any"){
            return true
        }
        if (destination && element.destination !== destination) return false;

        // Checking the duration
        if(duration!== 0 && element.duration !== duration){
            return false;
        }
        // Passes all conditions
        return true;
        /* Cruise element passes all conditions*/
    });

    // CHECKING THE CATALOGUE AGAINST THE DATES

    const selectedDates = getSelectedMonths();

    if(selectedDates && selectedDates.length > 0){
        filteredCatalogue = filteredCatalogue.filter(item => {
            const departureDate = item.departureDate;
            const dateObj = new Date(departureDate);
            const monthName = dateObj.toLocaleString("en-US", {month: "long"});
            return selectedDates.includes(monthName);
        })
    }


    const discountPercentage = Number(discountRange.value) || 0;

    // Applying discount to the filtered catalogue
    const discountedCatalogue = filteredCatalogue.map(item => {

        if (typeof item.pricePerPerson !== 'number' || isNaN(item.pricePerPerson)) {
            console.error("Invalid pricePerPerson:", item.pricePerPerson);
            return { ...item, pricePerPerson: "Error" }; // Mark problematic data
        }

        const discountedPrice = item.pricePerPerson * (1 - discountPercentage / 100);
        const roundedPrice = Math.round(discountedPrice * 100) / 100;
        return {
            ...item, // copy existing properties
            pricePerPerson: roundedPrice // Update the price with discounted value
        }
    })



    console.log(discountedCatalogue);
    // exporting discounted catalogue for use in newBooking.js

    // Combining the filtered catalogue with the name and age into a single booking object

    const bookingDetails = {
        bookings: discountedCatalogue
    };

    // The actively displayed cruise catalogue
    // Rest the catalogue first, then push latest catalogue
    cruiseCatalogue.length = 0;
    cruiseCatalogue.push(...discountedCatalogue);

    renderCruiseCatalogue(discountedCatalogue);  // Render filtered results
}
