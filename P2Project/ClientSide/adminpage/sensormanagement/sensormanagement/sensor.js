import { UC } from "../../../js/utils.js";

let sensorInfo = [];

async function GetInformation() {
    sensorInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    await importDataToSelect();
} window.onload = GetInformation();

// Adds more elements to the select in the html for room selection
async function importDataToSelect() {
    let roomSelect = document.getElementById("selectedRoom");
    addOptionsToSelect(sensorInfo, roomSelect, "", "roomName");
}

// Populates the sensor dropdown menu with all sensors in the chosen room
function populateSensorMenu() {
    let selectBox = document.getElementById("selectedRoom");
    let room = selectBox.options[selectBox.selectedIndex].value;
    let sensorSelect = document.getElementById("selectedSensor");

    vacateSensorMenu();
    removeSensorChoices();
    addOptionsToSelect(sensorInfo[room].sensors, sensorSelect, "Sensor ", "sensorID");
} document.getElementById("selectedRoom").onchange = populateSensorMenu;

async function populateSensorMenuForDefaultRoom() {
    let sensorSelect = document.getElementById("selectedSensor");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/getallsensors?username=" + "Admin" + "&password=" + "Password").catch(e => console.log(e));
    let sensors = returnMessage.data;

    for (let i = sensors.length - 1; i >= 0; i--) {
        if (sensors[i].roomID != -1)
            sensors.splice(i);
    }

    vacateSensorMenu();
    addOptionsToSelect(sensors, sensorSelect, "Sensor ", "sensorID");
}

// Adds options from the input array to the given select element
function addOptionsToSelect(inputArray, selectElement, prefix, index) {
    for (let i = 0; i < inputArray.length; i++) {
        let option = document.createElement("option");
        option.text = prefix + inputArray[i][index];
        option.value = (prefix == "") ? i : inputArray[i][index];
        selectElement.add(option);
    }
}

// Removes all sensors in the sensor dropdown menu
function vacateSensorMenu() {
    let sensorSelect = document.getElementById("selectedSensor");
    for (let i = sensorSelect.options.length - 1; i >= 0 ; i--) {
        let option = sensorSelect.options[i];
        if (option.value != -1)
            option.parentNode.removeChild(option);
    }
}

// Function called when client clicks on the "Add new sensor" button
function addNewSensorButton() {
    setElementDisplay(["sensorSelect", "addNewSensorButton", "addExistingSensorButton"], "none");
    setElementDisplay(["submitSensor"], "inline-block");
    document.getElementById("submitSensor").onclick = submitNewSensorButton;
    removeSensorChoices();
    document.getElementById("selectedRoom").onchange = "";
    document.getElementById("selectedRoom").value = -1;
} document.getElementById("addNewSensorButton").onclick = addNewSensorButton;

// Function called when client submits the new sensor
async function submitNewSensorButton() {
    let roomSelect = document.getElementById("selectedRoom");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensor?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&roomID=" + roomSelect.value).catch(e => console.log(e));
    if (returnMessage.returnCode == 212)
        console.log("Sensor added succesfully.");

    setElementDisplay(["addNewSensorButton", "addExistingSensorButton"], "inline-block");
    setElementDisplay(["sensorSelect"], "inline-block");
    setElementDisplay(["submitSensor"], "none");
    roomSelect.onchange = populateSensorMenu;
    roomSelect.value = -1;
    document.getElementById("selectedSensor").value = -1;
}

// Function called when the client clicks on the "Add Existing Sensor" button
async function addExistingSensorButton() {
    swapElements(document.getElementById("roomSelect"), document.getElementById("sensorSelect"));
    removeSensorChoices();
    await populateSensorMenuForDefaultRoom();
    setElementDisplay(["addNewSensorButton", "addExistingSensorButton"], "none");
    setElementDisplay(["submitSensor"], "inline-block");
    document.getElementById("submitSensor").onclick = submitExistingSensorButton;
    document.getElementById("selectedRoom").onchange = "";
    document.getElementById("selectedRoom").value = -1;
    document.getElementById("selectedSensor").onchange = "";
    document.getElementById("selectedSensor").value = -1;
} document.getElementById("addExistingSensorButton").onclick = addExistingSensorButton;

