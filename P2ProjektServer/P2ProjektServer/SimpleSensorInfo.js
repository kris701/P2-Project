const sql = require("mssql");
const fs = require("fs");

module.exports.getSensorInfoQuery = async function () {
    let sensorInfo = [];

    try {
        let allRooms = await getAllRooms();
        allRooms.forEach(v => {
            let sensorsInRoom = await getSensorsInRoom(v.RoomID);
            sensorsInRoom.forEach(v2 => {
                v2.push(await getSensorTypes(v2.SensorID));
                v.push(v2);
            });

            sensorInfo.push(v);
        })
    } catch (err) {
        console.log(err);
    }

    return sensorInfo;
}

async function getAllRooms() {
    let rooms = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        let queryTable = await sql.query("SELECT * FROM [SensorRooms]");
        queryTable.recordset.forEach(v => rooms.push(v));
    } catch (err) {
        console.log(err);
    }

    return rooms;
}

async function getSensorsInRoom(room) {
    let sensors = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("roomInput", sql.Int, room);

        let queryTable = request.query("SELECT [SensorID] FROM [SensorInfo] WHERE [RoomID]=@roomInput");
        queryTable.recordset.forEach(v => {
            let tempArray = [v];
            sensors.push(tempArray)
        });
    } catch (err) {
        console.log(err);
    }

    return sensors;
}

async function getSensorTypes(sensorID) {
    let sensorTypes = [];
    let sensorTypeNames = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = request.query("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorIDInput");
        queryTable.recordset.forEach(v => sensorTypes.push(v.SensorType));

        sensorTypes.forEach(v => sensorTypeNames.push(await getSensorTypeName(v)));
    } catch (err) {
        console.log(err);
    }

    return sensorTypeNames;
}

async function getSensorTypeName(sensorType) {
    let sensorTypeName = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("sensorTypeInput", sql.Int, sensorType);

        let queryTable = request.query("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput");
        queryTable.recordset.forEach(v => sensorTypeName.push(v));
    } catch (err) {
        console.log(err);
    }

    return sensorTypeName;
}