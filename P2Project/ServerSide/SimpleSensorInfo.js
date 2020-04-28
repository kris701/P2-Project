//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
var RC = require(__dirname + "/ReturnCodes.js");

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
            if (roomData.roomID != -1) {
                let sensorsInRoom = await getSensorsInRoom(roomData.roomID);
                let newRoomInfo = new Room(roomData.roomID, roomData.roomName, sensorsInRoom);
                sensorInfo.push(newRoomInfo);
            }
        });

        return new BCC.retMSG(RC.successCodes.GotSimpleSensorInfo, sensorInfo);;
    }
}
//#endregion

//#region Private

async function getAllRooms() {

    let queryTable = await BCC.makeQuery("SELECT * FROM SensorRooms", []);
    if (BCC.isErrorCode(queryTable))
        return [];

    let rooms = await BCC.pushItem(queryTable.recordset);
    return rooms;
}

async function getSensorsInRoom(room) {
    let queryTable = await BCC.makeQuery("SELECT sensorID FROM SensorInfo WHERE roomID=?", [room]);
    if (BCC.isErrorCode(queryTable))
        return [];

    let sensors = [];

    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let sensorTypes = await getSensorTypes(v.sensorID);
        sensors.push(new Sensor(v.sensorID, sensorTypes))
    });

    return sensors;
}

async function getSensorTypes(sensorID) {
    let queryTable = await BCC.makeQuery("SELECT * FROM SensorThresholds WHERE sensorID=?", [sensorID]);
    if (BCC.isErrorCode(queryTable))
        return [];

    let sensorTypes = [];
    let sensorTypeNames = [];

    queryTable.recordset.forEach(v => sensorTypes.push(v.sensorType));

    await BCC.asyncForEach(sensorTypes, async function (v) {
        sensorTypeNames.push((await BCC.getSensorTypeName(v)));
    });

    return sensorTypeNames;
}

//#endregion
