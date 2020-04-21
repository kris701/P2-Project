import { jsonFetch } from "./utils.js";

try {

    // Use this to get resource data:
    //      let fetchedData = await jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/resource").catch(e => console.log(e));

    let RoomData = [];

    async function GetInformation() {
        RoomData = await jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/getsensorinfo");
        await importDataToSelect();
    }
    window.onload = GetInformation;

    //Adds more elements to the select in the html for room selection
    async function importDataToSelect() {
        let roomSelect = document.getElementById("selectedRoom");

        for (let i = 0; i < RoomData.length; i++) {
            let option = document.createElement("option");
            option.text = RoomData[i].RoomName;
            roomSelect.add(option);
        }
    }

    //Activates once a new room has been selected
    function roomChangeFunction() {
        let roomSelect = document.getElementById("selectedRoom");
        let roomData = RoomData[roomSelect.selectedIndex];

        //Resets the data display section
        document.getElementById("data").innerHTML = "";

        displayRoomData(roomData);
    }

    function displayRoomData(roomData) {
        let dataDisplay = document.getElementById("data");

        for (let i = 0; i < roomData.Sensors.length; i++) {
            dataDisplay.innerHTML += "<br>Sensor ID: " + roomData.Sensors[i].SensorID + "<br>";
            dataDisplay.innerHTML += "<br>Sensor measurements: <br>";
            console.log("1   " + roomData.Sensors);

            DRD_SearchMeasurements(dataDisplay, roomData, i);

            dataDisplay.innerHTML += "<br><hr>";
        }
    }

    //Searches the array roomData for which kind of sensors the unit has. For example
    //one unit may have both a CO2 and oxygen sensor.
    function DRD_SearchMeasurements(dataDisplay, roomData, i) {
        for (let y = 0; y < roomData.Sensors[i].Types.length; y++) {
            dataDisplay.innerHTML += "&emsp;" + roomData.Sensors[i].Types[y] + "<br>";
        }
    }

} catch (err) { console.log(err) }

