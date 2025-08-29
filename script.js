// =========================
// Maintenance Mode Detection
// =========================
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");
if (mode === "maintenance") {
    document.getElementById("calculator-content").style.display = "none";
    document.getElementById("maintenance-content").style.display = "flex";
}

// =========================
// Calculator Logic
// =========================
const capeInput = document.getElementById('capeInput');
const shearInput = document.getElementById('shearInput');
const helicityInput = document.getElementById('helicityInput');
const humidityInput = document.getElementById('humidityInput');
const dewpointInput = document.getElementById('dewpointInput');
const dcapeInput = document.getElementById('dcapeInput');
const calculateButton = document.getElementById('calculateButton');
const resultsDiv = document.getElementById('results');
const body = document.querySelector('body');
const latInput = document.getElementById('latInput');
const lonInput = document.getElementById('lonInput');
const mapDiv = document.getElementById('map');

let map, marker, circle;

function initMap(lat, lon) {
    if (!isNaN(lat) && !isNaN(lon)) {
        map = L.map('map').setView([lat, lon], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        mapDiv.style.display = "none";
    }
}

calculateButton.addEventListener('click', () => {
    const cape = parseFloat(capeInput.value);
    const shear = parseFloat(shearInput.value);
    const helicity = parseFloat(helicityInput.value);
    const humidity = parseFloat(humidityInput.value);
    const dewpoint = parseFloat(dewpointInput.value);
    const dcapeValue = parseFloat(dcapeInput.value);
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);

    if (isNaN(cape) || isNaN(shear) || isNaN(helicity) || isNaN(humidity) || isNaN(dewpoint) || isNaN(dcapeValue)) {
        resultsDiv.textContent = "Error: Please enter valid numbers for all weather data fields.";
        return;
    }

    let risk = "No Risk";
    let riskColor = "#333";

    if (cape > 3000 && shear > 50 && helicity > 150 && humidity > 70 && dewpoint > 15 && dcapeValue > 900) {
        risk="HIGH"; riskColor="pink"; body.style.backgroundColor="#ffcdd2";
    } else if (cape>2000 && shear>35 && helicity>100 && humidity>60 && dewpoint>13 && dcapeValue>700){
        risk="MDT"; riskColor="red"; body.style.backgroundColor="#ef9a9a";
    } else if (cape>1300 && shear>

