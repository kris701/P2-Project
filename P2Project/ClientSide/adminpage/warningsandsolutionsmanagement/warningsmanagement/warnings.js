import { UC } from "../../../js/utils.js";

//#region eventSetup

//#region mainMenu

let mainMenu = document.getElementById("mainMenu");
let addNewWarningMenuButton = document.getElementById("addNewWarningMenuButton");
addNewWarningMenuButton.onclick = addNewWarningMenuButton_Click;
let sensorTypeSelect = document.getElementById("warningSelect");
sensorTypeSelect.onchange = warningSelect_OnChanged;

//#endregion

//#region warningInfo

let warningInfoMenu = document.getElementById("warningInfoMenu");
let sensorTypeInfoBox = document.getElementById("sensorTypeInfo");
let warningMessageInfo = document.getElementById("warningMessageInfo");

//#endregion

//#region warningSettingMenu

let warningSettingMenu = document.getElementById("warningSettingMenu");
let updateWarningButton = document.getElementById("updateWarningButton");
updateWarningButton.onclick = updateWarningButton_Click;
let removeWarningButton = document.getElementById("removeWarningButton");
removeWarningButton.onclick = removeWarningButton_Click;

//#endregion

//#region addNewWarningMenu

let addNewWarningMenu = document.getElementById("addNewWarningMenu");
let addNewWarningSubmitButton = document.getElementById("addNewWarningSubmitButton");
addNewWarningSubmitButton.onclick = addNewWarningSubmitButton_Clicked;
let addNewWarningBackButton = document.getElementById("addNewWarningBackButton");
addNewWarningBackButton.onclick = addNewWarningBackButton_Clicked;
let addNewWarningSensorTypeSelect = document.getElementById("addNewWarningSensorTypeSelect");
let addNewWarningMessageInput = document.getElementById("addNewWarningMessageInput");

//#endregion

//#region updateWarningMenu

let updateWarningMenu = document.getElementById("updateWarningMenu");
let updateWarningSubmitButton = document.getElementById("updateWarningSubmitButton");
updateWarningSubmitButton.onclick = updateWarningSubmitButton_Click;
let updateWarningBackButton = document.getElementById("updateWarningBackButton");
updateWarningBackButton.onclick = updateWarningBackButton_Click;
let updateWarningMessageInput = document.getElementById("updateWarningMessageInput");

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

async function warningSelect_OnChanged() {
    showWarningSettings();
}

async function addNewWarningMenuButton_Click() {
    await showAddNewWarningMenu();
}

//#endregion

//#region warningSettingMenu

async function updateWarningButton_Click() {
    await showUpdateWarningMenu();
}

async function removeWarningButton_Click() {
    setElementDisplay([popupBox], "block");
    popupConfirm.onclick = removeWarning;
}

//#endregion

//#region addNewWarningMenu

async function addNewWarningBackButton_Clicked() {
    await initialLoad();
}

async function addNewWarningSubmitButton_Clicked() {
    await submitNewWarningButton();
}

//#endregion

//#region updateWarningMenu

async function updateWarningBackButton_Click() {
    await initialLoad();
}

async function updateWarningSubmitButton_Click() {
    await submitUpdateWarningButton();
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

//#endregion

//#region backendCode

async function initialLoad() {
    setElementDisplay([warningSettingMenu, addNewWarningMenu, updateWarningMenu, warningInfoMenu, popupBox], "none");
    setElementDisplay([mainMenu], "block");

    UC.clearSelect(sensorTypeSelect);

    popupConfirm.onclick = popupConfirm_Click;

    let warningInfo = await getWarningInfo();
    await populateSelectWithWarnings(sensorTypeSelect, warningInfo);
}

async function getWarningInfo() {
    let warningInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallwarningsandsolutions",
        [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password"))
        ]);
    return warningInfo.message.data;
}

async function getSensorTypeInfo() {
    let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsensortypes",
        [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password"))
        ]);
    return sensorTypeInfo.message.data;
}

function populateSelectWithWarnings(warningSelect, warningInfo) {
    UC.clearSelect(warningSelect);
    for (let i = 0; i < warningInfo.length; i++) {
        warningSelect.add(makeOptionFromParam("Warning " + warningInfo[i].warningID, warningInfo[i].warningID));
    }
}

function populateSelectWithSensorTypes(sensorTypeSelect, sensorTypeInfo) {
    UC.clearSelect(sensorTypeSelect);
    for (let i = 0; i < sensorTypeInfo.length; i++) {
        sensorTypeSelect.add(makeOptionFromParam(sensorTypeInfo[i].typeName, sensorTypeInfo[i].sensorType));
    }
}

// Function called when client clicks on the "Add new warning" button
async function showAddNewWarningMenu() {
    setElementDisplay([mainMenu, warningSettingMenu, warningInfoMenu], "none");
    setElementDisplay([addNewWarningMenu], "block");

    let sensorTypeInfo = await getSensorTypeInfo();
    await populateSelectWithSensorTypes(addNewWarningSensorTypeSelect, sensorTypeInfo);
}

// Function called when client submits the new warning
async function submitNewWarningButton() {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewwarning", [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password")),
            new UC.FetchArg("sensorType", addNewWarningSensorTypeSelect.value),
            new UC.FetchArg("message", addNewWarningMessageInput.value)
    ]);
    checkReturnCode(returnMessage, "New warning succesfully added!");

    await initialLoad();
}

// Function called when the client clicks on the "Update Warning" button
async function showUpdateWarningMenu() {
    setElementDisplay([mainMenu, warningSettingMenu, warningInfoMenu], "none");
    setElementDisplay([updateWarningMenu], "block");
}

// Function called when the client submits warning update
async function submitUpdateWarningButton() {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatewarning", [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password")),
            new UC.FetchArg("warningID", warningSelect.value),
            new UC.FetchArg("message", updateWarningMessageInput.value)
    ]);
    checkReturnCode(returnMessage, "Warning succesfully updated!");

    await initialLoad();
}

// Shows the choices you have when you pick a sensor
async function showWarningSettings() {
    setElementDisplay([warningSettingMenu, warningInfoMenu], "block");

    let warningInfo = await getWarningInfo();
    populateInfoBoxes(warningInfo);
}

function populateInfoBoxes(warningInfo) {
    let warning = warningSelect.options[warningSelect.selectedIndex].value;

    for (let i = 0; i < warningInfo.length; i++) {
        if (warningInfo[i].warningID == warning) {
            sensorTypeInfoBox.innerHTML = warningInfo[i].sensorType;
            warningMessageInfo.innerHTML = warningInfo[i].message;
            break;
        }
    }
}

// Function called when the client chooses to remove the chosen sensor
async function removeWarning() {
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removewarning", [
            new UC.FetchArg("username", sessionStorage.getItem("username")),
            new UC.FetchArg("password", sessionStorage.getItem("password")),
            new UC.FetchArg("warningID", warningSelect.value)
    ]);
    checkReturnCode(returnMessage, "Warning succesfully removed!");

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