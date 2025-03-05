// bookings.js
console.log("Bookings.js filed loaded");


async function fetchBookingsFromServer() {
    try{
        const response = await fetch("http://localhost:5000/bookings");

        if(!response.ok){
            const cachedData = localStorage.getItem("userData");
            if(cachedData){
                console.log("Using cached bookings data");
                return JSON.parse(cachedData);
            }
            throw new Error("Error fetching bookings");
        }
        const bookings = await response.json();
        console.log("Received bookings from server:", bookings);

        if(bookings && bookings.length > 0) {
            localStorage.setItem("userData", JSON.stringify(bookings));
            return bookings;
        }else {
            console.log("No bookings received from server");
            return [];
        }
    } catch(error) {
        console.error("Error in getBookings:", error);
        throw error;
    }
}

async function initialiseBookings() {
    try {
        console.log("Initialising bookings...");
        const userData = await fetchBookingsFromServer();
        console.log("userData in bookings.js:", userData);

        if (userData && userData.length > 0) {
            console.log("Rendering bookings with data:", userData);
            renderBookings(userData);
        } else {
            console.log("No booking data available");
        }
    } catch (error) {
        console.error("Error initialising bookings:", error);
        // Check for cached data before giving up
        const cachedData = localStorage.getItem("userData");
        if(cachedData){
            console.log("Using cached bookings data after error");
            const parsedData = JSON.parse(cachedData);
            renderBookings(parsedData);
        }
        // If no cached data, return empty array instead of throwing
        return [];
    }
}

document.addEventListener("DOMContentLoaded", initialiseBookings);

// CREATING A NEW BOOKING

document.getElementById("new-booking-form").addEventListener("submit", async function(event){
    event.preventDefault(); // prevents the default form submission


    const newBookingData = {
        bookingId: document.getElementById("newBookingId").value,
        passengerName: document.getElementById("newPassengerName").value,
        cruiseDestination: document.getElementById("newCruiseDestination").value,
        departureDate: document.getElementById("newDepartureDate").value,
        status: document.getElementById("newStatus").value
    };

    try{
        // Send POST request to the server
        const response = await fetch("http://localhost:5000/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBookingData)
        });

        if(!response.ok){
            throw new Error("Failed to add booking");
        }
        alert("Booking added successfully");

        // Clear all form fields
        document.getElementById("new-booking-form").reset();

        // Refresh the booking list
        initialiseBookings();
    } catch(error){
        console.error("Error adding booking:", error);
        alert("Failed to add booking. Check console for details.");
    }
});


// Function to render bookings into the table
function renderBookings(bookings) {
    const tableBody = document.getElementById("booking-table-body");
    console.log("data has reached render function");

    // Clear the existing table body before rendering new rows
    tableBody.innerHTML = "";

    bookings.forEach(booking => {
        const row = document.createElement("tr");

        // Create and append table cells for each booking attribute
        const bookingIdCell = document.createElement("td");
        bookingIdCell.textContent = booking.bookingId;
        row.appendChild(bookingIdCell);

        const passengerNameCell = document.createElement('td');
        passengerNameCell.textContent = booking.passengerName;
        row.appendChild(passengerNameCell);

        const cruiseDestinationCell = document.createElement('td');
        cruiseDestinationCell.textContent = booking.cruiseDestination;
        row.appendChild(cruiseDestinationCell);

        const departureDateCell = document.createElement('td');
        departureDateCell.textContent = booking.departureDate;
        row.appendChild(departureDateCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = booking.status;
        row.appendChild(statusCell);

        const deleteButton = document.createElement("img");
        deleteButton.src = "./images/edit.png";
        deleteButton.classList.add("deleteBtn");


        deleteButton.addEventListener("click", async function(event){
            event.stopPropagation();

            const confirmation = confirm("Are you sure you want to delete this booking?");
            if(confirmation){
                try {
                    // Send Delete request to the server with specific _id
                    console.log("ATTEMPTING DELETE WITH BOOKING _ID", booking._id);

                    const response = await fetch(`http://localhost:5000/bookings/${booking._id}`, {
                        method: "DELETE"
                    });
                    if (!response.ok) {
                        throw new Error("Failed to delete booking");
                    }

                    alert("Booking deleted successfully");
                    initialiseBookings();
                }catch(error){
                    console.error("Error deleting booking", error);
                    alert("Failed to delete booking. Check console for details");
                }
            }

        });



        row.appendChild(deleteButton);

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

