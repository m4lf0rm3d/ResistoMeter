// js/export/exportPDF.js
const ExportPDF = (() => {
    const generate = (history, bacteriaData, userInputs) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add gradient-colored header
        doc.setTextColor(30, 144, 255);
        doc.setFontSize(22);
        doc.text("ResistoMeter Simulation Report", 105, 20, { align: 'center' });

        // Current date and time
        const now = new Date();
        doc.setTextColor(100);
        doc.setFontSize(10);
        doc.text(`Report generated: ${now.toLocaleString()}`, 105, 28, { align: 'center' });

        // Section 1: Simulation Parameters
        doc.setTextColor(0);
        doc.setFontSize(14);
        doc.text("Simulation Parameters", 20, 40);
        doc.setFontSize(10);
        doc.text(`Initial Bacteria Count: ${userInputs.initialCount}`, 20, 48);
        doc.text(`Antibiotic Dose: ${userInputs.dose} mg`, 20, 56);
        doc.text(`Dose Interval: ${userInputs.interval} hours`, 20, 64);
        doc.text(`Total Duration: ${userInputs.duration} hours`, 20, 72);

        // Section 2: Bacterial Strain Details
        doc.setFontSize(14);
        doc.text("Bacterial Strain Details", 20, 86);
        doc.setFontSize(10);
        doc.text(`Species: ${bacteriaData.BacterialSpecies}`, 20, 94);
        doc.text(`Base Strain: ${bacteriaData.BaseStrain}`, 20, 102);
        doc.text(`Antibiotic: ${bacteriaData.Antibiotic} (${bacteriaData.AntibioticShortName})`, 20, 110);
        doc.text(`Type: ${bacteriaData.AntibioticType} (${bacteriaData.Mechanism})`, 20, 118);
        doc.text(`Resistance Profile: ${bacteriaData.ResistanceProfile}`, 20, 126);
        doc.text(`MIC: ${bacteriaData.MinimumInhibitoryConcentration} μg/mL`, 20, 134);

        // Population Graph
        doc.setFontSize(14);
        doc.text("Population Over Time", 105, 150, { align: 'center' });

        // Graph dimensions
        const xStart = 20;
        const yStart = 160;
        const chartWidth = 160;
        const chartHeight = 80;

        // Calculate min/max values
        const populations = history.map(h => h.count);
        const maxPop = Math.max(...populations);
        const minPop = Math.min(...populations);
        const maxTime = Math.max(...history.map(h => h.time));

        // Draw axes
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.line(xStart, yStart, xStart, yStart + chartHeight); // Y-axis
        doc.line(xStart, yStart + chartHeight, xStart + chartWidth, yStart + chartHeight); // X-axis

        // Axis labels
        doc.setFontSize(8);
        doc.text("Time (hours)", xStart + chartWidth / 2 - 10, yStart + chartHeight + 10);
        doc.text("Bacterial Count", xStart - 15, yStart + chartHeight / 2 - 10, { angle: 90 });

        // Y-axis ticks and labels
        doc.text(minPop.toExponential(2), xStart - 18, yStart + chartHeight - 2);
        doc.text(maxPop.toExponential(2), xStart - 18, yStart + 3);

        // X-axis ticks and labels
        doc.text("0", xStart - 3, yStart + chartHeight + 3);
        doc.text(maxTime.toString(), xStart + chartWidth - 5, yStart + chartHeight + 3);

        // Plot line with gradient color
        doc.setLineWidth(0.6);
        for (let i = 1; i < history.length; i++) {
            const prev = history[i - 1];
            const curr = history[i];

            const x1 = xStart + (prev.time / maxTime) * chartWidth;
            const y1 = yStart + chartHeight - ((prev.count - minPop) / (maxPop - minPop)) * chartHeight;
            const x2 = xStart + (curr.time / maxTime) * chartWidth;
            const y2 = yStart + chartHeight - ((curr.count - minPop) / (maxPop - minPop)) * chartHeight;

            // Gradient effect from blue to red if population increases
            const ratio = curr.count / maxPop;
            const r = Math.floor(30 + ratio * 225);
            const g = Math.floor(144 - ratio * 144);
            const b = Math.floor(255 - ratio * 200);
            doc.setDrawColor(r, g, b);

            doc.line(x1, y1, x2, y2);
        }

        // Data source and footer
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("Data source: ", 20, 260);
        doc.textWithLink(bacteriaData.DataSource || "https://who.int", 35, 260, { url: bacteriaData.DataSource });

        doc.text("To verify this model, please visit:", 20, 270);
        doc.textWithLink(`${window.location.origin}/about.html`, 20, 275, {
            url: `${window.location.origin}/about.html`
        });

        // Save with dynamic filename
        const filename = `ResistoMeter_${bacteriaData.BacterialSpecies.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(filename);
    };

    return {
        generate,
    };
})();