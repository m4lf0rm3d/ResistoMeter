# 🧫 ResistoMeter

**ResistoMeter** is an interactive web-based simulation that models the behavior of antibiotic-sensitive and resistant bacterial populations under various antibiotic treatment regimens. It provides real-time visualizations of bacterial population dynamics and helps in understanding the emergence of resistance due to improper dosing.

---

## 🚀 Features

- Simulates **logistic bacterial growth**
- Models **bactericidal** and **bacteriostatic** drug actions
- Captures **mutation-driven resistance**
- Interactive UI with canvas-based rendering
- Based on **real-world MIC data**
- Fully **open-source** and editable

---

## 🛠️ Tech Stack

- HTML + CSS + JavaScript
- Canvas API for dynamic rendering
- JSON for data-driven configurations
- Python (optional, for local server)

---

## 🔧 Getting Started

To run ResistoMeter locally:

### 1. Install Python

If Python is not installed, [download it here](https://www.python.org/downloads/).

Verify installation:
```bash
python3 --version
```
### 2. Start the Local Server
From the project root directory:

```
python3 -m http.server
```
Then open your browser and go to:

```
http://localhost:8000/
```

## 🧬 Editing Simulation Parameters
Simulation settings are stored in:


`data/bacteria_data.json`
You can change properties like:

```
{
  "BaselineGrowthRate": 0.05,
  "CarryingCapacity": 10000,
  "AntibioticEfficacy": 0.6,
  "MinimumInhibitoryConcentration": 0.2,
  "MutationRate": 0.0001,
  "DecayRate": 0.1,
  "AntibioticType": "bactericidal",
  "ResistanceProfile": "sensitive"
}
```
Just save and refresh the browser to apply updates.

## 🌐 Live Demo
[🔬 Try the Simulation Online](https://m4lf0rm3d.github.io/ResistoMeter/)

[💻 View Source Code](https://github.com/m4lf0rm3d/ResistoMeter)

## 📄 License
This project is licensed under the MIT License.
See the LICENSE file for details.

## 🤝 Collaborators & Contact
Feel free to fork or contribute via pull requests.

For collaboration or academic interest, contact:

📧 xorahsan@gmail.com