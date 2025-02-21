/*
TODO:
Sort duration filtering.
*/

// ===================== IMPORTS =====================
// Import functions for applying filters, search, and rendering
import { applyFilters } from './filters.js';
import { applySearch } from './search.js';
import { renderCruiseCatalogue, renderCruiseDestinations, renderDurationOptions, sortByOptionsRender } from './render.js';

// ===================== GLOBAL VARIABLES =====================
export let cruiseCatalogue = []; // Holds the cruise catalogue data

// ===================== EVENT LISTENERS =====================

// Apply filters when the 'Apply Filters' button is clicked
const applyFiltersElement = document.getElementById("applyFilters");
if (applyFiltersElement) {
    applyFiltersElement.addEventListener("click", applyFilters);
}

// Apply search when the 'Search' button is clicked
const searchButtonElement = document.getElementById("searchButton");
if (searchButtonElement) {
    searchButtonElement.addEventListener("click", applySearch);
}

// Handle sorting options when the 'Sort By' dropdown changes
const sortByElement = document.getElementById("sortOptions");
if (sortByElement) {
    sortByElement.addEventListener("change", sortByUpdate);
}

// ===================== DOM CONTENT LOADED =====================

document.addEventListener("DOMContentLoaded", function () {

    // ===================== TESTING FETCHING USERS =====================
    const fetchUsersButton = document.getElementById("fetchUsersButton");
    const usersDisplay = document.getElementById("usersDisplay");

    // Fetch users from backend when 'Fetch Users' button is clicked
    if (fetchUsersButton) {
        fetchUsersButton.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:5000/users");
                if (!response.ok) {
                    throw new Error("Error fetching users");
                }

                const users = await response.json(); // Parse the JSON response from the backend
                localStorage.setItem("userData", JSON.stringify(users));

                // Clear previous display
                usersDisplay.innerHTML = '';

                // Display fetched users
                users.forEach(user => {
                    const userElement = document.createElement("div");
                    userElement.textContent = `Name: ${user.name}, Email: ${user.email}, Age: ${user.age}`;
                    usersDisplay.appendChild(userElement);
                });
            } catch (error) {
                usersDisplay.innerHTML = "Error fetching users: " + error.message;
            }
        });
    }

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
        fetch(window.location.pathname.includes("bookings.html") ? "/CruiseBookingSystem/cruiseCatalogue.json" : "./cruiseCatalogue.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => { // Parse the JSON response and update the catalogue
                cruiseCatalogue = data;
                console.log(cruiseCatalogue);

                // Only render cruise data if not on profile or settings pages
                if (!window.location.pathname.includes("bookings.html") && !window.location.pathname.includes("profile.html") && !window.location.pathname.includes("settings.html")) {
                    renderCruiseCatalogue(cruiseCatalogue); // Render cruise catalogue
                    renderCruiseDestinations(cruiseCatalogue.map(item => item.destination)); // Render destination dropdown
                    renderDurationOptions(cruiseCatalogue.map(item => item.duration)); // Render duration filter
                    sortByOptionsRender(); // Render sorting options
                    console.log("Cruise data loaded and DOM initialised.");
                }
            })
            .catch(error => {
                console.error("Error loading cruise data:", error);
                console.log("Current path:", window.location.pathname);
            });
    }
});

// ===================== SORTING FUNCTION =====================

// Handles sorting the catalogue based on selected option
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

// ===================== SIDEBAR TOGGLER =====================

// Get elements
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");

// Toggle sidebar visibility
if (toggleBtn) {
    toggleBtn.classList.add("toggle");
    toggleBtn.addEventListener("click", collapsed);
}

// Toggle the 'open' class to show or hide the sidebar
function collapsed() {
    sidebar.classList.toggle("open");
    document.getElementById('content-wrapper').classList.toggle("sidebar-open");
    toggleBtn.classList.toggle("rotated");
}

// ===================== MODAL DIALOG =====================

// Modal elements
const modal = document.getElementById("modal");
const dateButtonElement = document.getElementById("dateButton");
const closeBtnElement = document.getElementById("closeBtn");
const confirmButtonElement = document.getElementById("confirmBtn");

// Show the modal when the 'Select Dates' button is clicked
dateButtonElement.addEventListener("click", () => {
    modal.classList.add("visible");
});

// Hide the modal when the 'Close' button is clicked
closeBtnElement.addEventListener("click", closeBtnElementHandler);

function closeBtnElementHandler() {
    modal.classList.remove("visible");
}

// Collect selected months when the 'Confirm' button is clicked
confirmButtonElement.addEventListener("click", confirmDateOptions);

function confirmDateOptions() {
    let selectedMonths = [];
    const checkboxes = document.querySelectorAll('#datesOptions input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedMonths.push(checkbox.dataset.month);
        }
    });
    closeBtnElementHandler(); // Hide the modal after confirming
    console.log(selectedMonths); // Log selected months
}
