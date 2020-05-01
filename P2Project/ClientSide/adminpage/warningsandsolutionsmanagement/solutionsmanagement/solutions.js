import { UC } from "../../../js/utils.js";

//#region eventSetup

//#region mainMenu

let mainMenu = document.getElementById("mainMenu");
let addNewSolutionMenuButton = document.getElementById("addNewSolutionMenuButton");
addNewSolutionMenuButton.onclick = addNewSolutionMenuButton_Click;
let addExistingSolutionMenuButton = document.getElementById("addExistingSolutionMenuButton");
addExistingSolutionMenuButton.onclick = addExistingSolutionMenuButton_Click;
let solutionSelect = document.getElementById("solutionSelect");
solutionSelect.onchange = solutionSelect_OnChanged;
let solutionInfoBox = document.getElementById("solutionInfoBox");
let solutionMessageInfoBox = document.getElementById("solutionMessageInfoBox");
let solutionPriorityInfoBox = document.getElementById("solutionPriorityInfoBox");
let solutionWarningIdInfoBox = document.getElementById("solutionWarningIdInfoBox");
let solutionWarningMessageInfoBox = document.getElementById("solutionWarningMessageInfoBox");

//#endregion

//#region solutionSettingMenu

let solutionSettingMenu = document.getElementById("solutionSettingMenu");
let updateSolutionPriorityButton = document.getElementById("updateSolutionPriorityButton");
updateSolutionPriorityButton.onclick = updateSolutionPriorityButton_Click;
let updateSolutionMessageButton = document.getElementById("updateSolutionMessageButton");
updateSolutionMessageButton.onclick = updateSolutionMessageButton_Click;
let removeSolutionRefButton = document.getElementById("removeSolutionRefButton");
removeSolutionRefButton.onclick = removeSolutionRefButton_Click;
let removeSolutionButton = document.getElementById("removeSolutionButton");
removeSolutionButton.onclick = removeSolutionButton_Click;

//#endregion

//#region addNewSolutionMenu

let addNewSolutionMenu = document.getElementById("addNewSolutionMenu");
let addNewSolutionSubmitButton = document.getElementById("addNewSolutionSubmitButton");
addNewSolutionSubmitButton.onclick = addNewSolutionSubmitButton_Clicked;
let addNewSolutionBackButton = document.getElementById("addNewSolutionBackButton");
addNewSolutionBackButton.onclick = addNewSensorTypeBackButton_Clicked;
let addNewSolutionMessageInput = document.getElementById("addNewSolutionMessageInput");
let addNewSolutionWarningSelect = document.getElementById("addNewSolutionWarningSelect");
addNewSolutionWarningSelect.onchange = addNewSolutionWarningSelect_OnChanged;
let addNewSolutionPrioritySelect = document.getElementById("addNewSolutionPrioritySelect");
let addNewSolutionWarningInfoBox = document.getElementById("addNewSolutionWarningInfoBox");

//#endregion

//#region addExistingSolutionMenu

let addExistingSolutionMenu = document.getElementById("addExistingSolutionMenu");
let addExistingSolutionSubmitButton = document.getElementById("addExistingSolutionSubmitButton");
addExistingSolutionSubmitButton.onclick = addExistingSolutionSubmitButton_Click;
let addExistingSolutionBackButton = document.getElementById("addExistingSolutionBackButton");
addExistingSolutionBackButton.onclick = addExistingSolutionBackButton_Click;
let addExistingSolutionSolutionSelect = document.getElementById("addExistingSolutionSolutionSelect");
addExistingSolutionSolutionSelect.onchange = addExistingSolutionSolutionSelect_OnChanged;
let addExistingSolutionWarningSelect = document.getElementById("addExistingSolutionWarningSelect");
addExistingSolutionWarningSelect.onchange = addExistingSolutionWarningSelect_OnChanged;
let addExistingSolutionSolutionInfoBox = document.getElementById("addExistingSolutionSolutionInfoBox");
let addExistingSolutionWarningInfoBox = document.getElementById("addExistingSolutionWarningInfoBox");

//#endregion

//#region updateSolutionPriorityMenu

let updateSolutionPriorityMenu = document.getElementById("updateSolutionPriorityMenu");
let updateSolutionPrioritySubmitButton = document.getElementById("updateSolutionPrioritySubmitButton");
updateSolutionPrioritySubmitButton.onclick = updateSolutionPrioritySubmitButton_Click;
let updateSolutionPriorityBackButton = document.getElementById("updateSolutionPriorityBackButton");
updateSolutionPriorityBackButton.onclick = updateSolutionPriorityBackButton_Click;
let updateSolutionPrioritySelect = document.getElementById("updateSolutionPrioritySelect");
let updateSolutionPriorityInfoBox = document.getElementById("updateSolutionPriorityInfoBox");

