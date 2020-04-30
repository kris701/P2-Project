// Use this to get resource data:
// let fetchedData = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/resource").catch(e => console.log(e));


import { UC } from './utils.js';
import { GRPH } from './graphing.js';
import { WARN } from './warnings.js'

let roomData = [];

window.onload = startUpProcedure();
// Activates once a new room has been selected
const currentRoom = document.getElementById("selectedRoom");
currentRoom.addEventListener("change", (evt) => roomChangeFunction());
document.getElementById("refreshRoomButton").onclick = refreshDataClick;

async function startUpProcedure() {
    setCurrentDate();
    GetInformation();
}

async function GetInformation() {
    setLoadingLabel("Fetching room data...");
    roomData = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    await importDataToSelect();
    await roomChangeFunction();
}

async function getPredictions(ID, date) {
    setLoadingLabel("Fetching prediction data...");
    return await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getpredictiondata?room=" + ID + "&date=" + date);
}

async function getWarningsAndSolutionj(ID, date) {
    setLoadingLabel("Fetching warning and solutions...");
    return await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getwarningsandsolutions?room=" + ID + "&date=" + date);
}

async function getLiveData(ID, date) {
    setLoadingLabel("Fetching live data...");
    return await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getlivedata?roomID=" + ID + "&date=" + date);
}

async function liveDataShow(roomID) {
    let date = document.querySelector('input[type="datetime-local"]');
    let liveData = await getLiveData(roomID, date.value);

    GRPH.clearData("#liveDataContainer");
    let xLength = GRPH.getHighestTimestampLiveData(liveData.data);

    for (let i = 0; i < liveData.data.length; i++) {
        GRPH.createLiveDataGraph(liveData, "livedata" + i, xLength, liveData.data[i].sensorType, "#liveDataContainer");
    }
}

// Adds more elements to the select in the html for room selection
async function importDataToSelect() {
    let roomSelect = document.getElementById("selectedRoom");

    for (let i = 0; i < roomData.length; i++) {
        let option = document.createElement("option");
        option.text = roomData[i].roomName;
        roomSelect.add(option);
    }
}

async function roomChangeFunction() {

    let date = document.querySelector('input[type="datetime-local"]');

    if (roomData.length != 0) {

        // Clears warning area
        WARN.clearWarningArea();
        // Clears graph area
        GRPH.clearData("#predictionContainer");
        GRPH.clearData("#liveDataContainer");
        // Resets the data display section
        clearSensorInfoArea();

        hideElementById("loadDiv", false);
        hideElementById("sensorDataContainer", true, true);

        let roomSelect = document.getElementById("selectedRoom");

        let predictionData = await getPredictions(roomData[roomSelect.selectedIndex].roomID, date.value);
        let warningData = await getWarningsAndSolutionj(roomData[roomSelect.selectedIndex].roomID, date.value);

        await liveDataShow(roomData[roomSelect.selectedIndex].roomID);

        // Gets the length of the x axis
        let xLength = GRPH.getHighestTimestamp(predictionData);
        // Generate a graph of all the sensortypes, in one
        GRPH.createTotalGraph(predictionData, "A", xLength, "#predictionContainer");

        // This for loop is where the createGraph function is called. i is passed along also so that 
        // it is clear which iteration of graph is the current and the total number of graps also
        for (let i = 0; i < predictionData.data.length; i++) {
            GRPH.createGraph(predictionData.data[i], i, xLength, predictionData.interval, "#predictionContainer");
        }

        // Displays the warnings of the selected room
        WARN.displayWarnings(warningData);

        displayRoomData(roomData[roomSelect.selectedIndex]);

        hideElementById("loadDiv", true);
        hideElementById("sensorDataContainer", false);
        hideElementById("warContain", false);
        hideElementById("liveDataContainer", false, null, "grid");
        hideElementById("predictionContainer", false, null, "grid");
    }
    else
        GetInformation();
}


function displayRoomData(currentRoomData) {
    let dataDisplay = document.getElementById("data");

    for (let i = 0; i < currentRoomData.sensors.length; i++) {
        dataDisplay.innerHTML += "<br>Sensor ID: " + currentRoomData.sensors[i].sensorID + "<br>";
        dataDisplay.innerHTML += "<br>Sensor measurements: <br>";

        DRD_SearchMeasurements(dataDisplay, currentRoomData, i);

        dataDisplay.innerHTML += "<br><hr>";
    }
}


// Searches the array roomData for which kind of sensors the unit has. For example
// one unit may have both a CO2 and oxygen sensor.
function DRD_SearchMeasurements(dataDisplay, roomData, i) {
    for (let y = 0; y < roomData.sensors[i].types.length; y++) {
        dataDisplay.innerHTML += "&emsp;" + roomData.sensors[i].types[y] + "<br>";
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

function clearSensorInfoArea() {
    document.getElementById("data").innerHTML = "";
}

function setLoadingLabel(text) {
    document.getElementById("subLoadingText").innerHTML = text;
}

function refreshDataClick() {
    roomChangeFunction();
}

function setCurrentDate() {
    let today = new Date();
    let dateControl = document.querySelector('input[type="datetime-local"]');
    dateControl.value = UC.dateToISOString(today);
}