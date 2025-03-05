// Import needed functions
import { renderCruiseCatalogue } from './appRenderFunctions.js';
import { cruiseCatalogue } from './app.js';
import { destinationThankYou } from './appRenderFunctions.js';

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

    const applyFiltersButton = document.getElementById("applyFilters");
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", applyFilters);
    }

    const filterByPriceMinInputElement = document.getElementById("filterByPriceMinInput");
    const filterByPriceMaxInputElement = document.getElementById("filterByPriceMaxInput");
    const durationOptionsElement = document.getElementById("durationOptions");
    const firstnameElement = document.getElementById("firstnameInput");
    const surnameElement = document.getElementById("surnameInput");
    const ageElement = document.getElementById("ageInput");

    const minPrice = Number(filterByPriceMinInputElement.value) || 0;
    const maxPrice = Number(filterByPriceMaxInputElement.value) || Infinity;

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
        if(durationOptionsElement.value === "Any"){
            return true
        }
        if(duration && duration !== element.duration) return false;

        /* Cruise element passes all conditions*/
        return true;
    });

    const discountPercentage = Number(discountRange.value) || 0;

    // Applying discount to the filtered catalogue
    const discountedCatalogue = filteredCatalogue.map(item => {

        if (typeof item.pricePerPerson !== 'number' || isNaN(item.pricePerPerson)) {
            console.error("Invalid pricePerPerson:", item.pricePerPerson);
            return { ...item, pricePerPerson: "Error" }; // Mark problematic data
        }

        const discountedPrice = item.pricePerPerson * (1 - discountPercentage / 100);
        const roundedPrice = Math.round(discountedPrice * 100) / 100;
        console.log("Price:", item.pricePerPerson, "Discount:", discountPercentage);
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

    // processBooking(bookingDetails);
    
    destinationThankYou(selectedDestination);

    renderCruiseCatalogue(discountedCatalogue);  // Render filtered results
}
