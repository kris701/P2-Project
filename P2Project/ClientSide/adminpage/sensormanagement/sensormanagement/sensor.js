import { UC } from "../../../js/utils.js";

window.onload = initialLoad();
document.getElementById("selectedSensor").onchange = sensorClicked;
document.getElementById("addExistingSensorButton").onclick = addExistingSensorButton;
document.getElementById("addExistingSensorButtonInner").onclick = submitExistingSensorButton;
document.getElementById("selectedRoom").onchange = populateMainSensorMenu;
document.getElementById("addNewSensorButton").onclick = addNewSensorButton;
document.getElementById("addNewSensorButtonInner").onclick = submitNewSensorButton;
document.getElementById("removeSensor").onclick = removeSensor;
document.getElementById("removeSensorRef").onclick = removeSensorRef;

async function initialLoad() {
    setElementDisplay(["sensorButtons", "addNewSensorDiv", "addExistingSensorDiv"], "none");
    setElementDisplay(["mainSelects"], "block");

    let selectBox = document.getElementById("selectedRoom");
    let sensorSelect = document.getElementById("selectedSensor");

    UC.clearSelect(selectBox);
    UC.clearSelect(sensorSelect);

    let sensorInfo = await getSensorInfo();
    let roomSelect = document.getElementById("selectedRoom");
    await importDataToSelect(roomSelect, sensorInfo);
}

async function getSensorInfo() {
    let sensorInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    return sensorInfo;
}

// Adds more elements to the select in the html for room selection
async function importDataToSelect(select, sensorInfo) {

    UC.clearSelect(select);
    for (let i = 0; i < sensorInfo.length; i++) {
        let option = document.createElement("option");
        option.text = sensorInfo[i].roomName;
        option.value = sensorInfo[i].roomID;
        select.add(option);
    }
}

// Populates the sensor dropdown menu with all sensors in the chosen room
async function populateMainSensorMenu() {
    let selectBox = document.getElementById("selectedRoom");
    let sensorSelect = document.getElementById("selectedSensor");

    setElementDisplay(["sensorButtons"], "none");

    let sensorInfo = await getSensorInfo();
    populateSelectWithSensorsInRoom(selectBox, sensorSelect, sensorInfo);
}

function populateSelectWithSensorsInRoom(select, sensorselect, sensorInfo) {
    let room = select.options[select.selectedIndex].value;
    UC.clearSelect(sensorselect);

    for (let i = 0; i < sensorInfo.length; i++) {
        if (sensorInfo[i].roomID == room) {
            for (let j = 0; j < sensorInfo[i].sensors.length; j++) {
                let option = document.createElement("option");
                option.text = "Sensor " + sensorInfo[i].sensors[j].sensorID;
                option.value = sensorInfo[i].sensors[j].sensorID;
                sensorselect.add(option);
            }
            break;
        }
    }
}

function populateSelectWithRooms(select, sensorInfo) {
    UC.clearSelect(select);
    for (let i = 0; i < sensorInfo.length; i++) {
        let option = document.createElement("option");
        option.text = sensorInfo[i].roomName;
        option.value = sensorInfo[i].roomID;
        select.add(option);
    }
}

// Function called when client clicks on the "Add new sensor" button
async function addNewSensorButton() {
    setElementDisplay(["mainSelects", "sensorButtons"], "none");
    setElementDisplay(["addNewSensorDiv"], "block");

    let roomSelect = document.getElementById("addNewSensorSelectedRoom");
    let sensorInfo = await getSensorInfo();
    await populateSelectWithRooms(roomSelect, sensorInfo);
}

// Function called when client submits the new sensor
async function submitNewSensorButton() {
    let roomSelect = document.getElementById("addNewSensorSelectedRoom");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensor", [new UC.FetchArg("username", "Admin"), new UC.FetchArg("password", "Password"), new UC.FetchArg("roomID", roomSelect.value)]);
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensor", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("roomID", roomSelect.value)]);

    await initialLoad();
}

async function populateSensorMenuForDefaultRoom(sensorSelect) {
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsensors", [new UC.FetchArg("username", "Admin"), new UC.FetchArg("password", "Password")]);
    let sensors = returnMessage.data;

    UC.clearSelect(sensorSelect);

    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].roomID == 1) {
            let option = document.createElement("option");
            option.text = "Sensor " + sensors[i].sensorID;
            option.value = sensors[i].sensorID;
            sensorSelect.add(option);
        }
    }
}

// Function called when the client clicks on the "Add Existing Sensor" button
async function addExistingSensorButton() {
    setElementDisplay(["mainSelects"], "none");
    setElementDisplay(["addExistingSensorDiv"], "block");

    let addExistingSensorSelectedSensor = document.getElementById("addExistingSensorSelectedSensor");
    let addExistingSensorSelectedRoom = document.getElementById("addExistingSensorSelectedRoom");
    let sensorInfo = await getSensorInfo();
    await populateSensorMenuForDefaultRoom(addExistingSensorSelectedSensor);
    await importDataToSelect(addExistingSensorSelectedRoom, sensorInfo);
}

// Function called when the client submits the existing sensor add
async function submitExistingSensorButton() {
    let roomSelect = document.getElementById("addExistingSensorSelectedRoom");
    let sensorSelect = document.getElementById("addExistingSensorSelectedSensor");
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensor", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("roomID", roomSelect.value), new UC.FetchArg("sensorID", sensorSelect.value)]);
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensor", [new UC.FetchArg("username", "Admin"), new UC.FetchArg("password", "Password"), new UC.FetchArg("roomID", roomSelect.value), new UC.FetchArg("sensorID", sensorSelect.value)]);

    await initialLoad();
}

// Shows the choices you have when you pick a sensor
function sensorClicked() {
    setElementDisplay(["sensorButtons"], "block");
}

// Function called when the client chooses to remove the references of the chosen sensor
async function removeSensorRef() {
    let sensorSelect = document.getElementById("selectedSensor");
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensorreference", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("sensorID", sensorSelect.value)]);
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensorreference", [new UC.FetchArg("username", "Admin"), new UC.FetchArg("password", "Password"), new UC.FetchArg("sensorID", sensorSelect.value)]);

    await initialLoad();
}

// Function called when the client chooses to remove the chosen sensor
async function removeSensor() {
    let sensorSelect = document.getElementById("selectedSensor");
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensor", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("sensorID", sensorSelect.value)]);
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensor", [new UC.FetchArg("username", "Admin"), new UC.FetchArg("password", "Password"), new UC.FetchArg("sensorID", sensorSelect.value)]);

    await initialLoad();
}

// Generic function to set the display style of an array of elements
function setElementDisplay(elemArray, mode) {
    elemArray.forEach(function (v) {
        document.getElementById(v).style.display = mode;
    });
}