//#endregion

//#region updateSolutionMessageMenu

let updateSolutionMessageMenu = document.getElementById("updateSolutionMessageMenu");
let updateSolutionMessageSubmitButton = document.getElementById("updateSolutionMessageSubmitButton");
updateSolutionMessageSubmitButton.onclick = updateSolutionMessageSubmitButton_Click;
let updateSolutionMessageBackButton = document.getElementById("updateSolutionMessageBackButton");
updateSolutionMessageBackButton.onclick = updateSolutionMessageBackButton_Click;
let updateSolutionMessageInput = document.getElementById("updateSolutionMessageInput");
let updateSolutionMessageInfoBox = document.getElementById("updateSolutionMessageInfoBox");

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

function solutionSelect_OnChanged() {
    showSolutionSettings();
}

async function addNewSolutionMenuButton_Click() {
    await showAddNewSolutionMenu();
}

async function addExistingSolutionMenuButton_Click() {
    await showAddExistingSolutionMenu();
}

//#endregion

//#region solutionSettingMenu

async function updateSolutionPriorityButton_Click() {
    await showUpdateSolutionPriorityMenu();
}

async function updateSolutionMessageButton_Click() {
    await showUpdateSolutionMessageMenu();
}

async function removeSolutionRefButton_Click() {
    setElementDisplay([popupBox], "block");
    popupConfirm.onclick = removeSolutionRef;
}

async function removeSolutionButton_Click() {
    setElementDisplay([popupBox], "block");
    popupConfirm.onclick = removeSolution;
}

//#endregion

//#region addNewSolutionMenu

async function addNewSensorTypeBackButton_Clicked() {
    await initialLoad();
}

async function addNewSolutionSubmitButton_Clicked() {
    await submitNewSolution();
}

async function addNewSolutionWarningSelect_OnChanged() {
    await populateWarningMessageInfoBox(addNewSolutionWarningSelect, addNewSolutionWarningInfoBox);
}

//#endregion

//#region addExistingSolutionMenu

async function addExistingSolutionBackButton_Click() {
    await initialLoad();
}

async function addExistingSolutionSubmitButton_Click() {
    await submitExistingSolution();
}

async function addExistingSolutionSolutionSelect_OnChanged() {
    await populateSolutionMessageInfoBox(addExistingSolutionSolutionSelect, addExistingSolutionSolutionInfoBox);
}

async function addExistingSolutionWarningSelect_OnChanged() {
    await populateWarningMessageInfoBox(addExistingSolutionWarningSelect, addExistingSolutionWarningInfoBox);
}

//#endregion

//#region updateSolutionPriorityMenu

async function updateSolutionPriorityBackButton_Click() {
    await initialLoad();
}

async function updateSolutionPrioritySubmitButton_Click() {
    await submitUpdateSolutionPriority();
}

//#endregion

//#region updateSolutionMessageMenu

async function updateSolutionMessageBackButton_Click() {
    await initialLoad();
}

async function updateSolutionMessageSubmitButton_Click() {
    await submitUpdateSolutionMessage();
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
    setElementDisplay([solutionSettingMenu, addNewSolutionMenu, addExistingSolutionMenu, updateSolutionPriorityMenu, updateSolutionMessageMenu, solutionInfoBox, popupBox], "none");
    setElementDisplay([mainMenu], "block");

    UC.clearSelect(solutionSelect);

    popupConfirm.onclick = popupConfirm_Click;

    let solutionInfo = await getSolutionInfo();
    await populateSelectWithSolutions(solutionSelect, solutionInfo);
}

async function getSolutionInfo() {
    //let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsolutions",
    //    [
    //        new BCC.FetchArg("username", sessionStorage.getItem("username")),
    //        new BCC.FetchArg("password", sessionStorage.getItem("password"))
    //    ]);
    let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsolutions",
        [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password")
        ]);
    return sensorTypeInfo.message.data;
}

async function getWarningInfo() {
    //let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallwarningsandsolutions",
    //    [
    //        new BCC.FetchArg("username", sessionStorage.getItem("username")),
    //        new BCC.FetchArg("password", sessionStorage.getItem("password"))
    //    ]);
    let warningInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallwarningsandsolutions",
        [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password")
        ]);
    return warningInfo.message.data;
}

