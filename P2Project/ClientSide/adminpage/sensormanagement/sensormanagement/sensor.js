import { UC } from "../../../js/utils.js";

//#region eventSetup

//#region mainMenu

let mainMenu = document.getElementById("mainMenu");
let addNewSensorMenuButton = document.getElementById("addNewSensorMenuButton");
addNewSensorMenuButton.onclick = addNewSensorMenuButton_Click;
let addExistingSensorMenuButton = document.getElementById("addExistingSensorMenuButton");
addExistingSensorMenuButton.onclick = addExistingSensorMenuButton_Click;
let roomSelect = document.getElementById("roomSelect");
roomSelect.onchange = roomSelect_OnChanged;
let sensorSelect = document.getElementById("sensorSelect");
sensorSelect.onchange = sensorSelect_OnChanged;

//#endregion

//#region sensorSettingMenu

let sensorSettingMenu = document.getElementById("sensorSettingMenu");
let removeSensorRefButton = document.getElementById("removeSensorRefButton");
removeSensorRefButton.onclick = removeSensorRefButton_Click;
let removeSensorButton = document.getElementById("removeSensorButton");
removeSensorButton.onclick = removeSensorButton_Click;

//#endregion

//#region addNewSensorMenu

let addNewSensorMenu = document.getElementById("addNewSensorMenu");
let addNewSensorSubmitButton = document.getElementById("addNewSensorSubmitButton");
addNewSensorSubmitButton.onclick = addNewSensorSubmitButton_Clicked;
let addNewSensorBackButton = document.getElementById("addNewSensorBackButton");
addNewSensorBackButton.onclick = addNewSensorBackButton_Clicked;
let addNewSensorSelectedRoom = document.getElementById("addNewSensorSelectedRoom");

//#endregion

//#region addExistingSensorMenu

let addExistingSensorMenu = document.getElementById("addExistingSensorMenu");
let addExistingSensorSubmitButton = document.getElementById("addExistingSensorSubmitButton");
addExistingSensorSubmitButton.onclick = addExistingSensorSubmitButton_Click;
let addExistingSensorBackButton = document.getElementById("addExistingSensorBackButton");
addExistingSensorBackButton.onclick = addExistingSensorBackButton_Click;

//#endregion

//#region window

window.onload = window_OnLoad();

//#endregion

//#endregion

//#region eventCalls

//#region window

async function window_OnLoad() {
    await initialLoad();
}

//#endregion

//#region mainMenu

async function roomSelect_OnChanged() {
    await populateMainSensorMenu();
}

function sensorSelect_OnChanged() {
    showSensorSettings();
}

async function addNewSensorMenuButton_Click() {
    await showAddNewSensorMenu();
}

async function addExistingSensorMenuButton_Click() {
    await showAddExistingSensorMenu();
}

//#endregion

//#region sensorSettingMenu

async function removeSensorRefButton_Click() {
    await removeSensorRef();
}

async function removeSensorButton_Click() {
    await removeSensor();
}

//#endregion

//#region addNewSensorMenu

async function addNewSensorBackButton_Clicked() {
    await initialLoad();
}

async function addNewSensorSubmitButton_Clicked() {
    await submitNewSensorButton();
}

//#endregion

//#region addExistingSensorMenu

async function addExistingSensorBackButton_Click() {
    await initialLoad();
}

async function addExistingSensorSubmitButton_Click() {
    await submitExistingSensorButton();
}

//#endregion

//#endregion

//#region backendCode

async function initialLoad() {
    setElementDisplay([sensorSettingMenu, addNewSensorMenu, addExistingSensorMenu], "none");
    setElementDisplay([mainMenu], "block");

    UC.clearSelect(roomSelect);
    UC.clearSelect(sensorSelect);

    let sensorInfo = await getSensorInfo();
    await populateSelectWithRooms(roomSelect, sensorInfo);
}

async function getSensorInfo() {
    let sensorInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    return sensorInfo.message;
}

