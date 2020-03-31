try {
    let fetchedData;

    async function jsonFetch(url) {
        let response = await fetch(url);
        fetchedData = await response.json();

        console.log(fetchedData);
        await importDataToSelect();
    }

    jsonFetch("http://localhost:5000/getsensorinfo").catch(e => console.log(e));

    //Adds more elements to the select in the html for room selection
    async function importDataToSelect() {
        let roomSelect = document.getElementById("selectedRoom");

        for (let i = 0; i < fetchedData.length; i++) {
            let option = document.createElement("option");
            option.text = fetchedData[i].RoomName;
            roomSelect.add(option);
        }
    }

    //Activates once a new room has been selected
    function roomChangeFunction() {
        let roomSelect = document.getElementById("selectedRoom");
        let roomData = fetchedData[roomSelect.selectedIndex];

        //Resets the data display section
        document.getElementById("data").innerHTML = "";

        displayRoomData(roomData);
    }

    function displayRoomData(roomData) {
        let dataDisplay = document.getElementById("data");

        for (let i = 0; i < roomData[0].length; i++) {
            dataDisplay.innerHTML += "<br>Sensor ID: " + roomData[0][i].SensorID + "<br>";
            dataDisplay.innerHTML += "<br>Sensor measurements: <br>";

            DRD_SearchMeasurements(dataDisplay, roomData, i);

            dataDisplay.innerHTML += "<br><hr>";
        }
    }

    //Searches the array roomData for which kind of sensors the unit has. For example
    //one unit may have both a CO2 and oxygen sensor.
    function DRD_SearchMeasurements(dataDisplay, roomData, i) {
        for (let y = 0; y < roomData[0][i].length; y++) {
            DRD_DisplayFoundMeasurements(dataDisplay, roomData, i, y)
        }
    }

    //Displays the measurements which have been found in DRD_SearchMeasurements
    function DRD_DisplayFoundMeasurements(dataDisplay, roomData, i, y) {
        for (let j = 0; j < roomData[0][i][y].length; j++) {
            dataDisplay.innerHTML += "&emsp;" + roomData[0][i][y][j] + "<br>";
        }
    }

} catch (err) {console.log(err)}