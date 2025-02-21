/*
TODO:
Sort duration filtering.

*/


// Import functions for applying filters, search, and rendering
import { applyFilters } from './filters.js';
import { applySearch } from './search.js';
import { renderCruiseCatalogue, renderCruiseDestinations, renderDurationOptions, sortByOptionsRender} from './render.js';

export let cruiseCatalogue = [];

const applyFiltersElement = document.getElementById("applyFilters");
if(applyFiltersElement) {
    applyFiltersElement.addEventListener("click", applyFilters);
}

const searchButtonElement = document.getElementById("searchButton");
if(searchButtonElement){
    searchButtonElement.addEventListener("click", applySearch);

}

const sortByElement = document.getElementById("sortOptions");

if(sortByElement) {
    sortByElement.addEventListener("change", sortByUpdate);
}

// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", function () {

    // TESTING THE FETCHING USERS FROM MONGODB

    const fetchUsersButton = document.getElementById("fetchUsersButton");
    const usersDisplay = document.getElementById("usersDisplay");

    if(fetchUsersButton){
        fetchUsersButton.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:5000/users");
                if (!response.ok) {
                    throw new Error("Error fetching users");
                }

                const users = await response.json(); // (returned from backend) Parse the JSON response from the backend into a JavaScript array of user objects

                // Clearing previous display
                usersDisplay.innerHTML = '';

                // Display users in div
                users.forEach(user => {
                    const userElement = document.createElement("div");
                    userElement.textContent = `Name: ${user.name}, Email: ${user.email}, Age: ${user.age}`
                    usersDisplay.appendChild(userElement);
                });
            }
            catch(error){
                usersDisplay.innerHTML = "Error fetching users: " + error.message;
            }
        })
    }







    // Dark mode:
    const darkModeStatus = localStorage.getItem("darkMode");
    if(darkModeStatus === "enabled"){
        document.documentElement.classList.add("darkMode");
    }
    // Font size:
    const fontStatus = localStorage.getItem("fontSize") || "medium"; // Default to "medium" if no value is set
    document.documentElement.classList.add(`${fontStatus}Font`);

    const fontSizeElement = document.getElementById("fontSizeRange");
    if(fontSizeElement){
        fontSizeElement.value = fontStatus;
    }


    // Check for email in localStorage
    const loggedIn = localStorage.getItem("loggedIn");

    if(loggedIn){
        window.location.href = "login.html";
    }
    else{
        fetch(window.location.pathname.includes("bookings.html") ? "/CruiseBookingSystem/cruiseCatalogue.json" : "./cruiseCatalogue.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            // Once the fetch request is complete, the response is recieved. The response is an object that represents the HTTP response and calling .json parse the response body as JSON. This returns a promise that resolves to the parsed data.
        .then(data => { // The data here is the parsed content from cruiseCatalogue.json.
            cruiseCatalogue = data; 
            console.log(cruiseCatalogue);

            if(!window.location.pathname.includes("bookings.html") && !window.location.pathname.includes("profile.html") && !window.location.pathname.includes("settings.html")){
                renderCruiseCatalogue(cruiseCatalogue);  // Render catalogue
                renderCruiseDestinations(cruiseCatalogue.map(item => item.destination));  // Render destination dropdown
                renderDurationOptions(cruiseCatalogue.map(item => item.duration));
                sortByOptionsRender();
                console.log("Cruise data loaded and DOM initialised.");
            }
        })
        .catch(error => {
            console.error("Error loading cruise data:", error);
            console.log("current path:", window.location.pathname);
        })
    }
    // Fetch the cruise data. This makes the network request to fetch the file from cruiseCatalogue.json.
   
});

function sortByUpdate(){
    const currentSortValue = sortByElement.value;
    
    let sortedCatalogue;

    if(currentSortValue === "price-low"){
        sortedCatalogue = [...cruiseCatalogue].sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    }
    else if(currentSortValue === "price-high"){
        sortedCatalogue = [...cruiseCatalogue].sort((a,b) => b.pricePerPerson - a.pricePerPerson);
    }
    else if(currentSortValue === "duration-high"){
        sortedCatalogue = [...cruiseCatalogue].sort((a,b) => a.duration - b.duration);
    }
    else if(currentSortValue === "duration-low"){
        sortedCatalogue = [...cruiseCatalogue].sort((a,b) => b.duration - a.duration)
    }

    if(sortedCatalogue){
        renderCruiseCatalogue(sortedCatalogue);
    }
    else{
        console.log("Unrecognised sorting option selected");
    }
};

/* SIDE BAR */

// Get elements
const sidebar = document.getElementById("sidebar");
// const content = document.getElementById("content");
const toggleBtn = document.getElementById("toggle-btn");

// Toggle sidebar visibility
if(toggleBtn){
    toggleBtn.classList.add("toggle");
    toggleBtn.addEventListener("click", collapsed);
}

function collapsed(){
    sidebar.classList.toggle("open");  // Toggle the 'open' class for the sidebar
    document.getElementById('content-wrapper').classList.toggle("sidebar-open");
    toggleBtn.classList.toggle("rotated");
}

// MODAL

const modal = document.getElementById("modal");

const dateButtonElement = document.getElementById("dateButton");
const closeBtnElement = document.getElementById("closeBtn");
const confirmButtonElement = document.getElementById("confirmBtn");

dateButtonElement.addEventListener("click", () => {
    modal.classList.add("visible"); // Hide modal
});

closeBtnElement.addEventListener("click", closeBtnElementHandler);

function closeBtnElementHandler(){
    modal.classList.remove("visible"); // Hide modal
}

confirmButtonElement.addEventListener("click", confirmDateOptions);

function confirmDateOptions(){
    let selectedMonths = [];
    const checkboxes = document.querySelectorAll('#datesOptions input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        if(checkbox.checked){
            selectedMonths.push(checkbox.dataset.month);
        }
    });
    closeBtnElementHandler();
    console.log(selectedMonths);
}

