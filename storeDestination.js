// Store and return selected destination
export function storeDestination() {
    const destinationOptionsElement = document.getElementById("destinationOptions");
    const selectedDestination = destinationOptionsElement.value;

    return selectedDestination;
}