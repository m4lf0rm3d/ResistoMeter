// js/simulation/dataManager.js

const DataManager = (() => {
    let bacteriaList = [];
    let selectedBacteria = null;

    const loadBacteriaData = async () => {
        try {
            const res = await fetch('data/bacteria_data.json');
            bacteriaList = await res.json();
            populateDropdown();
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
        } catch (error) {
            console.error("Failed to load bacteria data:", error);
        }
    };

    const populateDropdown = () => {
        const dropdown = document.getElementById('species');
        bacteriaList.forEach((b, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = `${b.BacterialSpecies}`;
            dropdown.appendChild(option);
        });
        // Populate antibiotic
        // referehcn html code
        // <label>Bacterial Species</label>
        //     <select id="species"></select>

        //     <!--Antibiotic Dropdown-- >
        //     <label>Antibiotic</label>
        //     <select id="antibiotic">
        //         <option value="">Select an antibiotic</option>
        //     </select>

        const antibioticDropdown = document.getElementById('antibiotic');
        const currentSelectedBacteria = bacteriaList[dropdown.value];
        bacteriaList.forEach((b) => {
            if (b.BaseStrain !== currentSelectedBacteria.BaseStrain) return;
            const option = document.createElement('option');
            option.value = b.Antibiotic;
            option.textContent = b.Antibiotic;
            antibioticDropdown.appendChild(option);
        });

        dropdown.addEventListener('change', (e) => {
            const selectedIndex = e.target.value;
            const selectedBacteria = bacteriaList[selectedIndex];
            antibioticDropdown.innerHTML = ''; // Clear previous options
            bacteriaList.forEach((b) => {
                if (b.BaseStrain !== selectedBacteria.BaseStrain) return;
                const option = document.createElement('option');
                option.value = b.Antibiotic;
                option.textContent = b.Antibiotic;
                antibioticDropdown.appendChild(option);
            });
            // Choose the first antibiotic by default
            if (antibioticDropdown.options.length > 0) {
                antibioticDropdown.value = antibioticDropdown.options[0].value;
                getSelectedBacteria();
                const anitbioticData = getAntibioticData(antibioticDropdown.value);
                document.getElementById('interval').value = anitbioticData.TreatmentInterval;
                document.getElementById('dose').value = anitbioticData.RecommendedDose;
            }
            
        });

        antibioticDropdown.addEventListener('change', (e) => {
            getSelectedBacteria();
            const anitbioticData = getAntibioticData(e.target.value);
            document.getElementById('interval').value = anitbioticData.TreatmentInterval;
            document.getElementById('dose').value = anitbioticData.RecommendedDose;
        });
    };

    const getSelectedBacteria = () => {
        const index = document.getElementById('species').value;
        selectedBacteria = bacteriaList[index];
        return selectedBacteria;
    };

    const getSelectedAntibiotic = () => {
        const antibioticDropdown = document.getElementById('antibiotic');
        const selectedAntibiotic = antibioticDropdown.value;
        return selectedAntibiotic;
    };

    const getAntibioticData = (antibiotic) => {
        if (!selectedBacteria) return null;
        const antibioticData = bacteriaList.find(b => b.Antibiotic === antibiotic && b.BaseStrain === selectedBacteria.BaseStrain);
        if (!antibioticData) return null;
        return antibioticData;
    };

    const getBacteriaList = () => {
        return bacteriaList;
    }

    return {
        loadBacteriaData,
        getSelectedBacteria,
        getAntibioticData,
        getSelectedAntibiotic,
        getBacteriaList
    };
})();
