// Contains the search functionality.


import {renderCruiseCatalogue
} from '../appRenderFunctions.js';
import { cruiseCatalogue } from '../app.js';

export function applySearch() {
    const searchInputElement = document.getElementById("searchInput");
    const searchTerm = searchInputElement.value.toLowerCase();

    const searchResults = cruiseCatalogue.filter(function (item) {
        return (
            item.cruiseTitle.toLowerCase().includes(searchTerm) ||
            item.destination.toLowerCase().includes(searchTerm)
        );
    });

    renderCruiseCatalogue(searchResults);
}
