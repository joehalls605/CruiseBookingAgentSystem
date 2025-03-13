// ===================== IMPORTS =====================
// Import functions for applying filters, search, and rendering
import { applyFilters } from './appFilters.js';
import { applySearch } from './components/search.js';
import { initSidebar } from './components/sidebar.js';
import { initModal } from './components/dateModal.js';
import {
    renderCruiseCatalogue,
    renderCruiseDestinations,
    renderDurationOptions,
    sortByOptionsRender
} from './appRenderFunctions.js';


// ===================== GLOBAL VARIABLES =====================
export let cruiseCatalogue = []; // Holds the currently displayed cruise catalogue data

// ===================== INITIALISE COMPONENTS =====================
initSidebar();
initModal();

// ===================== EVENT LISTENERS =====================

// APPLY FILTERS BUTTON
const applyFiltersElement = document.getElementById("applyFilters");
if (applyFiltersElement) {
    applyFiltersElement.addEventListener("click", applyFilters);
}

// SEARCH BUTTON
const searchButtonElement = document.getElementById("searchButton");
if (searchButtonElement) {
    searchButtonElement.addEventListener("click", applySearch);
}

// SORT BY DROPDOWN
const sortByElement = document.getElementById("sortOptions");
if (sortByElement) {
    sortByElement.addEventListener("change", sortByUpdate);
}

// ===================== DOM CONTENT LOADED =====================
document.addEventListener("DOMContentLoaded", async function () {
    // ===================== DARK MODE AND FONT SIZE =====================
    const darkModeStatus = localStorage.getItem("darkMode");
    if (darkModeStatus === "enabled") {
        document.documentElement.classList.add("darkMode");
    }

    const fontStatus = localStorage.getItem("fontSize") || "medium"; // Default to "medium" if no value is set
    document.documentElement.classList.add(`${fontStatus}Font`);

    const fontSizeElement = document.getElementById("fontSizeRange");
    if (fontSizeElement) {
        fontSizeElement.value = fontStatus;
    }

    // Fetch cruise data
    fetch("./data/cruiseCatalogue.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Parse the JSON response and update the catalogue
            cruiseCatalogue = data;
            console.log(cruiseCatalogue);

            // Only render cruise data if not on profile or settings pages
            renderCruiseCatalogue(cruiseCatalogue); // Render cruise catalogue
            renderCruiseDestinations(cruiseCatalogue.map(item => item.destination)); // Render destination dropdown
            renderDurationOptions(cruiseCatalogue.map(item => item.duration)); // Render duration filter
            sortByOptionsRender(); // Render sorting options
            console.log("Cruise data loaded and DOM initialised.");
        })
        .catch(error => {
            console.log("Current path:", window.location.pathname);
            console.error("Error fetching data:", error);
        });
});

// ===================== BOOK BUTTON =====================
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("book-button")) {
        const cruiseId = event.target.getAttribute("data-id"); // Get cruise ID

        // Find the cruise in the catalogue
        const selectedCruise = cruiseCatalogue.find(cruise => cruise.id === cruiseId);

        if (selectedCruise) {
            localStorage.setItem("selectedCruise", JSON.stringify(selectedCruise));
            window.location.href = "newBooking.html";
        }
    }
});

// ===================== EVENT HANDLERS =====================

// Handle Sort Change
function sortByUpdate() {
    const currentSortValue = sortByElement.value;

    if(!currentSortValue){
        // If "Best match" (empty value) is selected, do nothing or reset to default data
        renderCruiseCatalogue(cruiseCatalogue);
    }

    let sortedCatalogue;

    // Sort by price (low to high)
    if (currentSortValue === "price-low") {
        sortedCatalogue = [...cruiseCatalogue].sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    }
    // Sort by price (high to low)
    else if (currentSortValue === "price-high") {
        sortedCatalogue = [...cruiseCatalogue].sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    }
    // Sort by duration (high to low)
    else if (currentSortValue === "duration-high") {
        sortedCatalogue = [...cruiseCatalogue].sort((a, b) => a.duration - b.duration);
    }
    // Sort by duration (low to high)
    else if (currentSortValue === "duration-low") {
        sortedCatalogue = [...cruiseCatalogue].sort((a, b) => b.duration - a.duration);
    }

    // Render the sorted catalogue
    if (sortedCatalogue) {
        renderCruiseCatalogue(sortedCatalogue);
    } else {
        console.log("Unrecognised sorting option selected");
    }
}

// ===================== SERVER CONNECTION TEST =====================
fetch("http://localhost:5000/bookings")
    .then(response => response.json())
    .then(data => console.log("Direct server test:", data))
    .catch(error => console.error("Server test error - the server has not been turned on", error));
