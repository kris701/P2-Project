//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let RC = require(__dirname + "/ReturnCodes.js");
let cfg = require(__dirname + "/ConfigLoading.js").configuration;

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

//#endregion

//#region Public
// Live Data Class

module.exports.LDC = class {
    static async getLiveData(sensorID, date) {
        if (sensorID == null || date == null)
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (parseInt(sensorID, 10)) != typeof (0))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (date) != typeof (""))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);

        cfg = require(__dirname + "/ConfigLoading.js").configuration;

        let returnItem = new ReturnClass(parseInt(cfg.LDC_interval, 10), [], sensorID);

        let sensorsSensorTypes = await QCC.getSensorTypesForSensor(sensorID);

        await BCC.asyncForEach(sensorsSensorTypes, async function (sensorTypeInfo) {
            let sensorTypeName = await BCC.getSensorTypeName(sensorTypeInfo);
            let sensorValues = await getHistoricData(sensorID, date, sensorTypeName);
            returnItem.data.push(new LiveSensorClass(sensorTypeName, sensorValues));
        });

        return new BCC.retMSG(RC.successCodes.GotLiveData, returnItem);
    }
}

//#endregion

//#region Private

async function getHistoricData(sensorID, date, sensorTypeName) {
    let result = [];

    for (let i = 0; i < parseInt(cfg.LDC_backReachHours, 10) * (60 / parseInt(cfg.LDC_interval, 10)); i++) {
        let dateMin = new Date(date);
        let dateMax = new Date(date);
        dateMax.setMinutes(dateMin.getMinutes() - ((i + 1) * parseInt(cfg.LDC_interval, 10)));
        dateMin.setMinutes(dateMax.getMinutes() - (i * parseInt(cfg.LDC_interval, 10)));

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
