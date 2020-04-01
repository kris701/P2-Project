const sql = require("mssql");
const fs = require("fs");
let basicCalls = require(__dirname + "/BasicCalls.js")

class Sensor {
    constructor(SensorID, Types) {
        this.SensorID = SensorID;
        this.Types = Types;
    }
}

class Room {
    constructor(RoomID, RoomName, Sensors) {
        this.RoomID = RoomID;
        this.RoomName = RoomName;
        this.Sensors = Sensors;
    }
}

module.exports.getSensorInfoQuery = async function () {
    let sensorInfo = [];

    let allRooms = await getAllRooms();
    await basicCalls.asyncForEach(allRooms, async function (v) {
        let sensorsInRoom = await getSensorsInRoom(v.RoomID);
        let RoomInfo = new Room(v.RoomID, v.RoomName, sensorsInRoom);
        sensorInfo.push(RoomInfo);
    });

    return sensorInfo;
}

async function getAllRooms() {
    let rooms = [];
    
    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorRooms]", []);
    queryTable.recordset.forEach(v => rooms.push(v));

    return rooms;
}

async function getSensorsInRoom(room) {
    let sensors = [];

    let queryTable = await basicCalls.MakeQuery("SELECT [SensorID] FROM [SensorInfo] WHERE [RoomID]=@roomInput", [new basicCalls.QueryValue("roomInput", sql.Int, room)]);
    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        let ReturnTypes = await getSensorTypes(v.SensorID);
        sensors.push(new Sensor(v.SensorID, ReturnTypes))
    });

    return sensors;
}

async function getSensorTypes(sensorID) {
    let sensorTypes = [];
    let sensorTypeNames = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorIDInput", [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID)]);

    queryTable.recordset.forEach(v => sensorTypes.push(v.SensorType));

    await basicCalls.asyncForEach(sensorTypes, async function (v) {
        sensorTypeNames.push((await getSensorTypeName(v))[0]);
    });

    return sensorTypeNames;
}

async function getSensorTypeName(sensorType) {
    let sensorTypeName = [];

    let queryTable = await basicCalls.MakeQuery("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput", [new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
    queryTable.recordset.forEach(v => sensorTypeName.push(v.TypeName));

    return sensorTypeName;
}