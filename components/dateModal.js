// ===================== MODAL DIALOG =====================

let selectedMonths = [];

export function initModal(){

// Modal elements
    const dateModal = document.getElementById("modal");
    const dateButtonElement = document.getElementById("dateButton");
    const closeBtnElement = document.getElementById("closeBtn");
    const confirmButtonElement = document.getElementById("confirmBtn");

if(dateButtonElement){
    dateButtonElement.addEventListener("click", () => {
        dateModal.classList.add("visible");
    });
}

// Hide the modal when the 'Close' button is clicked
    if(closeBtnElement){
        closeBtnElement.addEventListener("click", closeBtnElementHandler);
    }

    function closeBtnElementHandler() {
        dateModal.classList.remove("visible");
    }

// Collect selected months when the 'Confirm' button is clicked
    if(confirmButtonElement){
        confirmButtonElement.addEventListener("click", confirmDateOptions);
    }

    function confirmDateOptions() {
        let selectedMonths = [];
        const checkboxes = document.querySelectorAll('#datesOptions input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedMonths.push(checkbox.dataset.month);
            }
            getSelectedMonths(selectedMonths);
        });
        closeBtnElementHandler(); // Hide the modal after confirming
        console.log(selectedMonths); // Log selected months
    }
}

export function getSelectedMonths(selectedMonths) {
  return selectedMonths;
}


