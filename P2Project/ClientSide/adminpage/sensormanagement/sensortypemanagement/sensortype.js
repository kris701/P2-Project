import { UC } from "../../../js/utils.js";

//#region eventSetup

//#region mainMenu

let mainMenu = document.getElementById("mainMenu");
let addNewSensorTypeMenuButton = document.getElementById("addNewSensorTypeMenuButton");
addNewSensorTypeMenuButton.onclick = addNewSensorTypeMenuButton_Click;
let addExistingSensorTypeMenuButton = document.getElementById("addExistingSensorTypeMenuButton");
addExistingSensorTypeMenuButton.onclick = addExistingSensorTypeMenuButton_Click;
let sensorTypeSelect = document.getElementById("sensorTypeSelect");
sensorTypeSelect.onchange = sensorTypeSelect_OnChanged;

//#endregion

//#region sensortypeSettingMenu

let sensorTypeSettingMenu = document.getElementById("sensorTypeSettingMenu");
let updateSensorTypeButton = document.getElementById("updateSensorTypeButton");
updateSensorTypeButton.onclick = updateSensorTypeButton_Click;
let removeSensorTypeRefButton = document.getElementById("removeSensorTypeRefButton");
removeSensorTypeRefButton.onclick = removeSensorTypeRefButton_Click;
let removeSensorTypeButton = document.getElementById("removeSensorTypeButton");
removeSensorTypeButton.onclick = removeSensorTypeButton_Click;

//#endregion

//#region addNewSensortypeMenu

let addNewSensorTypeMenu = document.getElementById("addNewSensorTypeMenu");
let addNewSensorTypeSubmitButton = document.getElementById("addNewSensorTypeSubmitButton");
addNewSensorTypeSubmitButton.onclick = addNewSensorTypeSubmitButton_Clicked;
let addNewSensorTypeBackButton = document.getElementById("addNewSensorTypeBackButton");
addNewSensorTypeBackButton.onclick = addNewSensorTypeBackButton_Clicked;
let addNewSensorTypeInput = document.getElementById("addNewSensorTypeInput");

//#endregion

//#region addExistingSensortypeMenu

let addExistingSensorTypeMenu = document.getElementById("addExistingSensorTypeMenu");
let addExistingSensorTypeSubmitButton = document.getElementById("addExistingSensorTypeSubmitButton");
addExistingSensorTypeSubmitButton.onclick = addExistingSensorTypeSubmitButton_Click;
let addExistingSensorTypeBackButton = document.getElementById("addExistingSensorTypeBackButton");
addExistingSensorTypeBackButton.onclick = addExistingSensorTypeBackButton_Click;
let addExistingSensorTypeSensorSelect = document.getElementById("addExistingSensorTypeSensorSelect");
addExistingSensorTypeSensorSelect.onchange = addExistingSensorTypeSensorSelect_OnChanged;
let addExistingSensorTypeSensorTypeSelect = document.getElementById("addExistingSensorTypeSensorTypeSelect");
let addExistingSensorTypeThresholdInput = document.getElementById("addExistingSensorTypeThresholdInput");

//#endregion

//#region updateSensortypeMenu

let updateSensorTypeMenu = document.getElementById("updateSensorTypeMenu");
let updateSensorTypeSubmitButton = document.getElementById("updateSensorTypeSubmitButton");
updateSensorTypeSubmitButton.onclick = updateSensorTypeSubmitButton_Click;
let updateSensorTypeBackButton = document.getElementById("updateSensorTypeBackButton");
updateSensorTypeBackButton.onclick = updateSensorTypeBackButton_Click;
let updateSensorTypeSensorSelect = document.getElementById("updateSensorTypeSensorSelect");
updateSensorTypeSensorSelect.onchange = updateSensorTypeSensorSelect_OnChanged;
let updateSensorTypeThresholdInput = document.getElementById("updateSensorTypeThresholdInput");
let updateSensorTypeThresholdInfoBox = document.getElementById("updateSensorTypeThresholdInfoBox");

//#endregion

//#region removeSensorTypeReferenceMenu

let removeSensorTypeReferenceMenu = document.getElementById("removeSensorTypeReferenceMenu")
let removeSensorTypeReferenceSubmitButton = document.getElementById("removeSensorTypeReferenceSubmitButton");
removeSensorTypeReferenceSubmitButton.onclick = removeSensorTypeReferenceSubmitButton_Click;
let removeSensorTypeReferenceBackButton = document.getElementById("removeSensorTypeReferenceBackButton");
removeSensorTypeReferenceBackButton.onclick = removeSensorTypeReferenceBackButton_Click;
let removeSensorTypeReferenceSensorSelect = document.getElementById("removeSensorTypeReferenceSensorSelect");

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

function sensorTypeSelect_OnChanged() {
    showSensorTypeSettings();
}

async function addNewSensorTypeMenuButton_Click() {
    await showAddNewSensorTypeMenu();
}

async function addExistingSensorTypeMenuButton_Click() {
    await showAddExistingSensorTypeMenu();
}

//#endregion

//#region sensorTypeSettingMenu

async function updateSensorTypeButton_Click() {
    await showUpdateSensorTypeMenu();
}

