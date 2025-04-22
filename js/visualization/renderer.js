// js/visualization/renderer.js

const RENDER_BACTERIA_PER_BACTERIA = 300;

const Renderer = (() => {
    let canvas, ctx;
    let width, height;
    let bacteriaList = null;

    const init = () => {
        canvas = document.getElementById("simulationCanvas");
        ctx = canvas.getContext("2d");
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        bacteriaList = DataManager.getBacteriaList();
    };

    const renderBacteria = (population, bacteriaData, time) => {
        if (!ctx) init();

        ctx.clearRect(0, 0, width, height);

        // Draw central antibiotic zone
        const centerX = width / 2;
        const centerY = height / 2;
        const antibioticRadius = 20;

        ctx.beginPath();
        ctx.arc(centerX, centerY, antibioticRadius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(bacteriaData.AntibioticShortName, centerX, centerY + 5);

        // Draw bacteria
        const maxBacteria = Math.min(100000, Math.floor(population / RENDER_BACTERIA_PER_BACTERIA));
        const sensitive = bacteriaData.ResistanceProfile.toLowerCase() !== "resistant";

        // Check if anitibiotic is effective for only sensitive bacteria
        const antibioticData = DataManager.getAntibioticData(DataManager.getSelectedAntibiotic());

        for (let i = 0; i < maxBacteria; i++) {
            let angle = Math.random() * 2 * Math.PI;
            let distance = Math.random() * (Math.min(width, height) / 2 - 10);

            if (sensitive || (!sensitive && antibioticData.ResistanceProfile.toLowerCase() === "resistant")) {
                distance += antibioticRadius + 20;
            }

            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            // ctx.fillStyle = "#FFFDD0";
            ctx.fillStyle = "#FFFDD0"; // blue for sensitive, red for resistant
            ctx.fill();
        }

        // Optional: Show time & population
        // Get initial population from input field
        const antibiotic = document.getElementById("antibiotic").value;
        const dose = document.getElementById("dose").value;
        const interval = document.getElementById("interval").value;
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "14px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`Time: ${time}h`, 20, 30);
        ctx.fillText(`Population: ${Math.round(population)}`, 20, 50);
        ctx.fillText(`Bacterial Species: ${bacteriaData.BacterialSpecies}`, 20, 70);
        ctx.fillText(`Antibiotic: ${antibiotic}`, 20, 90);
        ctx.fillText(`Dose: ${dose} mg`, 20, 110);
        ctx.fillText(`Interval: ${interval}h`, 20, 130);
        ctx.fillText(`Resistance: ${bacteriaData.ResistanceProfile}`, 20, 150);
    };

    return {
        renderBacteria,
        init,
    };
})();
