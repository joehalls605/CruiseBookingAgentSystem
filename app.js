// ===================== IMPORTS =====================
// Import functions for applying filters, search, and rendering
import { applyFilters } from './filters.js';
import { applySearch } from './search.js';
import { initSidebar } from './components/sidebar.js';
import { initModal } from './components/modal.js';
import {
    renderCruiseCatalogue,
    renderCruiseDestinations,
    renderDurationOptions,
    sortByOptionsRender
} from './render.js';

// ===================== GLOBAL VARIABLES =====================
export let cruiseCatalogue = []; // Holds the cruise catalogue data

// ===================== INITIALISE COMPONENTS =====================
initSidebar();
initModal();

// ===================== EVENT LISTENERS =====================

// Apply Filters
const applyFiltersElement = document.getElementById("applyFilters");
if (applyFiltersElement) {
    applyFiltersElement.addEventListener("click", applyFilters);
}

// Search Button
const searchButtonElement = document.getElementById("searchButton");
if (searchButtonElement) {
    searchButtonElement.addEventListener("click", applySearch);
}

// Sort By Dropdown
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

    // ===================== CHECK USER LOGIN =====================
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn) {
        window.location.href = "login.html"; // Redirect to login page if user is logged in
    } else {
        // Fetch cruise data if not logged in
        fetch(
            window.location.pathname.includes("bookings.html")
                ? "/CruiseBookingSystem/cruiseCatalogue.json"
                : "./cruiseCatalogue.json"
        )
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
                if (
                    !window.location.pathname.includes("bookings.html") &&
                    !window.location.pathname.includes("profile.html") &&
                    !window.location.pathname.includes("settings.html")
                ) {
                    renderCruiseCatalogue(cruiseCatalogue); // Render cruise catalogue
                    renderCruiseDestinations(cruiseCatalogue.map(item => item.destination)); // Render destination dropdown
                    renderDurationOptions(cruiseCatalogue.map(item => item.duration)); // Render duration filter
                    sortByOptionsRender(); // Render sorting options
                    console.log("Cruise data loaded and DOM initialised.");
                }
            })
            .catch(error => {
                console.log("Current path:", window.location.pathname);
            });
    }
});

// BOOK BUTTON

document.addEventListener("click", function(event){
    if(event.target.classList.contains("book-button")){
        const cruiseId = event.target.getAttribute("data-id"); // Get cruise ID

        // Find the cruise in the catalogue
        const selectedCruise = cruiseCatalogue.find(cruise => cruise.id === cruiseId);

        if(selectedCruise){
            localStorage.setItem("selectedCruise", JSON.stringify(selectedCruise));
            window.location.href = "newBooking.html";
        }

    }
});

// ===================== EVENT HANDLERS =====================

// Handle Sort Change
function sortByUpdate() {
    const currentSortValue = sortByElement.value;
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
