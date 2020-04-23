// Use this to get resource data:
// let fetchedData = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/resource").catch(e => console.log(e));


import { UC } from './utils.js';
import { GRPH } from './graphing.js';


try {
    let roomData = [];
    let prediction = [];


    async function GetInformation() {
        roomData = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
        await importDataToSelect();
    }


    async function getPredictions(ID, date) {
        prediction = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getpredictiondata?room=" + ID + "&date=" + date);
    }


    window.onload = GetInformation;


    // Adds more elements to the select in the html for room selection
    async function importDataToSelect() {
        let roomSelect = document.getElementById("selectedRoom");

        for (let i = 0; i < roomData.length; i++) {
            let option = document.createElement("option");
            option.text = roomData[i].roomName;
            roomSelect.add(option);
        }
    }


    // Activates once a new room has been selected
    const currentRoom = document.getElementById("selectedRoom");
    currentRoom.addEventListener("change", (evt) => roomChangeFunction());

    async function roomChangeFunction() {
        if (roomData.length != 0) {

            let roomSelect = document.getElementById("selectedRoom");
            
            await getPredictions(roomData[roomSelect.selectedIndex].roomID, "2020-04-20T12:00:00");

            // Clears graph area.
            GRPH.clearGraphArea();

            // Gets the length of the x axis
            let xLength = GRPH.getHighestTimestamp(prediction);

            // Generate a graph of all the sensortypes, in one
            GRPH.createTotalGraph(prediction, "A", xLength);

            // This for loop is where the createGraph function is called. i is passed along also so that 
            // it is clear which iteration of graph is the current and the total number of graps also
            for (let i = 0; i < prediction.data.length; i++) {
                GRPH.createGraph(prediction.data[i], i, xLength, prediction.interval);
            }

            // Resets the data display section
            document.getElementById("data").innerHTML = "";

            displayRoomData(roomData[roomSelect.selectedIndex]);
        }
    }


    function displayRoomData(currentRoomData) {
        let dataDisplay = document.getElementById("data");

        for (let i = 0; i < currentRoomData.sensors.length; i++) {
            dataDisplay.innerHTML += "<br>Sensor ID: " + currentRoomData.sensors[i].sensorID + "<br>";
            dataDisplay.innerHTML += "<br>Sensor measurements: <br>";

            DRD_SearchMeasurements(dataDisplay, currentRoomData, i);

            dataDisplay.innerHTML += "<br><hr>";
        }
    }


    // Searches the array roomData for which kind of sensors the unit has. For example
    // one unit may have both a CO2 and oxygen sensor.
    function DRD_SearchMeasurements(dataDisplay, roomData, i) {
        for (let y = 0; y < roomData.sensors[i].types.length; y++) {
            dataDisplay.innerHTML += "&emsp;" + roomData.sensors[i].types[y] + "<br>";
        }
    }


} catch (err) { console.log(err) }

