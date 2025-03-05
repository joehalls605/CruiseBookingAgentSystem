import { initSidebar } from './components/sidebar.js';

initSidebar();

document.addEventListener("DOMContentLoaded", function () {
    const selectedCruise = JSON.parse(localStorage.getItem("selectedCruise"));
    console.log(selectedCruise);

    if (selectedCruise) {
        document.getElementById("tourTitle").textContent = selectedCruise.cruiseTitle;
        document.getElementById("shipName").textContent = selectedCruise.ship;
        document.getElementById("duration").textContent = `${selectedCruise.duration} nights`;
        document.getElementById("price").textContent = `£${selectedCruise.pricePerPerson} (PP)`;

        const cabins = selectedCruise.cabins[0];
        document.getElementById("interiorCabin").textContent = `Interior Cabin: ${cabins.interiorCabin.roomsAvailable}`;
        document.getElementById("oceanViewCabin").textContent = `Ocean View Cabin: ${cabins.oceanViewCabin.roomsAvailable}`;
        document.getElementById("suiteCabin").textContent = `Deluxe Suite: ${cabins.Suite.roomsAvailable}`;
    }
});

