//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
var successCodes = require(__dirname + "/ReturnCodes.js").successCodes;

class Sensor {
    constructor(sensorID, types) {
        this.sensorID = sensorID;
        this.types = types;
    }
}

class Room {
    constructor(roomID, roomName, sensors) {
        this.roomID = roomID;
        this.roomName = roomName;
        this.sensors = sensors;
    }
}

//#endregion

//#region Public
// SSIC, Simple Sensor Info Class

module.exports.SSIC = class {
    static async getSensorInfoQuery() {
        let sensorInfo = [];

        let allRooms = await getAllRooms();
        await BCC.asyncForEach(allRooms, async function (roomData) {
            let sensorsInRoom = await getSensorsInRoom(roomData.roomID);
            let newRoomInfo = new Room(roomData.roomID, roomData.roomName, sensorsInRoom);
            sensorInfo.push(newRoomInfo);
        });

        return new BCC.retMSG(successCodes.GotSimpleSensorInfo, sensorInfo);;
    }
}
//#endregion

//#region Private

async function getAllRooms() {
    let rooms = [];
    
    let queryTable = await BCC.makeQuery("SELECT * FROM SensorRooms", []);
    if (BCC.isErrorCode(queryTable))
        return rooms;
    queryTable.recordset.forEach(v => rooms.push(v));

    return rooms;
}

async function getSensorsInRoom(room) {
    let sensors = [];

    let queryTable = await BCC.makeQuery("SELECT sensorID FROM SensorInfo WHERE roomID=?", [room]);
    if (BCC.isErrorCode(queryTable))
        return sensors;

    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let sensorTypes = await getSensorTypes(v.sensorID);
        sensors.push(new Sensor(v.sensorID, sensorTypes))
    });

    return sensors;
}

async function getSensorTypes(sensorID) {
    let sensorTypes = [];
    let sensorTypeNames = [];

    let queryTable = await BCC.makeQuery("SELECT * FROM SensorThresholds WHERE sensorID=?", [sensorID]);
    if (BCC.isErrorCode(queryTable))
        return sensorTypeNames;

    queryTable.recordset.forEach(v => sensorTypes.push(v.sensorType));

    await BCC.asyncForEach(sensorTypes, async function (v) {
        sensorTypeNames.push((await getSensorTypeName(v)));
    });

    return sensorTypeNames;
}

async function getSensorTypeName(sensorType) {
    let sensorTypeName;

    let queryTable = await BCC.makeQuery("SELECT typeName FROM SensorTypes WHERE sensorType=?", [sensorType]);
    if (BCC.isErrorCode(queryTable))
        return sensorTypeName;
    sensorTypeName = queryTable.recordset[0].typeName;

    return sensorTypeName;
}

//#endregion