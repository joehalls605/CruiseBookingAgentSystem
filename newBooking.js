import { initSidebar } from './components/sidebar.js';

initSidebar();

document.addEventListener("DOMContentLoaded", async function () {
    const selectedCruise = JSON.parse(localStorage.getItem("selectedCruise"));
    console.log(selectedCruise);

    if (selectedCruise) {
        document.getElementById("tourTitle").textContent = selectedCruise.cruiseTitle;
        document.getElementById("shipName").textContent = selectedCruise.ship;
        document.getElementById("duration").textContent = `${selectedCruise.duration} nights`;
        document.getElementById("price").textContent = `£${selectedCruise.pricePerPerson} (PP)`;
    }

    // Set up form input elements
    const firstNameInput = document.getElementById("firstName");
    const surnameInput = document.getElementById("surname");

    const cabinDropdown = document.getElementById("cabinDropdown");
    cabinDropdown.innerHTML = "";

    // Rendering the cabins dropdown
    const cabinData = selectedCruise.cabins[0]; // grabbing the outer object in cabins array
    for(const [cabinType, details] of Object.entries(cabinData)){
        const newOption = document.createElement("option");
        newOption.value = cabinType;
        newOption.textContent = `${cabinType}`
        cabinDropdown.appendChild(newOption);
    }

    // Listen for the Confirm Booking button click
    document.getElementById("confirmBooking").addEventListener("click", async function () {
        const firstName = firstNameInput.value;
        const surname = surnameInput.value;
        const selectedCabinType = cabinDropdown.value;
        console.log("this is the selected cabin type from dropdown " + selectedCabinType);

        if (!firstName || !surname) {
            alert("Please fill in all fields.");
            return;
        }

        // Construct new booking object with the correct field names for MongoDB
        const newBooking = {
            bookingId: `B${Date.now()}`,  // Unique bookingId based on the timestamp
            firstName: `${firstName}`,
            surname: `${surname}`,
            cruiseDestination: selectedCruise.cruiseTitle,
            departureDate: selectedCruise.departureDate,  // Assuming departureDate exists in selectedCruise
            status: "Pending",  // Default status is "Pending"
            cabinType: selectedCabinType
        };
        console.log("this is the new booking:", newBooking);

        // Send POST request to create new booking
        try {
            const response = await fetch("http://localhost:5000/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newBooking)
            });

            if (response.ok) {
                alert("Booking created successfully!");
            } else {
                alert("Error creating booking.");
            }
        } catch (err) {
            console.error("Error posting booking:", err);
            alert("Server error. Please try again later.");
        }
    });
});