async function getPriorityName(priority) {
    //let sensorTypeInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getpriorityname",
    //    [
    //        new BCC.FetchArg("username", sessionStorage.getItem("username")),
    //        new BCC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("prioriyID", priority)
    //    ]);
    let priorityName = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getpriorityname",
        [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("priorityID", priority)
        ]);
    return priorityName.message;
}

function populateSelectWithSolutions(solutionSelect, solutionInfo) {
    UC.clearSelect(solutionSelect);
    for (let i = 0; i < solutionInfo.length; i++) {
        solutionSelect.add(makeOptionFromParam("Solution " + solutionInfo[i].solutionID, solutionInfo[i].solutionID));
    }
}

function populateSelectWithWarnings(warningSelect, warningInfo) {
    UC.clearSelect(warningSelect);
    for (let i = 0; i < warningInfo.length; i++) {
        warningSelect.add(makeOptionFromParam("Warning " + warningInfo[i].warningID, warningInfo[i].warningID));
    }
}

async function populateSolutionMessageInfoBox(solutionSelect, infoBox) {
    let solutionInfo = await getSolutionInfo();
    let solution = solutionSelect.value;

    for (let i = 0; i < solutionInfo.length; i++) {
        if (solutionInfo[i].solutionID == solution) {
            infoBox.innerHTML = solutionInfo[i].message;
            break;
        }
    }
}

async function populateSolutionPriorityInfoBox(solutionSelect, infoBox) {
    let solutionInfo = await getSolutionInfo();
    let solution = solutionSelect.value;

    for (let i = 0; i < solutionInfo.length; i++) {
        if (solutionInfo[i].solutionID == solution) {
            infoBox.innerHTML = await getPriorityName(solutionInfo[i].warningPriority);
            break;
        }
    }
}

async function populateWarningMessageInfoBox(warningSelect, infoBox) {
    let warningInfo = await getWarningInfo();
    let warning = warningSelect.value;

    for (let i = 0; i < warningInfo.length; i++) {
        if (warningInfo[i].warningID == warning) {
            infoBox.innerHTML = warningInfo[i].message;
            break;
        }
    }
}

async function populateWarningIdInfoBox(solutionSelect, infoBox) {
    let solutionInfo = await getSolutionInfo();
    let solution = solutionSelect.value;

    for (let i = 0; i < solutionInfo.length; i++) {
        if (solutionInfo[i].solutionID == solution) {
            infoBox.innerHTML = solutionInfo[i].warningID;
            break;
        }
    }
}

async function populateWarningMessageInfoBoxFromSolution(solutionSelect, infoBox) {
    let solutionInfo = await getSolutionInfo();
    let warningInfo = await getWarningInfo();
    let solution = solutionSelect.value;

    for (let i = 0; i < solutionInfo.length; i++) {
        if (solutionInfo[i].solutionID == solution) {
            for (let j = 0; j < warningInfo.length; j++) {
                if (warningInfo[j].warningID == solutionInfo[i].warningID) {
                    infoBox.innerHTML = warningInfo[j].message;
                    break;
                }
            }
        }
    }
}

// Function called when client clicks on the "Add new solution" button
async function showAddNewSolutionMenu() {
    setElementDisplay([mainMenu, solutionSettingMenu, solutionInfoBox], "none");
    setElementDisplay([addNewSolutionMenu], "block");

    let warningInfo = await getWarningInfo();
    populateSelectWithWarnings(addNewSolutionWarningSelect, warningInfo);
}

// Function called when client submits the new solution
async function submitNewSolution() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsolution", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("warningID", addNewSolutionWarningSelect.value),
    //        new UC.FetchArg("warningPriority", addNewSolutionPrioritySelect.value),
    //        new UC.FetchArg("message", addNewSolutionInput.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsolution", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("warningID", addNewSolutionWarningSelect.value),
            new UC.FetchArg("priority", addNewSolutionPrioritySelect.value),
            new UC.FetchArg("message", addNewSolutionMessageInput.value)
    ]);

    console.log(returnMessage);

    await initialLoad();
}

// Function called when the client clicks on the "Add Existing SensorType" button
async function showAddExistingSolutionMenu() {
    setElementDisplay([mainMenu, solutionSettingMenu, solutionInfoBox], "none");
    setElementDisplay([addExistingSolutionMenu], "block");

    let solutionInfo = await getSolutionInfo();
    let warningInfo = await getWarningInfo();
    populateSelectWithSolutions(addExistingSolutionSolutionSelect, solutionInfo);
    populateSelectWithWarnings(addExistingSolutionWarningSelect, warningInfo);
}

