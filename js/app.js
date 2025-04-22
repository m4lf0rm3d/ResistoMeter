// js/app.js

window.addEventListener('DOMContentLoaded', () => {
    // Initialize the canvas and controls
    Renderer.init();
    Controls.bindEvents();

    // Example data manager (assumes DataManager is already set up)
    DataManager.loadBacteriaData()
        .then(() => {
            console.log("Data loaded successfully!");

            DataManager.getSelectedBacteria();
            DataManager.getSelectedAntibiotic();
            // Show the app interface
            document.getElementById("loader").classList.add("hidden");
            document.getElementById("app").classList.remove("hidden");
        })
        .catch((error) => {
            console.error("Error loading data:", error);
            document.getElementById("loader").innerHTML = "Failed to load data.";
        });

    // Handle app navigation for show/hide elements
    document.getElementById("runButton").addEventListener("click", () => {
        // Hide the initial view and show simulation canvas
        // document.getElementById("introView").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        document.getElementById("simulationCanvas").classList.remove("hidden");
    });

});
