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

let map;
let marker;
let circle;

function initMap(lat, lon) {
    if (isValidCoordinate(lat, 'lat') && isValidCoordinate(lon, 'lon')) {
        map = L.map('map').setView([lat, lon], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        mapDiv.style.display = "none"; // Hide map container if no valid coords
    }
}

function isValidCoordinate(coord, type) {
    if (isNaN(coord)) return false;
    if (type === 'lat' && (coord < -90 || coord > 90)) return false;
    if (type === 'lon' && (coord < -180 || coord > 180)) return false;
    return true;
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

    // Basic input validation (only for weather data, lat/lon is optional)
    if (isNaN(cape) || isNaN(shear) || isNaN(helicity) || isNaN(humidity) || isNaN(dewpoint) || isNaN(dcapeValue)) {
        resultsDiv.textContent = "Error: Please enter valid numbers for all weather data fields.";
        return;
    }

    let risk = "No Risk";
    let riskColor = "#333";
    let textShadowColor = "#000";

    if (cape > 3000 && shear > 60 && helicity > 175 && humidity > 75 && dewpoint > 15 && dcapeValue > 1000) {
        risk = "HIGH";
        riskColor = "pink";
        body.style.backgroundColor = "#ffcdd2";
    } else if (cape > 2000 && shear > 45 && helicity > 125 && humidity > 65 && dewpoint > 13 && dcapeValue > 800) {
        risk = "MDT";
        riskColor = "red";
        body.style.backgroundColor = "#ef9a9a";
    } else if (cape > 1500 && shear > 35 && helicity > 90 && humidity > 55 && dewpoint > 11 && dcapeValue > 600) {
        risk = "ENH";
        riskColor = "orange";
        body.style.backgroundColor = "#ffcc80";
    } else if (cape > 1000 && shear > 25 && helicity > 60 && humidity > 45 && dewpoint > 9 && dcapeValue > 450) {
        risk = "SLGT";
        riskColor = "yellow";
        body.style.backgroundColor = "#fff59d";
    } else if (cape > 750 && shear > 15 && helicity > 30 && humidity > 35 && dewpoint > 7 && dcapeValue > 300) {
        risk = "MRGL";
        riskColor = "green";
        body.style.backgroundColor = "#a5d6a7";
    } else {
        riskColor = "#000";
        body.style.backgroundColor = "#e0f2f1";
    }

    let resultText = `Severe Weather Risk: ${risk}`;
    if (isValidCoordinate(lat, 'lat') && isValidCoordinate(lon, 'lon')) {
        resultText = `Severe Weather Risk for Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)} is ${risk}`;
    }

    resultsDiv.textContent = resultText;
    resultsDiv.style.color = riskColor;
    resultsDiv.style.textShadow = `-1px -1px 0 ${textShadowColor}, 1px -1px 0 ${textShadowColor}, -1px 1px 0 ${textShadowColor}, 1px 1px 0 ${textShadowColor}`;

    // Initialize or update the map
    if (!map && isValidCoordinate(lat, 'lat') && isValidCoordinate(lon, 'lon')) {
        initMap(lat, lon);
        // Add marker and circle
        marker = L.marker([lat, lon]).addTo(map).bindPopup(`Severe Weather Risk: ${risk}`).openPopup();
        circle = L.circle([lat, lon], { radius: 64373.76, color: riskColor, fillOpacity: 0.2 }).addTo(map);
    } else if (map && isValidCoordinate(lat, 'lat') && isValidCoordinate(lon, 'lon')) {
        map.setView([lat, lon], 7);
        if (marker) {
            map.removeLayer(marker);
        }
        if (circle) {
            map.removeLayer(circle);
        }
        marker = L.marker([lat, lon]).addTo(map).bindPopup(`Severe Weather Risk: ${risk}`).openPopup();
        circle = L.circle([lat, lon], { radius: 64373.76, color: riskColor, fillOpacity: 0.2 }).addTo(map);
    } else if (map) {
        map.remove(); // Remove map if lat/lon is cleared
        map = null;
        marker = null;
        circle = null;
        mapDiv.style.display = "none"; // Hide map container if no valid coords
    } else if (!map && (!isValidCoordinate(lat, 'lat') || !isValidCoordinate(lon, 'lon'))) {
        mapDiv.style.display = "none"; // Hide map container if no valid coords
    } else {
        mapDiv.style.display = "block"; // Show map container if valid coords
    }
});
