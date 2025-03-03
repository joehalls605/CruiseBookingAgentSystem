// ===================== SIDEBAR TOGGLE =====================

export const initSidebar = () =>{
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
}

