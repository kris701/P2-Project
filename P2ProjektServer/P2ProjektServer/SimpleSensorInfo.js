const sql = require("mssql");
const fs = require("fs");
let basicCalls = require(__dirname + "/BasicCalls.js")

module.exports.getSensorInfoQuery = async function () {
    let sensorInfo = [];

    try {
        let allRooms = await getAllRooms();
        await basicCalls.asyncForEach(allRooms, async function (v) {
            let sensorsInRoom = await getSensorsInRoom(v.RoomID);
            let RoomSensorsArray = [];
            let RoomSensors = [];

            await basicCalls.asyncForEach(sensorsInRoom, async function (v2) {
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

async function getAllRooms() {
    let rooms = [];
    
    try {
        let file = fs.readFileSync(__dirname + "/Config.json");
        
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
        let file = fs.readFileSync(__dirname + "/Config.json");
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
        let file = fs.readFileSync(__dirname + "/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = await request.query("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorIDInput");
        queryTable.recordset.forEach(v => sensorTypes.push(v.SensorType));

        await basicCalls.asyncForEach(sensorTypes, async function (v) {
            sensorTypeNames.push((await getSensorTypeName(v))[0]);
        });
    } catch (err) {
        console.log(err);
    }

    return sensorTypeNames;
}

async function getSensorTypeName(sensorType) {
    let sensorTypeName = [];

    try {
        let file = fs.readFileSync(__dirname + "/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();
        request.input("sensorTypeInput", sql.Int, sensorType);

        let queryTable = await request.query("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput");
        queryTable.recordset.forEach(v => sensorTypeName.push(v.TypeName));
    } catch (err) {
        console.log(err);
    }

    return sensorTypeName;
}