const sql = require("mssql");
const fs = require("fs");

module.exports.getSensorInfoQuery = function () {
    let sensorInfo = [];

    try {
        let allRooms = getAllRooms();
        allRooms.forEach(function (v) {
            let sensorsInRoom = getSensorsInRoom(v.RoomID);
            let RoomSensors = [];

            sensorsInRoom.forEach(function (v2) {
                let SensorTypes = getSensorTypes(v2.SensorID);
                v2.push(SensorTypes);
                RoomSensors.push(v2);
            });

            v.push(RoomSensors);
            sensorInfo.push(v);
        })
    } catch (err) {
        console.log(err);
    }

    return sensorInfo;
}

function getAllRooms() {
    let rooms = [];
    
    try {
        let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        sql.connect(JSON.parse(file));
        let queryTable = sql.query("SELECT * FROM [SensorRooms]");
        queryTable.recordset.forEach(v => rooms.push(v));
        console.log(rooms);
    } catch (err) {
        console.log(err);
    }

    return rooms;
}

async function getSensorsInRoom(room) {
    let sensors = [];

    try {
        let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("roomInput", sql.Int, room);

        let queryTable = await request.query("SELECT [SensorID] FROM [SensorInfo] WHERE [RoomID]=@roomInput");
        queryTable.recordset.forEach(v => {
            sensors.push(v);
        });
        console.log(sensors);
    } catch (err) {
        console.log(err);
    }

    return sensors;
}

async function getSensorTypes(sensorID) {
    let sensorTypes = [];
    let sensorTypeNames = [];

    try {
        let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = await request.query("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorIDInput");
        queryTable.recordset.forEach(v => sensorTypes.push(v.SensorType));
        console.log(sensorTypes);

        sensorTypes.forEach(async function (v) {
            sensorTypeNames.push(await getSensorTypeName(v));
        });
        console.log(sensorTypeNames);
    } catch (err) {
        console.log(err);
    }

    return sensorTypeNames;
}

async function getSensorTypeName(sensorType) {
    let sensorTypeName = [];

    try {
        let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("sensorTypeInput", sql.Int, sensorType);

        let queryTable = await request.query("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput");
        queryTable.recordset.forEach(v => sensorTypeName.push(v));
        console.log(sensorTypeName);
    } catch (err) {
        console.log(err);
    }

    return sensorTypeName;
}