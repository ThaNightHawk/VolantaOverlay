const websocketURL = "ws://localhost:6745/listen/overlay";
const ws = new WebSocket(websocketURL);

let seqId = 0;
let flightData = {
    spd: 0,
    vspd: 0,
    hdg: 0,
    alt: 0,
    dep: "NONE",
    arr: "NONE",
    atc: "NONE",
    nw: "VOLANTA",
    phase: "NONE",
    originCoords: undefined,
    destinationCoords: undefined,
    currentCoords: undefined
};

const earthRadiusKm = 6371;
const conversionFactor = 0.539956803;

const degreesToRadians = degrees => degrees * (Math.PI / 180);

const calculateDistance = (startCoords, endCoords) => {
    const [startLat, startLon] = startCoords.map(degreesToRadians);
    const [endLat, endLon] = endCoords.map(degreesToRadians);

    const latDifference = endLat - startLat;
    const lonDifference = endLon - startLon;

    const a = Math.sin(latDifference / 2) ** 2 +
              Math.sin(lonDifference / 2) ** 2 * Math.cos(startLat) * Math.cos(endLat);

    const c = 2 * Math.asin(Math.sqrt(a));
    return earthRadiusKm * c * conversionFactor;
};

const returnStatus = e => {
    if (!e) return "Offline";

    switch (e.state) {
        case "AtAirport":
            return "At Airport";
        case "CruisingOverCountry":
            return "Cruising";
        case "ClimbingToAltitude":
            return "Climbing";
        case "Descending":
            return "Descending";
        default:
            return e.state.includes("taxiing") ? "Taxiing" : "Online";
    }
};

const updateFlightStatus = (newPhase) => {
    if (flightData.phase !== newPhase) {
        document.getElementById("PHASE").innerHTML = returnStatus({ state: newPhase });
        flightData.phase = newPhase;
    }
};

const updateOpacity = (selector, opacity) => {
    document.querySelectorAll(selector).forEach(element => {
        element.style.opacity = opacity;
    });
};

const updateFlightInfo = (data) => {
    const { callsign, network, origin, destination, hasDiverted } = data.flight;

    if (flightData.atc !== callsign) {
        flightData.atc = callsign;
        document.getElementById("ATC").innerHTML = callsign;
    }

    if (flightData.nw !== network) {
        flightData.nw = network;
        document.getElementById("NW").innerHTML = network;
    }

    if (flightData.dep !== origin.icaoCode) {
        if (!flightData.originCoords && origin.latitude && origin.longitude) {
            flightData.originCoords = [origin.latitude, origin.longitude];
            flightData.dep = origin.icaoCode;
            document.getElementById("DEP").innerHTML = flightData.dep;
        }
    }

    if (hasDiverted) {
        flightData.originCoords = [origin.latitude, origin.longitude];
        flightData.dep = origin.icaoCode;
        document.getElementById("DEP").innerHTML = flightData.dep;
    }

    if (flightData.arr !== destination.icaoCode) {
        if (!flightData.destinationCoords && destination.latitude && destination.longitude) {
            flightData.destinationCoords = [destination.latitude, destination.longitude];
            flightData.arr = destination.icaoCode;
            document.getElementById("ARR").innerHTML = flightData.arr;
        }
    }
};

const resetFlightInfo = () => {
    document.getElementById("DEP").innerHTML = "N/A";
    document.getElementById("ARR").innerHTML = "N/A";
    document.getElementById("NW").innerHTML = "N/A";
    document.getElementById("ATC").innerHTML = "N/A";
    document.getElementById("ETA").innerHTML = "No ETA";
};

const updatePositionData = (data) => {
    const { groundSpeed, verticalSpeed, headingTrue, altitudeAmsl, latitude, longitude, onGround } = data;

    flightData.spd = groundSpeed.toFixed(0);
    flightData.vspd = verticalSpeed.toFixed(0);
    flightData.hdg = headingTrue.toFixed(0);
    flightData.alt = altitudeAmsl.toFixed(0);

    document.getElementById("SPD").innerHTML = flightData.spd;
    document.getElementById("VSPD").innerHTML = flightData.vspd;
    document.getElementById("HDG").innerHTML = flightData.hdg;
    document.getElementById("ALT").innerHTML = flightData.alt;

    if (flightData.originCoords && flightData.destinationCoords) {
        flightData.currentCoords = [latitude, longitude];
        const totalDistance = calculateDistance(flightData.originCoords, flightData.destinationCoords);
        const distanceTraveled = calculateDistance(flightData.originCoords, flightData.currentCoords);
        const progressPercentage = distanceTraveled / totalDistance;

        const trackerBar = document.getElementById("TrackerBar");
        trackerBar.style.setProperty('width', onGround ? '100%' : `${(progressPercentage * 100).toFixed(2)}%`, 'important');

        if (onGround) {
            document.getElementById("ETA").innerHTML = "00:00z";
            return;
        }

        const eta = calculateETA({ latitude, longitude, groundSpeed }, { destination: flightData.destinationCoords });
        document.getElementById("ETA").innerHTML = eta;
    }
};

const handleData = (data) => {
    if (data.seq_id <= seqId) return;
    seqId = data.seq_id;

    switch (data.name) {
        case "SET_OVERLAY_STATE":
            updateFlightStatus(data.data.richStatus?.state || "Offline");

            if (!data.data.flight || !data.data.flight.origin || !data.data.flight.destination) {
                updateOpacity('.CurrentFlight', '0');
                updateOpacity('.NoFlight', '1');
                
                setTimeout(() => resetFlightInfo(), 1000);
            } else {
                updateOpacity('.CurrentFlight', '1');
                updateOpacity('.NoFlight', '0');
                updateFlightInfo(data.data);
            }
            break;

        case "POSITION_UPDATE":
            updatePositionData(data.data);
            break;

        default:
            console.warn(`Unhandled data type: ${data.name}`);
    }
};

ws.onopen = () => console.log("*Corrects glasses* We're in...");
ws.onmessage = event => handleData(JSON.parse(event.data));
