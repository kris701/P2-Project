//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;
let successCodes = require(__dirname + "/ReturnCodes.js").successCodes;
let RC = require(__dirname + "/ReturnCodes.js");

class ReturnClass {
    constructor(interval, data, sensorID) {
        this.interval = interval;
        this.sensorID = sensorID;
        this.data = data;
    }
}
class LiveSensorClass {
    constructor(sensorType, liveDataArray) {
        this.sensorType = sensorType;
        this.liveDataArray = liveDataArray;
    }
}
class LiveSensorValuesClass {
    constructor(timeStamp, sensorValue) {
        this.timeStamp = timeStamp;
        this.sensorValue = sensorValue;
    }
}

const backReachHours = 2;
const interval = 15;

//#endregion

//#region Public
// Live Data Class

module.exports.LDC = class {
    static async getLiveData(sensorID, date) {
        if (sensorID == null || date == null)
            return RC.parseToRetMSG(failCodes.NoParameters);
        if (typeof (parseInt(sensorID, 10)) != typeof (0))
            return RC.parseToRetMSG(failCodes.NoParameters);
        if (typeof (date) != typeof (""))
            return RC.parseToRetMSG(failCodes.NoParameters);

        let returnItem = new ReturnClass(interval, [], sensorID);

        let sensorsSensorTypes = await QCC.getSensorTypesForSensor(sensorID);

        await BCC.asyncForEach(sensorsSensorTypes, async function (sensorTypeInfo) {
            let sensorTypeName = await QCC.getSensorTypeName(sensorTypeInfo);
            let sensorValues = await getHistoricData(sensorID, date, sensorTypeName);
            returnItem.data.push(new LiveSensorClass(sensorTypeName, sensorValues));
        });

        return new BCC.retMSG(successCodes.GotLiveData, returnItem);
    }
}

//#endregion

//#region Private

async function getHistoricData(sensorID, date, sensorTypeName) {
    let result = [];

    for (let i = 0; i < backReachHours * (60 / interval); i++) {
        let dateMin = new Date(date);
        let dateMax = new Date(date);
        dateMax.setMinutes(dateMin.getMinutes() - ((i + 1) * interval));
        dateMin.setMinutes(dateMax.getMinutes() - (i * interval));

        result = await getValueWithingTimestamps(result, sensorTypeName, sensorID, dateMax, dateMin, i);
    }

    return result;
}

async function getValueWithingTimestamps(result, sensorTypeName, sensorID, dateMax, dateMin, intervalsback) {
    let ret = await BCC.makeQuery(
        "SELECT * FROM SensorValue_" + sensorTypeName + " WHERE sensorID=? AND timestamp BETWEEN ? AND ?", [
        sensorID,
        dateMax,
        dateMin
    ]);
    if (BCC.isErrorCode(ret))
        return result;

    if (ret.recordset.length > 0)
        result.push(new LiveSensorValuesClass(intervalsback, ret.recordset[0].sensorValue));

    return result;
}

// QCC: Query Call Class
class QCC {
    // All the query calls to the database.

    static async getSensorTypeName(sensorTypeID) {
        let result;

        let ret = await BCC.makeQuery("SELECT * FROM SensorTypes WHERE sensorType=?", [sensorTypeID]);
        if (BCC.isErrorCode(ret))
            return result;
        result = ret.recordset[0].typeName;

        return result;
    }

    static async getSensorTypesForSensor(sensorID) {
        let result = [];

        let ret = await BCC.makeQuery("SELECT * FROM SensorThresholds WHERE sensorID=?", [sensorID]);
        if (BCC.isErrorCode(ret))
            return result;
        await BCC.asyncForEach(ret.recordset, async function (v) {
            result.push(v.sensorType);
        });

        return result;
    }
}

//#endregion