// Populates the sensor dropdown menu with all sensors in the chosen room
async function populateMainSensorMenu() {
    setElementDisplay([sensorSettingMenu], "none");

    let sensorInfo = await getSensorInfo();
    populateSelectWithSensorsInRoom(roomSelect, sensorSelect, sensorInfo);
}

function populateSelectWithSensorsInRoom(roomSelect, sensorSelect, sensorInfo) {
    let room = roomSelect.options[roomSelect.selectedIndex].value;
    UC.clearSelect(sensorSelect);

    for (let i = 0; i < sensorInfo.length; i++) {
        if (sensorInfo[i].roomID == room) {
            for (let j = 0; j < sensorInfo[i].sensors.length; j++) {
                sensorSelect.add(makeOptionFromParam("Sensor " + sensorInfo[i].sensors[j].sensorID, sensorInfo[i].sensors[j].sensorID));
            }
            break;
        }
    }
}

function populateSelectWithRooms(roomSelect, sensorInfo) {
    UC.clearSelect(roomSelect);
    for (let i = 0; i < sensorInfo.length; i++) {
        roomSelect.add(makeOptionFromParam(sensorInfo[i].roomName, sensorInfo[i].roomID));
    }
}

// Function called when client clicks on the "Add new sensor" button
async function showAddNewSensorMenu() {
    setElementDisplay([mainMenu, sensorSettingMenu], "none");
    setElementDisplay([addNewSensorMenu], "block");

    let sensorInfo = await getSensorInfo();
    await populateSelectWithRooms(addNewSensorSelectedRoom, sensorInfo);
}

// Function called when client submits the new sensor
async function submitNewSensorButton() {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensor", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("roomID", addNewSensorSelectedRoom.value)
        ]);
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensor", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("roomID", roomSelect.value)]);

    await initialLoad();
}

async function populateSensorMenuForDefaultRoom(sensorSelect) {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsensors", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password")
        ]);
    let sensors = returnMessage.data;

    UC.clearSelect(sensorSelect);

    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].roomID == 1) {
            sensorSelect.add(makeOptionFromParam("Sensor " + sensors[i].sensorID, sensors[i].sensorID));
        }
    }
}

// Function called when the client clicks on the "Add Existing Sensor" button
async function showAddExistingSensorMenu() {
    setElementDisplay([mainMenu, sensorSettingMenu], "none");
    setElementDisplay([addExistingSensorMenu], "block");

    let sensorInfo = await getSensorInfo();
    await populateSensorMenuForDefaultRoom(addExistingSensorSensorSelect);
    await populateSelectWithRooms(addExistingSensorRoomSelect, sensorInfo);
}

// Function called when the client submits the existing sensor add
async function submitExistingSensorButton() {
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensor", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("roomID", roomSelect.value), new UC.FetchArg("sensorID", sensorSelect.value)]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensor", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("roomID", addExistingSensorRoomSelect.value),
            new UC.FetchArg("sensorID", addExistingSensorSensorSelect.value)
        ]);

    await initialLoad();
}

// Shows the choices you have when you pick a sensor
function showSensorSettings() {
    setElementDisplay([sensorSettingMenu], "block");
}

// Function called when the client chooses to remove the references of the chosen sensor
async function removeSensorRef() {
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensorreference", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("sensorID", sensorSelect.value)]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensorreference", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("sensorID", sensorSelect.value)
        ]);

    await initialLoad();
}

// Function called when the client chooses to remove the chosen sensor
async function removeSensor() {
    //let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensor", [new UC.FetchArg("username", sessionStorage.getItem("username")), new UC.FetchArg("password", sessionStorage.getItem("password")), new UC.FetchArg("sensorID", sensorSelect.value)]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensor", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("sensorID", sensorSelect.value)
        ]);

    await initialLoad();
}

// Generic function to set the display style of an array of elements
function setElementDisplay(elemArray, mode) {
    elemArray.forEach(function (v) {
        v.style.display = mode;
    });
}

function makeOptionFromParam(name, value) {
    let option = document.createElement("option");
    option.text = name;
    option.value = value;
    return option;
}

//#endregion