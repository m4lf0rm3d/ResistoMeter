// js/simulation/growthModel.js
const GrowthModel = (() => {
    let bacteria = null;

    const init = (bacteriaData) => {
        bacteria = bacteriaData;
    };

    const computeGrowthRate = (currentTime, doseSchedule, currentPopulation) => {
        const {
            BaselineGrowthRate,
            AntibioticEfficacy,
            ResistanceProfile,
            MinimumInhibitoryConcentration,
            DecayRate,
            CarryingCapacity,
            MutationRate,
            AntibioticType
        } = bacteria;

        // Determine antibiotic effect at this time
        const doseEffect = getDoseEffect(currentTime, doseSchedule);
        const isEffective = doseEffect > MinimumInhibitoryConcentration;

        let populationChange = 0;
        let effectiveGrowth = BaselineGrowthRate;
        let killRate = 0;

        // Resistance effects
        if (ResistanceProfile.toLowerCase() === "resistant") {
            effectiveGrowth *= 0.9; // Resistant strains grow slightly slower
            killRate = AntibioticEfficacy * 0.1; // 10% of normal efficacy
        } else {
            killRate = AntibioticEfficacy;
        }

        // Antibiotic type effects
        if (isEffective) {
            if (AntibioticType.toLowerCase() === "bactericidal") {
                // Bactericidal - directly kills bacteria
                const killFactor = killRate * doseEffect;
                populationChange -= currentPopulation * killFactor;

                // Reduced growth due to stress response
                effectiveGrowth *= (1 - (killRate * 0.5));
            } else {
                // Bacteriostatic - primarily inhibits growth
                effectiveGrowth *= (1 - killRate * doseEffect);
            }
        }

        // Logistic growth component
        const growthComponent = effectiveGrowth * currentPopulation *
            (1 - currentPopulation / CarryingCapacity);

        // Natural decay
        const decayComponent = DecayRate * currentPopulation;

        // Mutation events (only for sensitive populations)
        if (ResistanceProfile.toLowerCase() === "sensitive" &&
            Math.random() < MutationRate * currentPopulation) {
            // Small chance of resistance developing
            populationChange += currentPopulation * 0.01; // 1% become resistant
            populationChange -= currentPopulation * 0.01; // Subtract from sensitive
        }

        // Combine all effects
        populationChange += growthComponent - decayComponent;

        // Ensure population doesn't go negative
        return Math.max(populationChange, -currentPopulation * 0.5); // Max 50% kill per time step
    };

    const getDoseEffect = (t, schedule) => {
        let effect = 0;
        for (const doseTime of schedule) {
            const delta = t - doseTime;
            if (delta >= 0 && delta < 24) { // Effects last max 24 hours
                effect += Math.exp(-bacteria.DecayRate * delta);
            }
        }
        return effect;
    };

    const generateDoseSchedule = (doseInterval, totalDuration) => {
        const schedule = [];
        for (let t = 0; t <= totalDuration; t += doseInterval) {
            schedule.push(t);
        }
        return schedule;
    };

    return {
        init,
        computeGrowthRate,
        generateDoseSchedule,
    };
})();