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

        displayRoomData(roomData);
    }

    function displayRoomData(roomData) {
        let dataDisplay = document.getElementById("dataDisplaySingle");
        dataDisplay.style.color = red;
    }

} catch (err) {console.log(err)}