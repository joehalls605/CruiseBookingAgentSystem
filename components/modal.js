
// ===================== MODAL DIALOG =====================

export function initModal(){

// Modal elements
    const modal = document.getElementById("modal");
    const dateButtonElement = document.getElementById("dateButton");
    const closeBtnElement = document.getElementById("closeBtn");
    const confirmButtonElement = document.getElementById("confirmBtn");

if(dateButtonElement){
    dateButtonElement.addEventListener("click", () => {
        modal.classList.add("visible");
    });
}

// Hide the modal when the 'Close' button is clicked
    if(closeBtnElement){
        closeBtnElement.addEventListener("click", closeBtnElementHandler);
    }

    function closeBtnElementHandler() {
        modal.classList.remove("visible");
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
        });
        closeBtnElementHandler(); // Hide the modal after confirming
        console.log(selectedMonths); // Log selected months
    }

}
