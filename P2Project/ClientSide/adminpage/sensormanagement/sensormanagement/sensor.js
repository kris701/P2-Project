import { UC } from "../../../js/utils.js";

let sensorInfo = [];
let sensorButtons = [];

async function GetInformation() {
    sensorInfo = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
    console.log(sensorInfo);
    await importDataToSelect();
}
window.onload = GetInformation();

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

function populateSensorMenu() {
    let selectBox = document.getElementById("selectedRoom");
    let room = selectBox.options[selectBox.selectedIndex].value;
    let sensorMenu = document.getElementById("sensorSearch"); // Apparently this only works with a child of the parent I want to bind it to

    vacateSensorMenu();

    for (let i = 0; i < sensorInfo[room].sensors.length; i++) {
        let sensor = document.createElement("button");
        sensorMenu.appendChild(sensor);
        sensor.innerHTML = "Sensor " + sensorInfo[room].sensors[i].sensorID;
        sensorMenu.insertAdjacentElement("afterend", sensor);

        sensorButtons.push(sensor);
    }
}
document.getElementById("selectedRoom").onchange = populateSensorMenu;

function vacateSensorMenu() {
    sensorButtons.forEach(function (v) {
        v.parentNode.removeChild(v);
    });
    sensorButtons = [];
}

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
}
document.getElementById("sensorSearch").onkeyup = filterFunction;

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
}
document.getElementById("sensorSelectButton").onclick = sensorSelectShow;