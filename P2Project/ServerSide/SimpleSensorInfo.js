//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;

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

        return new BCC.retMSG(200, sensorInfo);;
    }
}
//#endregion

//#region Private

async function getAllRooms() {
    let rooms = [];
    
    let queryTable = await BCC.makeQuery("SELECT * FROM SensorRooms", []);
    queryTable.recordset.forEach(v => rooms.push(v));

    return rooms;
}

async function getSensorsInRoom(room) {
    let sensors = [];

    let queryTable = await BCC.makeQuery("SELECT SensorID FROM SensorInfo WHERE RoomID=?", [room]);
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let sensorTypes = await getSensorTypes(v.sensorID);
        sensors.push(new Sensor(v.sensorID, sensorTypes))
    });

    return sensors;
}

async function getSensorTypes(sensorID) {
    let sensorTypes = [];
    let sensorTypeNames = [];

    let queryTable = await BCC.makeQuery("SELECT * FROM SensorThresholds WHERE SensorID=?", [sensorID]);

    queryTable.recordset.forEach(v => sensorTypes.push(v.SensorType));

    await BCC.asyncForEach(sensorTypes, async function (v) {
        sensorTypeNames.push((await getSensorTypeName(v))[0]);
    });

    return sensorTypeNames;
}

async function getSensorTypeName(sensorType) {
    let sensorTypeName = [];

    let queryTable = await BCC.makeQuery("SELECT TypeName FROM SensorTypes WHERE SensorType=?", [sensorType]);
    queryTable.recordset.forEach(v => sensorTypeName.push(v.typeName));

    return sensorTypeName;
}

//#endregion