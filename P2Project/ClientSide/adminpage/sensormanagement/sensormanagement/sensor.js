import { UC } from "../../../js/utils.js";

let sensorInfo = [];
let sensorButtons = [];
let currentSensor = -1;

async function GetInformation() {
    sensorInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    console.log(sensorInfo);
    await importDataToSelect();
    setBrDisplay("none");
} window.onload = GetInformation();

// Adds more elements to the select in the html for room selection
async function importDataToSelect() {
    let roomSelect = document.getElementById("selectedRoom");

    for (let i = 0; i < sensorInfo.length; i++) {
        let option = document.createElement("option");
        option.text = sensorInfo[i].roomName;
        option.value = i;
        roomSelect.add(option);
    }
}

// Populates the sensor dropdown menu with all sensors in the chosen room
function populateSensorMenu() {
    let selectBox = document.getElementById("selectedRoom");
    let room = selectBox.options[selectBox.selectedIndex].value;
    let sensorMenu = document.getElementById("sensorSearch"); // Apparently this only works with a child of the parent I want to bind it to

    vacateSensorMenu();
    removeSensorChoices();

    for (let i = 0; i < sensorInfo[room].sensors.length; i++) {
        let sensor = document.createElement("button");
        sensorMenu.appendChild(sensor);
        sensor.innerHTML = "Sensor " + sensorInfo[room].sensors[i].sensorID;
        sensor.onclick = function () { sensorClicked(sensorInfo[room].sensors[i].sensorID) };
        sensorMenu.insertAdjacentElement("afterend", sensor);

        sensorButtons.push(sensor);
    }
} document.getElementById("selectedRoom").onchange = populateSensorMenu;

// Removes all sensors in the sensor dropdown menu
function vacateSensorMenu() {
    sensorButtons.forEach(function (v) {
        v.parentNode.removeChild(v);
    });
    sensorButtons = [];
}

// Function that filters the sensors by the chosen search string
function filterFunction() {
    let input = document.getElementById("sensorSearch");
    let filter = input.value.toUpperCase();

    for (let i = 0; i < sensorButtons.length; i++) {
        let txtValue = sensorButtons[i].innerHTML;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            appendButton(sensorButtons[i]);
        } else {
            removeButton(sensorButtons[i]);
        }
    }
} document.getElementById("sensorSearch").onkeyup = filterFunction;

// Removes a sensor from the sensor dropdown menu
function removeButton(button) {
    if (button.style.display != "none") {
        let sensorMenu = document.getElementById("sensorSelectContent");
        let check = false;

        sensorButtons.forEach(function (v) {
            console.log(button.innerHTML);
            if (check == true) {
                v.style.top = "" + (parseFloat(v.style.top) - 26) + "px";
            }
            else if (v == button) {
                v.style.display = "none";
                check = true;
                sensorMenu.style.height = "" + (parseFloat(sensorMenu.style.height) - 26) + "px";
            }
            console.log(button.innerHTML);
        });
    }
}

// Appends a sensor to the sensor dropdown menu
function appendButton(button) {
    if (button.style.display != "block") {
        let sensorMenu = document.getElementById("sensorSelectContent");
        let check = false;

        sensorButtons.forEach(function (v) {
            if (check == true) {
                v.style.top = "" + (parseFloat(v.style.top) + 26) + "px";
            }
            else if (v == button) {
                v.style.display = "block";
                check = true;
                sensorMenu.style.height = "" + (parseFloat(sensorMenu.style.height) + 26) + "px";
            }
        });
    }
}

// Toggles the sensor dropdown menu
function sensorSelectShow() {
    if (document.getElementById("sensorSelectContent").style.display == "none") {
        document.getElementById("sensorSelectContent").style.display = "block";
        sensorButtons.forEach(function (v) {
            v.style.display = "block";
        });
    }
    else {
        document.getElementById("sensorSelectContent").style.display = "none";
        sensorButtons.forEach(function (v) {
            v.style.display = "none";
        });
    }
} document.getElementById("sensorSelectButton").onclick = sensorSelectShow;

// Function called when client clicks on the "Add new sensor" button
function addNewSensorButton() {
    document.getElementById("sensorSelect").style.display = "none";
    document.getElementById("addNewSensorButton").style.display = "none";
    document.getElementById("br1").style.display = "none";
    document.getElementById("submitNewSensor").style.display = "block";
    document.getElementById("selectedRoom").onchange = "";
    document.getElementById("selectedRoom").value = -1;
} document.getElementById("addNewSensorButton").onclick = addNewSensorButton;