async function removeSensorTypeRefButton_Click() {
    await showRemoveSensorTypeReferenceMenu();
}

async function removeSensorTypeButton_Click() {
    setElementDisplay([popupBox], "block");
    popupConfirm.onclick = removeSensorType;
}

//#endregion

//#region addNewSensorTypeMenu

async function addNewSensorTypeBackButton_Clicked() {
    await initialLoad();
}

async function addNewSensorTypeSubmitButton_Clicked() {
    await submitNewSensorType();
}

//#endregion

//#region addExistingSensorTypeMenu

async function addExistingSensorTypeBackButton_Click() {
    await initialLoad();
}

async function addExistingSensorTypeSubmitButton_Click() {
    await submitExistingSensorType();
}

async function addExistingSensorTypeSensorSelect_OnChanged() {
    let sensorTypeInfo = await getSensorTypeInfo();
    let thresholdInfo = await getThresholdInfo();
    await populateSelectWithSensorTypesFromSensor(addExistingSensorTypeSensorSelect, addExistingSensorTypeSensorTypeSelect, sensorTypeInfo, thresholdInfo);
}

//#endregion

//#region updateSensorTypeMenu

async function updateSensorTypeBackButton_Click() {
    await initialLoad();
}

async function updateSensorTypeSubmitButton_Click() {
    await submitUpdateSensorType();
}

async function updateSensorTypeSensorSelect_OnChanged() {
    await populateThresholdInfoBox();
}

//#endregion

//#region removeSensorTypeReferenceMenu

async function removeSensorTypeReferenceBackButton_Click() {
    await initialLoad();
}

async function removeSensorTypeReferenceSubmitButton_Click() {
    setElementDisplay([popupBox], "block");
    popupConfirm.onclick = submitRemoveSensorTypeReference;
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
    setElementDisplay([sensorTypeSettingMenu, addNewSensorTypeMenu, addExistingSensorTypeMenu, updateSensorTypeMenu, removeSensorTypeReferenceMenu, popupBox], "none");
    setElementDisplay([mainMenu], "block");

    UC.clearSelect(sensorTypeSelect);

    popupConfirm.onclick = popupConfirm_Click;

    let sensorTypeInfo = await getSensorTypeInfo();
    await populateSelectWithSensorTypes(sensorTypeSelect, sensorTypeInfo);
}

async function getSensorTypeInfo() {
    //let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsensortypes",
    //    [
    //        new BCC.FetchArg("username", sessionStorage.getItem("username")),
    //        new BCC.FetchArg("password", sessionStorage.getItem("password"))
    //    ]);
    let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsensortypes",
        [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password")
        ]);
    return sensorTypeInfo.message.data;
}

async function getThresholdInfo() {
    //let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallthresholdvalues",
    //    [
    //        new BCC.FetchArg("username", sessionStorage.getItem("username")),
    //        new BCC.FetchArg("password", sessionStorage.getItem("password"))
    //    ]);
    let thresholdInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallthresholdvalues",
        [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password")
        ]);

    return thresholdInfo.message.data;
}

async function getSensorInfo() {
    let sensorInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    return sensorInfo.message;
}

function populateSelectWithSensorTypesFromSensor(sensorSelect, sensorTypeSelect, sensorTypeInfo, thresholdInfo) {
    let sensor = sensorSelect.options[sensorSelect.selectedIndex].value;
    let sensorTypesAlreadyOnSensor = [];
    UC.clearSelect(sensorTypeSelect);

    for (let i = 0; i < thresholdInfo.length; i++) {
        if (thresholdInfo[i].sensorID == sensor) {
            sensorTypesAlreadyOnSensor.push(thresholdInfo[i].sensorType);
        }
    }

    for (let i = 0; i < sensorTypeInfo.length; i++) {
        if (!sensorTypesAlreadyOnSensor.includes(sensorTypeInfo[i].sensorType)) {
            sensorTypeSelect.add(makeOptionFromParam(sensorTypeInfo[i].typeName, sensorTypeInfo[i].sensorType));
        }
    }
}

function populateSelectWithSensorsFromSensorType(sensorSelect, sensorTypeSelect, thresholdInfo) {
    let sensorType = sensorTypeSelect.options[sensorTypeSelect.selectedIndex].value;
    UC.clearSelect(sensorSelect);

    for (let i = 0; i < thresholdInfo.length; i++) {
        if (thresholdInfo[i].sensorType == sensorType) {
            sensorSelect.add(makeOptionFromParam("Sensor " + thresholdInfo[i].sensorID, thresholdInfo[i].sensorID));
        }
    }
}

function populateSelectWithSensorTypes(sensorTypeSelect, sensorTypeInfo) {
    UC.clearSelect(sensorTypeSelect);
    for (let i = 0; i < sensorTypeInfo.length; i++) {
        sensorTypeSelect.add(makeOptionFromParam(sensorTypeInfo[i].typeName, sensorTypeInfo[i].sensorType));
    }
}

