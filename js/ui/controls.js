// js/ui/controls.js
const Controls = (() => {
    let isRunning = false;
    let simulationHistory = null;

    const bindEvents = () => {
        // Run Simulation Button
        document.getElementById("runButton").addEventListener("click", runSimulation);

        // Pause/Stop Button
        document.getElementById("stopSim").addEventListener("click", toggleSimulation);

        // Download Button
        document.getElementById("download").addEventListener("click", downloadReport);

        // Close Button
        document.getElementById("endSim").addEventListener("click", endSimulation);

        // Time Range Slider
        document.getElementById("timeRange").addEventListener("input", (e) => {
            Engine.fastForward(parseInt(e.target.value));
        });
    };

    const runSimulation = () => {
        let selected = DataManager.getSelectedBacteria();
        const initialCount = parseInt(document.getElementById("initialCount").value);
        const dose = parseFloat(document.getElementById("dose").value);
        const interval = parseInt(document.getElementById("interval").value);
        const duration = parseInt(document.getElementById("duration").value);

        // Validate inputs
        if (isNaN(initialCount) || isNaN(dose) || isNaN(interval) || isNaN(duration)) {
            alert("Please enter valid numerical values for all parameters");
            return;
        }

        // Update selected parameters
        selected.RecommendedDose = dose;
        selected.TreatmentInterval = interval;

        // Configure time slider
        const slider = document.getElementById("timeRange");
        slider.setAttribute("min", 0);
        slider.setAttribute("max", duration);
        slider.setAttribute("value", 0);
        slider.setAttribute("step", interval);

        // Get antibiotic data
        //  Overwrite the default anitbiotic data with the selected one
        const selectedAntibiotic = DataManager.getSelectedAntibiotic();
        const antibioticData = DataManager.getAntibioticData(selectedAntibiotic);
        selected = antibioticData;
        const bacteriaData = DataManager.getSelectedBacteria();
        selected.BacterialSpecies = bacteriaData.BacterialSpecies;
        selected.ResistanceProfile = bacteriaData.ResistanceProfile;

        // Toggle UI elements
        document.getElementById("app").classList.add("hidden");
        document.getElementById("simulationCanvas").classList.remove("hidden");
        document.getElementById("simControls").classList.remove("hidden");

        // Reset simulation state
        isRunning = true;
        document.getElementById("stopSim").innerHTML = `<i class="fa-regular fa-stop"></i> Pause`;

        // Clear previous simulation history
        simulationHistory = null;

        // Start simulation
        Engine.start(initialCount, selected, duration);
    };

    const toggleSimulation = () => {
        if (isRunning) {
            Engine.stop();
            document.getElementById("stopSim").innerHTML = `<i class="fa-regular fa-play"></i> Resume`;
        } else {
            Engine.resume();
            document.getElementById("stopSim").innerHTML = `<i class="fa-regular fa-stop"></i> Pause`;
        }
        isRunning = !isRunning;
    };

    const downloadReport = () => {
        if (!simulationHistory) {
            simulationHistory = Engine.getHistory();
        }
        const bacteria = DataManager.getSelectedBacteria();
        const userInputs = {
            initialCount: document.getElementById("initialCount").value,
            dose: document.getElementById("dose").value,
            interval: document.getElementById("interval").value,
            duration: document.getElementById("duration").value
        };
        ExportPDF.generate(simulationHistory, bacteria, userInputs);
    };

    const endSimulation = () => {
        resetSimulation();
    };

    const resetSimulation = () => {
        Engine.stop();
        document.getElementById("simControls").classList.add("hidden");
        document.getElementById("simulationCanvas").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        document.getElementById("timeRange").value = 0;
        isRunning = false;
    };

    return {
        bindEvents,
        runSimulation,
        toggleSimulation,
        downloadReport,
        endSimulation
    };
})();