// Function called when client submits the new sensor
async function submitNewSensorButton() {
    let roomSelect = document.getElementById("selectedRoom");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/addnewsensor?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&roomID=" + roomSelect.value).catch(e => console.log(e));
    if (returnMessage.returnCode == 212)
        console.log("Sensor added succesfully.");

    document.getElementById("sensorSelect").style.display = "block";
    document.getElementById("addNewSensorButton").style.display = "block";
    document.getElementById("br1").style.display = "block";
    document.getElementById("submitNewSensor").style.display = "none";
    roomSelect.onchange = populateSensorMenu;
    roomSelect.value = -1;
} document.getElementById("submitNewSensor").onclick = submitNewSensorButton;

// Shows the choices you have when you pick a sensor
function sensorClicked(sensorID) {
    document.getElementById("sensorSelectButton").innerHTML = "Sensor " + sensorID + "<i class='arrowDown'>";
    sensorSelectShow();
    setBrDisplay("block");
    document.getElementById("updateSensor").style.display = "block";
    document.getElementById("removeSensorRef").style.display = "block";
    document.getElementById("removeSensor").style.display = "block";
    currentSensor = sensorID;
}

// Removes the choices for the sensors
function removeSensorChoices() {
    document.getElementById("sensorSelectButton").innerHTML = "Select Sensor" + "<i class='arrowDown'>";
    setBrDisplay("none");
    document.getElementById("updateSensor").style.display = "none";
    document.getElementById("removeSensorRef").style.display = "none";
    document.getElementById("removeSensor").style.display = "none";
    vacateSensorMenu();
}

// Function to remove or display breaks
function setBrDisplay(mode) {
    if (mode == "block") {
        document.getElementById("br2").style.display = "block";
        document.getElementById("br3").style.display = "block";
        document.getElementById("br4").style.display = "block";
    } else if (mode == "none"){
        document.getElementById("br2").style.display = "none";
        document.getElementById("br3").style.display = "none";
        document.getElementById("br4").style.display = "none";
    }
}

function updateSensor() {
    document.getElementById("sensorSelect").style.display = "none";
    document.getElementById("addNewSensorButton").style.display = "none";
    document.getElementById("br1").style.display = "none";
    removeSensorChoices();
    document.getElementById("submitUpdate").style.display = "block";
    document.getElementById("selectedRoom").onchange = "";
    document.getElementById("selectedRoom").value = -1;
} document.getElementById("updateSensor").onclick = updateSensor;

async function submitUpdate() {
    let roomSelect = document.getElementById("selectedRoom");
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/updatesensor?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&roomID=" + roomSelect.value + "&sensorID=" + currentSensor).catch(e => console.log(e));
    if (returnMessage.returnCode == 230)
        console.log("Sensor updated succesfully.");

    document.getElementById("sensorSelect").style.display = "block";
    document.getElementById("addNewSensorButton").style.display = "block";
    document.getElementById("br1").style.display = "block";
    document.getElementById("submitUpdate").style.display = "none";
    roomSelect.onchange = populateSensorMenu;
    roomSelect.value = -1;
    currentSensor = -1;
    vacateSensorMenu();
} document.getElementById("submitUpdate").onclick = submitUpdate;

async function removeSensorRef() {
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensorref?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&sensorID=" + currentSensor).catch(e => console.log(e));
    if (returnMessage.returnCode == 215)
        console.log("Sensor referenced removed succesfully.");

    removeSensorChoices();
    document.getElementById("selectedRoom").value = -1;
    currentSensor = -1;
} document.getElementById("removeSensorRef").onclick = removeSensorRef;

async function removeSensor() {
    let returnMessage = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/removesensor?username=" + sessionStorage.getItem("username") + "&password=" + sessionStorage.getItem("password") + "&sensorID=" + currentSensor).catch(e => console.log(e));
    if (returnMessage.returnCode == 213)
        console.log("Sensor removed succesfully.");

    removeSensorChoices();
    document.getElementById("selectedRoom").value = -1;
    currentSensor = -1;
} document.getElementById("removeSensor").onclick = removeSensor;