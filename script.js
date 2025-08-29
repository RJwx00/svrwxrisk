// =========================
// Maintenance Mode Switch
// =========================
const MAINTENANCE_MODE = false; // <-- set to true to enable maintenance mode

if (MAINTENANCE_MODE) {
    document.getElementById("calculator-content").style.display = "none";
    document.getElementById("maintenance-content").style.display = "flex";
} else {
    document.getElementById("calculator-content").style.display = "flex";
    document.getElementById("maintenance-content").style.display = "none";
}

// =========================
// Original Calculator Logic
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
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        map = L.map('map').setView([lat, lon], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        mapDiv.style.display = "none";
    }
}

calculateButton.addEventListener('click', () => {
    if (MAINTENANCE_MODE) return; // Prevent calculations

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
    } else if (cape>1300 && shear>25 && helicity>70 && humidity>50 && dewpoint>11 && dcapeValue>500){
        risk="ENH"; riskColor="orange"; body.style.backgroundColor="#ffcc80";
    } else if (cape>700 && shear>15 && helicity>40 && humidity>40 && dewpoint>9 && dcapeValue>350){
        risk="SLGT"; riskColor="yellow"; body.style.backgroundColor="#fff59d";
    } else if (cape>300 && shear>8 && helicity>20 && humidity>30 && dewpoint>6 && dcapeValue>200){
        risk="MRGL"; riskColor="green"; body.style.backgroundColor="#a5d6a7";
    } else {
        riskColor="#000"; body.style.backgroundColor="#e0f2f1";
    }

    let resultText = `Severe Weather Risk: ${risk}`;
    if (!isNaN(lat) && !isNaN(lon)) {
        resultText = `Severe Weather Risk for Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)} is ${risk}`;
    }

    resultsDiv.textContent = resultText;
    resultsDiv.style.color = riskColor;
    resultsDiv.style.textShadow = `-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000`;

    if (!map && !isNaN(lat) && !isNaN(lon)) {
        initMap(lat, lon);
        marker = L.marker([lat, lon]).addTo(map).bindPopup(`Severe Weather Risk: ${risk}`).openPopup();
        circle = L.circle([lat, lon], { radius: 64373.76, color: riskColor, fillOpacity: 0.2 }).addTo(map);
    } else if (map && !isNaN(lat) && !isNaN(lon)) {
        map.setView([lat, lon], 7);
        if (marker) map.removeLayer(marker);
        if (circle) map.removeLayer(circle);
        marker = L.marker([lat, lon]).addTo(map).bindPopup(`Severe Weather Risk: ${risk}`).openPopup();
        circle = L.circle([lat, lon], { radius: 64373.76, color: riskColor, fillOpacity: 0.2 }).addTo(map);
    } else if (map) {
        map.remove(); map = null; marker = null; circle = null; mapDiv.style.display = "none";
    }
});