function populateSelectWithSensors(sensorSelect, sensorInfo) {
    UC.clearSelect(sensorSelect);
    for (let i = 0; i < sensorInfo.length; i++) {
        let sensors = sensorInfo[i].sensors;
        for (let j = 0; j < sensors.length; j++) {
            sensorSelect.add(makeOptionFromParam("Sensor " + sensors[j].sensorID, sensors[j].sensorID));
        }
    }
}

// Function called when client clicks on the "Add new sensortype" button
async function showAddNewSensorTypeMenu() {
    setElementDisplay([mainMenu, sensorTypeSettingMenu], "none");
    setElementDisplay([addNewSensorTypeMenu], "block");
}

// Function called when client submits the new sensortype
async function submitNewSensorType() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensortype", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("typeName", addNewSensorTypeInput.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensortype", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("typeName", addNewSensorTypeInput.value)
        ]);
    checkReturnCode(returnMessage, "New sensortype succesfully added!");

    await initialLoad();
}

// Function called when the client clicks on the "Add Existing SensorType" button
async function showAddExistingSensorTypeMenu() {
    setElementDisplay([mainMenu, sensorTypeSettingMenu], "none");
    setElementDisplay([addExistingSensorTypeMenu], "block");

    let sensorInfo = await getSensorInfo();
    populateSelectWithSensors(addExistingSensorTypeSensorSelect, sensorInfo);
}

// Function called when the client submits the existing sensortype add
async function submitExistingSensorType() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addexistingsensortype", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("sensorType", addExistingSensorTypeSensorTypeSelect.value),
    //        new UC.FetchArg("sensorID", addExistingSensorTypeSensorSelect.value),
    //        new UC.FetchArg("threshold", addExistingSensorTypeThresholdInput.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addexistingsensortype", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("sensorType", addExistingSensorTypeSensorTypeSelect.value),
            new UC.FetchArg("sensorID", addExistingSensorTypeSensorSelect.value),
            new UC.FetchArg("threshold", addExistingSensorTypeThresholdInput.value)
        ]);
    checkReturnCode(returnMessage, "Sensortype succesfully added to sensor!");

    await initialLoad();
}

// Function called when the client clicks on the "Update SensorType" button
async function showUpdateSensorTypeMenu() {
    setElementDisplay([mainMenu, sensorTypeSettingMenu], "none");
    setElementDisplay([updateSensorTypeMenu], "block");

    let thresholdInfo = await getThresholdInfo();
    await populateSelectWithSensorsFromSensorType(updateSensorTypeSensorSelect, sensorTypeSelect, thresholdInfo);
}

async function populateThresholdInfoBox() {
    let sensorType = sensorTypeSelect.value;
    let sensor = updateSensorTypeSensorSelect.value;
    let thresholdInfo = await getThresholdInfo();

    for (let i = 0; i < thresholdInfo.length; i++) {
        if (thresholdInfo[i].sensorType == sensorType && thresholdInfo[i].sensorID == sensor) {
            updateSensorTypeThresholdInfoBox.innerHTML = thresholdInfo[i].thresholdValue;
            break;
        }
    }
}

// Function called when the client submits the sensortype update
async function submitUpdateSensorType() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensortypethreshold", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("sensorID", updateSensorTypeSensorSelect.value),
    //        new UC.FetchArg("sensorType", updateSensorTypeSensorTypeSelect.value),
    //        new UC.FetchArg("threshold", updateSensorTypeThresholdInput.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensortypethreshold", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("sensorID", updateSensorTypeSensorSelect.value),
            new UC.FetchArg("sensorType", sensorTypeSelect.value),
            new UC.FetchArg("threshold", updateSensorTypeThresholdInput.value)
        ]);
    checkReturnCode(returnMessage, "Sensortype succesfully updated!");

    await initialLoad();
}

// Function called when the client clicks on the "Remove sensortype reference" button
async function showRemoveSensorTypeReferenceMenu() {
    setElementDisplay([mainMenu, sensorTypeSettingMenu], "none");
    setElementDisplay([removeSensorTypeReferenceMenu], "block");

    let thresholdInfo = await getThresholdInfo();
    await populateSelectWithSensorsFromSensorType(removeSensorTypeReferenceSensorSelect, sensorTypeSelect, thresholdInfo);
}

// Function called when the client submits the sensortype reference removal
async function submitRemoveSensorTypeReference() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensortypereference", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("sensorType", sensorTypeSelect.value),
    //        new UC.FetchArg("sensorID", removeSensorTypeReferenceSensorSelect.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensortypereference", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("sensorType", sensorTypeSelect.value),
            new UC.FetchArg("sensorID", removeSensorTypeReferenceSensorSelect.value)
        ]);
    checkReturnCode(returnMessage, "Sensortype reference succesfully removed!");

    await initialLoad();
}

// Shows the choices you have when you pick a sensor
function showSensorTypeSettings() {
    setElementDisplay([sensorTypeSettingMenu], "block");
}

// Function called when the client chooses to remove the chosen sensor
async function removeSensorType() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensortype", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("sensorType", sensorTypeSelect.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensortype", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("sensorType", sensorTypeSelect.value)
        ]);
    checkReturnCode(returnMessage, "Sensortype succesfully removed!");

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