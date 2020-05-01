//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let RC = require(__dirname + "/ReturnCodes.js");
let cfg = require(__dirname + "/ConfigLoading.js").configuration;

class ReturnClass {
    constructor(interval, data) {
        this.interval = interval;
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
    constructor(sensorID, sensorThreshold, sensorLiveData) {
        this.sensorID = sensorID;
        this.sensorThreshold = sensorThreshold;
        this.sensorLiveData = sensorLiveData;
    }
}
class SensorValuesClass {
    constructor(timeStamp, sensorValue) {
        this.timeStamp = timeStamp;
        this.sensorValue = sensorValue;
    }
}

//#endregion

//#region Public
// Live Data Class

module.exports.LDC = class {
    static async getLiveData(roomID, date) {
        if (roomID == null || date == null)
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (parseInt(roomID, 10)) != typeof (0))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (date) != typeof (""))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);

        cfg = require(__dirname + "/ConfigLoading.js").configuration;

        let returnItem = new ReturnClass(parseInt(cfg.LDC_interval, 10), []);

        let sensorsInRoom = await QCC.getSensorsInRoom(roomID);
        await BCC.asyncForEach(sensorsInRoom, async function (sensorInfo) {
            let sensorsSensorTypes = await QCC.getSensorTypesForSensor(sensorInfo.sensorID);

            await BCC.asyncForEach(sensorsSensorTypes, async function (sensorTypeInfo) {
                let sensorTypeName = await BCC.getSensorTypeName(sensorTypeInfo.sensorType);
                let sensorValues = await getHistoricData(sensorInfo.sensorID, date, sensorTypeName);
                returnItem.data = await insertValuesIntoArray(returnItem.data, sensorTypeName, sensorValues, sensorInfo.sensorID, sensorTypeInfo.thresholdValue);
            });
        });

        return new BCC.retMSG(RC.successCodes.GotLiveData, returnItem);
    }
}

//#endregion

//#region Private

async function insertValuesIntoArray(dataArray, insertTypeName, sensorValues, sensorID, sensorThreshold) {
    let isThere = await insertIfExistsAndInsert(dataArray, insertTypeName, sensorValues, sensorID, sensorThreshold);
    if (!isThere) {
        dataArray.push(new LiveSensorClass(insertTypeName, [new LiveSensorValuesClass(sensorID, sensorThreshold, sensorValues) ]));
    }
    return dataArray;
}

async function insertIfExistsAndInsert(dataArray, insertTypeName, sensorValues, sensorID, sensorThreshold) {
    let isThere = false;
    await BCC.asyncForEach(dataArray, async function (typeArray) {
        if (typeArray.sensorType == insertTypeName) {
            isThere = true;
            typeArray.liveDataArray.push(new LiveSensorValuesClass(sensorID, sensorThreshold, sensorValues));
        }
    });
    return isThere;
}

async function getHistoricData(sensorID, date, sensorTypeName) {
    let result = [];

    let dateMin = new Date(date);
    let dateMax = new Date(date);
    dateMin.setHours(dateMin.getHours() - parseInt(cfg.LDC_backReachHours, 10));

    result = await QCC.getValueWithingTimestamps(result, sensorTypeName, sensorID, dateMax, dateMin);

    for (let i = 0; i < result.length; i++)
        result[i].timeStamp = BCC.timeDiffToInterval(date, result[i].timeStamp, parseInt(cfg.LDC_interval, 10), true);

    result = stitchData(result);

    return result;
}

async function stitchData(data) {
    for (let i = 0; i < data.length; i++) {
        let count = 1;
        for (let j = i + 1; j < data.length; j++) {
            if (data[i].timeStamp < data[j].timeStamp)
                break;
            if (data[i].timeStamp == data[j].timeStamp) {
                data[i].sensorValue += data[j].sensorValue;
                data.splice(j,1);
                count++;
                j--;
            }
        }
        data[i].sensorValue = Math.floor(data[i].sensorValue / count);
    }
    return data;
}

// QCC: Query Call Class
class QCC {
    // All the query calls to the database.

    static async getSensorTypesForSensor(sensorID) {
        let ret = await BCC.makeQuery("SELECT * FROM SensorThresholds WHERE sensorID=?", [sensorID]);
        if (BCC.isErrorCode(ret))
            return [];
        let result = await BCC.pushItem(ret.recordset);

        return result;
    }

    static async getSensorsInRoom(room) {
        let ret = await BCC.makeQuery("SELECT * FROM SensorInfo WHERE roomID=?", [room]);
        if (BCC.isErrorCode(ret))
            return [];

        let result = await BCC.pushItem(ret.recordset);
        return result;
    }

    static async getValueWithingTimestamps(result, sensorTypeName, sensorID, dateMax, dateMin) {
        let ret = await BCC.makeQuery(
            "SELECT * FROM SensorValue_" + sensorTypeName + " WHERE sensorID=? AND timestamp BETWEEN ? AND ?", [
            sensorID,
            dateMin,
            dateMax
        ]);
        if (BCC.isErrorCode(ret))
            return result;

        await BCC.asyncForEach(ret.recordset, async function (v) {
            result.push(new SensorValuesClass(v.timestamp, v.sensorValue));
        });

        return result;
    }
}

//#endregion
