import { UtilsClass } from './utils.js';

import { Graphing } from './graphing.js';

try {

    // Use this to get resource data:
    //      let fetchedData = await UtilsClass.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/resource").catch(e => console.log(e));

    let roomData = [];

    async function GetInformation() {
        roomData = await UtilsClass.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
        await importDataToSelect();
    }
    window.onload = GetInformation;

    //Adds more elements to the select in the html for room selection
    async function importDataToSelect() {
        let roomSelect = document.getElementById("selectedRoom");

        for (let i = 0; i < roomData.length; i++) {
            let option = document.createElement("option");
            option.text = roomData[i].roomName;
            roomSelect.add(option);
        }
    }

    //Activates once a new room has been selected
    const currentRoom = document.getElementById("selectedRoom");
    currentRoom.addEventListener("change", (evt) =>
            roomChangeFunction()
        );

    function roomChangeFunction() {
        console.log("RoomChangeFunction activated."); ///////////////////////////
        if (roomData.length != 0) {
            console.log("roomdata.length != 0"); ///////////////////////////
            let roomSelect = document.getElementById("selectedRoom");

            //Resets the data display section
            document.getElementById("data").innerHTML = "";


            displayRoomData(roomData[roomSelect.selectedIndex]);
        }
    }

    function displayRoomData(currentRoomData) {
        let dataDisplay = document.getElementById("data");
        console.log("Im also here"); ///////////////////////////
        for (let i = 0; i < currentRoomData.sensors.length; i++) {
            dataDisplay.innerHTML += "<br>Sensor ID: " + currentRoomData.sensors[i].sensorID + "<br>";
            dataDisplay.innerHTML += "<br>Sensor measurements: <br>";

            DRD_SearchMeasurements(dataDisplay, currentRoomData, i);

            dataDisplay.innerHTML += "<br><hr>";
        }
    }

    //Searches the array roomData for which kind of sensors the unit has. For example
    //one unit may have both a CO2 and oxygen sensor.
    function DRD_SearchMeasurements(dataDisplay, roomData, i) {
        for (let y = 0; y < roomData.sensors[i].types.length; y++) {
            dataDisplay.innerHTML += "&emsp;" + roomData.sensors[i].types[y] + "<br>";
        }
    }



} catch (err) { console.log(err) }