// Function called when the client submits the existing sensor add
async function submitExistingSensorButton() {
    let roomSelect = document.getElementById("selectedRoom");
    let sensorSelect = document.getElementById("selectedSensor");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensor?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&roomID=" + roomSelect.value + "&sensorID=" + sensorSelect.value).catch(e => console.log(e));
    if (returnMessage.returnCode == 230)
        console.log("Sensor added succesfully.");

    swapElements(document.getElementById("sensorSelect"), document.getElementById("roomSelect"));
    setElementDisplay(["addNewSensorButton", , "addExistingSensorButton"], "inline-block");
    setElementDisplay(["submitSensor"], "none");
    roomSelect.onchange = populateSensorMenu;
    sensorSelect.onchange = sensorClicked;
    vacateSensorMenu();
    roomSelect.value = -1;
    sensorSelect.value = -1;
}

// Shows the choices you have when you pick a sensor
function sensorClicked() {
    setElementDisplay(["updateSensor", "removeSensorRef", "removeSensor"], "block");
} document.getElementById("selectedSensor").onchange = sensorClicked;

// Removes the choices for the sensors
function removeSensorChoices() {
    setElementDisplay(["updateSensor", "removeSensorRef", "removeSensor"], "none");
}

// Function called when the client chooses to update the chosen sensor
function updateSensor() {
    setElementDisplay(["sensorSelect", "addNewSensorButton", "addExistingSensorButton"], "none");
    setElementDisplay(["submitUpdate"], "inline-block");
    removeSensorChoices();
    vacateSensorMenu();
    document.getElementById("selectedRoom").onchange = "";
    document.getElementById("selectedRoom").value = -1;
} document.getElementById("updateSensor").onclick = updateSensor;

// Function called when the client submits the sensor update
async function submitUpdate() {
    let roomSelect = document.getElementById("selectedRoom");
    let sensorSelect = document.getElementById("selectedSensor");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensor?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&roomID=" + roomSelect.value + "&sensorID=" + sensorSelect.value).catch(e => console.log(e));
    if (returnMessage.returnCode == 230)
        console.log("Sensor updated succesfully.");

    //showOnlyTheseElements(["addNewSensorButton", "addExistingSensorButton", "sensorSelect"]);
    setElementDisplay(["addNewSensorButton", "addExistingSensorButton"], "inline-block");
    setElementDisplay(["sensorSelect"], "inline-block");
    setElementDisplay(["submitUpdate"], "none");
    roomSelect.onchange = populateSensorMenu;
    roomSelect.value = -1;
    sensorSelect.value = -1;
    vacateSensorMenu();
} document.getElementById("submitUpdate").onclick = submitUpdate;

// Function called when the client chooses to remove the references of the chosen sensor
async function removeSensorRef() {
    let sensorSelect = document.getElementById("selectedSensor");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensorref?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&sensorID=" + sensorSelect.value).catch(e => console.log(e));
    if (returnMessage.returnCode == 215)
        console.log("Sensor referenced removed succesfully.");

    removeSensorChoices();
    document.getElementById("selectedRoom").value = -1;
    sensorSelect.value = -1;
    vacateSensorMenu();
} document.getElementById("removeSensorRef").onclick = removeSensorRef;

// Function called when the client chooses to remove the chosen sensor
async function removeSensor() {
    let sensorSelect = document.getElementById("selectedSensor");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensor?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&sensorID=" + sensorSelect.value).catch(e => console.log(e));
    if (returnMessage.returnCode == 213)
        console.log("Sensor removed succesfully.");

    removeSensorChoices();
    document.getElementById("selectedRoom").value = -1;
    sensorSelect.value = -1;
    vacateSensorMenu();
} document.getElementById("removeSensor").onclick = removeSensor;

// Generic function to set the display style of an array of elements
function setElementDisplay(elemArray, mode) {
    elemArray.forEach(function (v) {
        document.getElementById(v).style.display = mode;
    });
}

// Function to swap two elements
function swapElements(elementOne, elementTwo) {
    elementOne.parentNode.insertBefore(elementTwo, elementOne)
}

// DOES NOT WORK
//function showOnlyTheseElements(elemArray) {
//    let allElements = document.body.getElementsByTagName("*");
//    let displayContainer = document.getElementsByClassName("displayContainer");
//    let enabledElements = [displayContainer[0]];

//    for (let i = 0; i < elemArray.length; i++)
//        enabledElements.push(document.getElementById(elemArray[i]));

//    for (let i = 0; i < allElements.length; i++) {
//        if (typeof (allElements[i]) != typeof (0)) {
//            if (enabledElements.includes(allElements[i]))
//                allElements[i].style.display = "inline-block";
//            else
//                allElements[i].style.display = "none";
//        }
//    }
//}