// Function called when the client submits the existing sensortype add
async function submitExistingSolution() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addexistingsolution", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("solutionID", solutionSelect.value),
    //        new UC.FetchArg("warningID", addExistingSolutionWarningSelect.value)
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addexistingsolution", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("solutionID", addExistingSolutionSolutionSelect.value),
            new UC.FetchArg("warningID", addExistingSolutionWarningSelect.value)
        ]);

    await initialLoad();
}

// Function called when the client clicks on the "Update SensorType" button
async function showUpdateSolutionPriorityMenu() {
    setElementDisplay([mainMenu, solutionSettingMenu, solutionInfoBox], "none");
    setElementDisplay([updateSolutionPriorityMenu], "block");

    await populateSolutionPriorityInfoBox(solutionSelect, updateSolutionPriorityInfoBox);
}

// Function called when the client submits the sensortype update
async function submitUpdateSolutionPriority() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesolution", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("solutionID", solutionSelect.value),
    //        new UC.FetchArg("message", await getSolutionMessage(solutionSelect.value)),
    //        new UC.FetchArg("warningPriority", updateSolutionPrioritySelect.value)
    //    ]);
    let solutionMessage = await getSolutionMessage(solutionSelect.value);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesolution", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("solutionID", solutionSelect.value),
            new UC.FetchArg("message", solutionMessage),
            new UC.FetchArg("priority", updateSolutionPrioritySelect.value)
    ]);

    await initialLoad();
}

async function showUpdateSolutionMessageMenu() {
    setElementDisplay([mainMenu, solutionSettingMenu, solutionInfoBox], "none");
    setElementDisplay([updateSolutionMessageMenu], "block");
}

// Function called when the client submits the sensortype update
async function submitUpdateSolutionMessage() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesolution", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("solutionID", solutionSelect.value),
    //        new UC.FetchArg("message", updateSolutionMessageInput.value),
    //        new UC.FetchArg("warningPriority", await getSolutionPriority(solutionSelect.value))
    //    ]);
    let solutionPriority = await getSolutionPriority(solutionSelect.value);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesolution", [
        new UC.FetchArg("username", "Admin"),
        new UC.FetchArg("password", "Password"),
        new UC.FetchArg("solutionID", solutionSelect.value),
        new UC.FetchArg("message", updateSolutionMessageInput.value),
        new UC.FetchArg("priority", solutionPriority)
    ]);

    await initialLoad();
}

async function getSolutionMessage(solution) {
    let solutionInfo = await getSolutionInfo();

    for (let i = 0; i < solutionInfo.length; i++) {
        if (solutionInfo[i].solutionID == solution)
            return solutionInfo[i].message;
    }

    return "No message found";
}

async function getSolutionPriority(solution) {
    let solutionInfo = await getSolutionInfo();

    for (let i = 0; i < solutionInfo.length; i++) {
        if (solutionInfo[i].solutionID == solution)
            return solutionInfo[i].warningPriority;
    }

    return 2;
}

// Shows the choices you have when you pick a sensor
function showSolutionSettings() {
    setElementDisplay([solutionSettingMenu, solutionInfoBox], "block");
    populateSolutionMessageInfoBox(solutionSelect, solutionMessageInfoBox);
    populateSolutionPriorityInfoBox(solutionSelect, solutionPriorityInfoBox);
    populateWarningIdInfoBox(solutionSelect, solutionWarningIdInfoBox);
    populateWarningMessageInfoBoxFromSolution(solutionSelect, solutionWarningMessageInfoBox);
}

// Function called when the client clicks on the "Remove sensortype reference" button
async function removeSolutionRef() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesolutionreference", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("solutionID", solutionSelect.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesolutionreference", [
        new UC.FetchArg("username", "Admin"),
        new UC.FetchArg("password", "Password"),
        new UC.FetchArg("solutionID", solutionSelect.value)
    ]);

    await initialLoad();

}

// Function called when the client chooses to remove the chosen sensor
async function removeSolution() {
    //let returnMessage = await UC.jsonFetch(
    //    "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensortype", [
    //        new UC.FetchArg("username", sessionStorage.getItem("username")),
    //        new UC.FetchArg("password", sessionStorage.getItem("password")),
    //        new UC.FetchArg("solutionID", solutionSelect.value)
    //    ]);
    let returnMessage = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesolution", [
            new UC.FetchArg("username", "Admin"),
            new UC.FetchArg("password", "Password"),
            new UC.FetchArg("solutionID", solutionSelect.value)
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