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
    importDataToSelect(roomSelect, sensorInfo);
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
    let ret = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    return ret.message;
}

async function getPredictions(ID, date) {
    setLoadingLabel("Fetching prediction data...");
    let ret = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getpredictiondata?room=" + ID + "&date=" + date);
    return ret.message;
}

async function getWarningsAndSolution(ID, date) {
    setLoadingLabel("Fetching warning and solutions...");
    let ret = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getwarningsandsolutions?room=" + ID + "&date=" + date);
    return ret.message;
}

async function getLiveData(ID, date) {
    setLoadingLabel("Fetching live data...");
    let ret = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getlivedata?roomID=" + ID + "&date=" + date);
    return ret.message;
}

async function roomChangeFunction() {
    if (roomSelect.selectedIndex >= 0) {
        hideElementById("noDataDiv", true, true);
        hideElementById("sensorDataContainer", true, true);
        hideElementById("liveDataContainer", true, true);
        hideElementById("liveDataLabel", true, true);
        hideElementById("liveDataText", true, true);
        hideElementById("predictionDataLabel", true, true);
        hideElementById("predictionDataText", true, true);
        hideElementById("predictionContainer", true, true);
        hideElementById("warContain", true, true);
        hideElementById("loadDiv", false);

        // Clears warning area
        WARN.clearWarningArea();
        // Clears graph area
        GRPH.clearData("#predictionContainer");
        GRPH.clearData("#liveDataContainer");

        let roomData = await getSensorInfo();
        let fadeInPredictions = await loadPredictionShow(roomData[roomSelect.selectedIndex].roomID, dateFromInput.value);
        let fadeInRoomData = displayRoomData(roomData[roomSelect.selectedIndex]);
        let fadeInLiveData = await liveDataShow(roomData[roomSelect.selectedIndex].roomID);
        let fadeInWarnings = await warningsShow(roomData[roomSelect.selectedIndex].roomID, dateFromInput.value);

        if (!fadeInPredictions && !fadeInRoomData && !fadeInLiveData && !fadeInWarnings)
            hideElementById("noDataDiv", false);

        if (fadeInPredictions) {
            hideElementById("predictionContainer", false, null, "inline-block");
            hideElementById("predictionDataLabel", false);
            hideElementById("predictionDataText", false);
        }
        if (fadeInRoomData) {
            hideElementById("sensorDataContainer", false);
            hideElementById("predictionDataText", false);
        }
        if (fadeInLiveData) {
            hideElementById("liveDataContainer", false, null, "inline-block");
            hideElementById("liveDataLabel", false);
            hideElementById("liveDataText", false);
        }
        if (fadeInWarnings) {
            hideElementById("warContain", false, null, "grid");
        }

        hideElementById("loadDiv", true);
    }
}

function setLoadingLabel(text) {
    subLoadingText.innerHTML = text;
}

async function loadPredictionShow(roomID, date) {
    let predictionData = await getPredictions(roomID, date);
    // Gets the length of the x axis
    let xLength = GRPH.getHighestTimestampPredictions(predictionData);
    if (xLength != 0) {
        // Generate a graph of all the sensortypes, in one
        GRPH.createTotalGraphOfPredictions(predictionData, 0, xLength, "#predictionContainer");

        // This for loop is where the createGraph function is called. i is passed along also so that 
        // it is clear which iteration of graph is the current and the total number of graps also
        for (let i = 0; i < predictionData.data.length; i++) {
            GRPH.createPredictionsGraph(predictionData.data[i], 1 + i, xLength, predictionData.interval, "#predictionContainer");
        }
        return true;
    }
    return false;
}

async function warningsShow(roomID, date) {
    let warningData = await getWarningsAndSolution(roomID, date);
    if (warningData.data.length > 1) {
        // Displays the warnings of the selected room
        WARN.displayWarnings(warningData);
        return true;
    }
    return false;
}

async function liveDataShow(roomID) {
    let liveData = await getLiveData(roomID, dateFromInput.value);

    GRPH.clearData("#liveDataContainer");
    let xLength = GRPH.getHighestTimestampLiveData(liveData.data);

    if (xLength != 0) {
        for (let i = 0; i < liveData.data.length; i++) {
            GRPH.createLiveDataGraph(liveData, i, xLength, liveData.data[i].sensorType, "#liveDataContainer");
        }
        return true;
    }
    return false;
}

function displayRoomData(currentRoomData) {

    if (currentRoomData.sensors.length != 0) {
        sensorData.innerHTML = "";

        for (let i = 0; i < currentRoomData.sensors.length; i++) {
            sensorData.innerHTML += "<br>Sensor ID: " + currentRoomData.sensors[i].sensorID + "<br>";
            sensorData.innerHTML += "<br>Sensor types: <br>";

            for (let j = 0; j < currentRoomData.sensors[i].types.length; j++) {
                sensorData.innerHTML += "&emsp;" + currentRoomData.sensors[i].types[j] + "<br>";
            }

            if (i + 1 != currentRoomData.sensors.length)
                sensorData.innerHTML += "<br><hr>";
        }
        return true;
    }
    return false;
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
