import { UC } from "../../../js/utils.js";

//#region eventSetup

//#region mainMenu

let mainMenu = document.getElementById("mainMenu");
let addNewRoomMenuButton = document.getElementById("addNewRoomMenuButton");
addNewRoomMenuButton.onclick = addNewRoomMenuButton_Click;
let roomSelect = document.getElementById("roomSelect");
roomSelect.onchange = roomSelect_OnChanged;

//#endregion

//#region roomSettingMenu

let roomSettingMenu = document.getElementById("roomSettingMenu");
let removeRoomButton = document.getElementById("removeRoomButton");
removeRoomButton.onclick = removeRoomButton_Click;
let updateRoomButton = document.getElementById("updateRoomButton");
updateRoomButton.onclick = updateRoomButton_Click;

//#endregion

//#region addNewSensorMenu

let addNewRoomMenu = document.getElementById("addNewRoomMenu");
let addNewRoomSubmitButton = document.getElementById("addNewRoomSubmitButton");
addNewRoomSubmitButton.onclick = addNewRoomSubmitButton_Clicked;
let addRoomInput = document.getElementById("addRoomInput");
let addNewRoomBackButton = document.getElementById("addNewRoomBackButton");
addNewRoomBackButton.onclick = addNewRoomBackButton_Clicked;

//#endregion

//#region updateRoomMenu

let updateRoomMenu = document.getElementById("updateRoomMenu");
let updateRoomSubmitButton = document.getElementById("updateRoomSubmitButton");
updateRoomSubmitButton.onclick = updateRoomSubmitButton_Clicked;
let updateRoomInput = document.getElementById("updateRoomInput");
let updateRoomBackButton = document.getElementById("updateRoomBackButton");
updateRoomBackButton.onclick = updateRoomBackButton_Clicked;

//#endregion

//#region popupBox

let popupBox = document.getElementById("popupBox");
let popupCancel = document.getElementById("popupCancel");
popupCancel.onclick = popupCancel_Click;
let popupConfirm = document.getElementById("popupConfirm");
popupConfirm.onclick = popupConfirm_Click;

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

function roomSelect_OnChanged() {
    showRoomSettings();
}

async function addNewRoomMenuButton_Click() {
    await showAddNewRoomMenu();
}

//#endregion

//#region roomSettingMenu


async function removeRoomButton_Click() {
    setElementDisplay([popupBox], "block");
    popupConfirm.onclick = removeRoom;
}

async function updateRoomButton_Click() {
    await showUpdateRoomMenu();
}

//#endregion

//#region addNewRoomMenu

async function addNewRoomBackButton_Clicked() {
    await initialLoad();
}

async function addNewRoomSubmitButton_Clicked() {
    await submitNewRoomButton();
}

//#endregion

//#region updateRoomMenu

async function updateRoomBackButton_Clicked() {
    await initialLoad();
}

async function updateRoomSubmitButton_Clicked() {
    await submitUpdateRoomButton();
}

//#endregion

//#region popupBox

async function popupCancel_Click() {
    setElementDisplay([popupBox], "none");
}

async function popupConfirm_Click() {
    setElementDisplay([popupBox], "none");
}

//#endregion

//#region backendCode

async function initialLoad() {
    setElementDisplay([roomSettingMenu, addNewRoomMenu, updateRoomMenu, popupBox], "none");
    setElementDisplay([mainMenu], "block");

    UC.clearSelect(roomSelect);

    popupConfirm.onclick = popupConfirm_Click;

    let sensorInfo = await getSensorInfo();
    await populateSelectWithRooms(roomSelect, sensorInfo);
}

async function getSensorInfo() {
    let sensorInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    return sensorInfo.message;
}

function populateSelectWithRooms(roomSelect, sensorInfo) {
    UC.clearSelect(roomSelect);
    for (let i = 0; i < sensorInfo.length; i++) {
        roomSelect.add(makeOptionFromParam(sensorInfo[i].roomName, sensorInfo[i].roomID));
    }
}

// Function called when client clicks on the "Add new room" button
async function showAddNewRoomMenu() {
    setElementDisplay([mainMenu, roomSettingMenu], "none");
    setElementDisplay([addNewRoomMenu], "block");
}

// Function called when client submits the new room
async function submitNewRoomButton() {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewroom", [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password")),
            new UC.FetchArg("roomName", addRoomInput.value)
    ]);
    checkReturnCode(returnMessage, "New room added succesfully!");

    await initialLoad();
}

// Shows the choices you have when you pick a room
function showRoomSettings() {
    setElementDisplay([roomSettingMenu], "block");
}

// Function called when the client chooses to remove the chosen room
async function removeRoom() {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removeroom", [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password")),
            new UC.FetchArg("roomID", roomSelect.value)
    ]);
    checkReturnCode(returnMessage, "Room removed succesfully!");

    await initialLoad();
}

// Function called when client clicks on the "Update room" button
async function showUpdateRoomMenu() {
    setElementDisplay([mainMenu, roomSettingMenu], "none");
    setElementDisplay([updateRoomMenu], "block");
}

// Function called when the client chooses to update the chosen room
async function submitUpdateRoomButton() {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updateroom", [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password")),
            new UC.FetchArg("roomID", roomSelect.value),
            new UC.FetchArg("roomName", updateRoomInput.value)
    ]);
    checkReturnCode(returnMessage, "Room updated succesfully!");

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

function checkReturnCode(returnMessage, successMessage) {
    if (returnMessage.returnCode >= 200 && returnMessage.returnCode < 300)
        console.log(successMessage);
    else
        console.log(returnMessage.message);
}

//#endregion