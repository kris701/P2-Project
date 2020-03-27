const sql = require("mssql");
const fs = require("fs");

module.exports.getSensorInfoQuery = async function () {
    let sensorInfo = [];

    try {
        let allRooms = await getAllRooms();
        await asyncForEach(allRooms, async function (v) {
            let sensorsInRoom = await getSensorsInRoom(v.RoomID);
            let RoomSensorsArray = [];
            let RoomSensors = [];

            await asyncForEach(sensorsInRoom, async function (v2) {
                let SensorTypeArray = [];
                let SensorTypes = await getSensorTypes(v2.SensorID);
                SensorTypeArray.push(SensorTypes);
                Array.prototype.push.apply(v2, SensorTypeArray);
                RoomSensors.push(v2);
            });

            RoomSensorsArray.push(RoomSensors);
            Array.prototype.push.apply(v, RoomSensorsArray);
            sensorInfo.push(v);
        })
    } catch (err) {
        console.log(err);
    }

    return sensorInfo;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function getAllRooms() {
    let rooms = [];
    
    try {
        //let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        let file = fs.readFileSync("C:/Users/kris7/OneDrive/Programming/_ GitHub _/School Projects/P2Project/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        await sql.connect(JSON.parse(file));
        let queryTable = await sql.query("SELECT * FROM [SensorRooms]");
        sql.close();
        queryTable.recordset.forEach(v => rooms.push(v));
    } catch (err) {
        console.log(err);
    }

    return rooms;
}

async function getSensorsInRoom(room) {
    let sensors = [];

    try {
        //let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        let file = fs.readFileSync("C:/Users/kris7/OneDrive/Programming/_ GitHub _/School Projects/P2Project/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("roomInput", sql.Int, room);

        let queryTable = await request.query("SELECT [SensorID] FROM [SensorInfo] WHERE [RoomID]=@roomInput");
        queryTable.recordset.forEach(v => { sensors.push(v); });
    } catch (err) {
        console.log(err);
    }

    return sensors;
}

async function getSensorTypes(sensorID) {
    let sensorTypes = [];
    let sensorTypeNames = [];

    try {
        //let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        let file = fs.readFileSync("C:/Users/kris7/OneDrive/Programming/_ GitHub _/School Projects/P2Project/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = await request.query("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorIDInput");
        queryTable.recordset.forEach(v => sensorTypes.push(v.SensorType));

        await asyncForEach(sensorTypes, async function (v) {
            sensorTypeNames.push(await getSensorTypeName(v));
        });
    } catch (err) {
        console.log(err);
    }

    return sensorTypeNames;
}

async function getSensorTypeName(sensorType) {
    let sensorTypeName = [];

    try {
        //let file = fs.readFileSync("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        let file = fs.readFileSync("C:/Users/kris7/OneDrive/Programming/_ GitHub _/School Projects/P2Project/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("sensorTypeInput", sql.Int, sensorType);

        let queryTable = await request.query("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput");
        queryTable.recordset.forEach(v => sensorTypeName.push(v));
    } catch (err) {
        console.log(err);
    }

    return sensorTypeName;
}