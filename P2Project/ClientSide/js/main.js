import { UC } from './utils.js';
import { GRPH } from './graphing.js';
import { WARN } from './warnings.js'

//#region eventSetup

//#region TopBar

let roomSelect = document.getElementById("roomSelect");
roomSelect.onchange = roomSelect_OnChange;
let refreshRoomButton = document.getElementById("refreshRoomButton");
refreshRoomButton.onclick = refreshRoomButton_Click;
let dateFromInput = document.getElementById('dateFromInput');

//#endregion

//#region Loading

let subLoadingText = document.getElementById("subLoadingText");

//#endregion

//#region Loading

let sensorData = document.getElementById("data");

//#endregion

//#region MainWindow

window.onload = window_OnLoad();

//#endregion

//#endregion

//#region eventCalls

//#region window

async function window_OnLoad() {
    await startUpProcedure();
}

//#endregion

//#region TopBar

async function roomSelect_OnChange() {
    await roomChangeFunction();
}

async function refreshRoomButton_Click() {
    await roomChangeFunction();
}

//#endregion

//#endregion

//#region backendCode

async function startUpProcedure() {
    setCurrentDate();
    let sensorInfo = await getSensorInfo();
    importDataToSelect(roomSelect, sensorInfo.message);
    roomSelect.selectedIndex = 0;
    await roomChangeFunction();
}

function setCurrentDate() {
    let today = new Date();
    dateFromInput.value = UC.dateToISOString(today);
}

// Adds more elements to the select in the html for room selection
function importDataToSelect(select, data) {
    for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.text = data[i].roomName;
        select.add(option);
    }
}

async function getSensorInfo() {
    setLoadingLabel("Fetching room data...");
    return await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
}

async function getPredictions(ID, date) {
    setLoadingLabel("Fetching prediction data...");
    return await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getpredictiondata?room=" + ID + "&date=" + date);
}

async function getWarningsAndSolution(ID, date) {
    setLoadingLabel("Fetching warning and solutions...");
    return await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getwarningsandsolutions?room=" + ID + "&date=" + date);
}

async function getLiveData(ID, date) {
    setLoadingLabel("Fetching live data...");
    return await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getlivedata?roomID=" + ID + "&date=" + date);
}

async function roomChangeFunction() {
    if (roomSelect.selectedIndex >= 0) {
        // Clears warning area
        WARN.clearWarningArea();
        // Clears graph area
        GRPH.clearData("#predictionContainer");
        GRPH.clearData("#liveDataContainer");

        hideElementById("loadDiv", false);
        hideElementById("sensorDataContainer", true, true);
        hideElementById("liveDataContainer", true, true);
        hideElementById("predictionContainer", true, true);

        let roomData = await getSensorInfo();
        await loadPredictionShow(roomData.message[roomSelect.selectedIndex].roomID, dateFromInput.value);
        displayRoomData(roomData.message[roomSelect.selectedIndex]);
        await liveDataShow(roomData.message[roomSelect.selectedIndex].roomID);
        await warningsShow(roomData.message[roomSelect.selectedIndex].roomID, dateFromInput.value);

        hideElementById("loadDiv", true);
        hideElementById("sensorDataContainer", false);
        hideElementById("warContain", false);
        hideElementById("liveDataContainer", false, null, "grid");
        hideElementById("predictionContainer", false, null, "grid");
    }
}

function setLoadingLabel(text) {
    subLoadingText.innerHTML = text;
}

async function loadPredictionShow(roomID, date) {
    let predictionData = await getPredictions(roomID, date);
    // Gets the length of the x axis
    let xLength = GRPH.getHighestTimestampPredictions(predictionData.message);
    // Generate a graph of all the sensortypes, in one
    GRPH.createTotalGraphOfPredictions(predictionData.message, "A", xLength, "#predictionContainer");

    // This for loop is where the createGraph function is called. i is passed along also so that 
    // it is clear which iteration of graph is the current and the total number of graps also
    for (let i = 0; i < predictionData.message.data.length; i++) {
        GRPH.createPredictionsGraph(predictionData.message.data[i], i, xLength, predictionData.message.interval, "#predictionContainer");
    }
}

async function warningsShow(roomID, date) {
    let warningData = await getWarningsAndSolution(roomID, date);
    // Displays the warnings of the selected room
    WARN.displayWarnings(warningData.message);
}

async function liveDataShow(roomID) {
    let liveData = await getLiveData(roomID, dateFromInput.value);

    GRPH.clearData("#liveDataContainer");
    let xLength = GRPH.getHighestTimestampLiveData(liveData.message.data);

    for (let i = 0; i < liveData.message.data.length; i++) {
        GRPH.createLiveDataGraph(liveData.message, "livedata" + i, xLength, liveData.message.data[i].sensorType, "#liveDataContainer");
    }
}

function displayRoomData(currentRoomData) {
    sensorData.innerHTML = "";

    for (let i = 0; i < currentRoomData.sensors.length; i++) {
        sensorData.innerHTML += "<br>Sensor ID: " + currentRoomData.sensors[i].sensorID + "<br>";
        sensorData.innerHTML += "<br>Sensor measurements: <br>";

        for (let j = 0; j < currentRoomData.sensors[i].types.length; j++) {
            sensorData.innerHTML += "&emsp;" + currentRoomData.sensors[i].types[j] + "<br>";
        }

        sensorData.innerHTML += "<br><hr>";
    }
}

function hideElementById(id, toHidden, instant, toStyle) {
    let htmlitem = document.getElementById(id);
    if (toHidden) {
        if (instant != null) {
            if (instant)
                htmlitem.style.display = 'none';
        }
        else
            UC.fade(htmlitem);
    }
    else {
        if (instant != null) {
            if (instant)
                if (toStyle != null)
                    htmlitem.style.display = toStyle;
                else
                    htmlitem.style.display = 'block';
        }
        else
            if (toStyle != null)
                UC.unfade(htmlitem, toStyle);
            else
                UC.unfade(htmlitem);
    }
}

//#endregion
