// js/simulation/engine.js

const Engine = (() => {
    let isRunning = false;
    let currentTime = 0;
    let population = 0;
    let bacteriaData = null;
    let doseSchedule = [];
    let history = [];

    const timeStep = 1; // in hours
    let maxTime = 240;

    const start = (initialCount, selectedData, simDuration) => {
        bacteriaData = selectedData;
        GrowthModel.init(bacteriaData);
        doseSchedule = GrowthModel.generateDoseSchedule(
            bacteriaData.TreatmentInterval,
            simDuration
        );

        population = initialCount;
        currentTime = 0;
        history = [{ time: 0, count: population }];
        isRunning = true;
        maxTime = simDuration;

        // Render the initial state

        Renderer.renderBacteria(population, bacteriaData, currentTime);

        animate();
    };

    const animate = () => {
        if (!isRunning || currentTime > maxTime) return;

        const growth = GrowthModel.computeGrowthRate(
            currentTime,
            doseSchedule,
            population
        );

        population += growth;
        currentTime += timeStep;

        // Sync with editable range slider
        document.getElementById("timeRange").value = currentTime;
        Renderer.renderBacteria(population, bacteriaData, currentTime);

        history.push({ time: currentTime, count: population });

        setTimeout(animate, 50); // adjust for speed
    };

    const stop = () => {
        isRunning = false;
    };

    const resume = () => {
        if (!isRunning) {
            isRunning = true;
            animate();
        }
    }

    const fastForward = (time) => {
        stop();
        currentTime = time;
        const matching = history.find((h) => Math.round(h.time) === Number(time));
        population = matching ? matching.count : population;
        Renderer.renderBacteria(population, bacteriaData, currentTime);
    };

    const getHistory = () => history;

    return {
        start,
        stop,
        fastForward,
        getHistory,
        resume
    };
})();
