//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let RC = require(__dirname + "/ReturnCodes.js");
let cfg = require(__dirname + "/ConfigLoading.js").configuration;

const millisecondsPerDay = 86400000;

class ReturnClass {
    constructor(interval, data) {
        this.interval = interval;
        this.data = data;
    }
}
class SensorTypeClass {
    constructor(sensorType, name, thresholdPasses) {
        this.sensorType = sensorType;
        this.name = name;
        this.thresholdPasses = thresholdPasses;
    }
}
class ThresholdPassClass {
    constructor(timeUntil, timesExceeded) {
        this.timeUntil = timeUntil;
        this.timesExceeded = timesExceeded;
    }
}

//#endregion

//#region Public
// Prediction Algorithm Class

module.exports.PAC = class {
    static async getPredictionDatetimeQuery(room, date) {
        if (room == null || date == null)
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (parseInt(room,10)) != typeof(0))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (date) != typeof (""))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);

        cfg = require(__dirname + "/ConfigLoading.js").configuration;

        let returnItem = new ReturnClass(parseInt(cfg.PAC_interval, 10), []);

        let sensorsInRoom = await QCC.getPredictionSensorsInRoom(room);
        await BCC.asyncForEach(sensorsInRoom, async function (sensorInfo) {
            let sensorsSensorTypes = await QCC.getSensorTypesForSensor(sensorInfo.sensorID);

            await IRVC.insertAllThressholdPassesForSensorType(sensorsSensorTypes, returnItem.data, date);
        });

        returnItem.data = IRVC.convertTimestampArrayToProbability(returnItem.data, date);

        return new BCC.retMSG(RC.successCodes.GotPredictions, returnItem);
    }
}

//#endregion

//#region Private

// Insert Return Values Class
class IRVC {
    static async insertAllThressholdPassesForSensorType(sensorTypes, insertArray, targetDate) {
        await BCC.asyncForEach(sensorTypes, async function (sensorTypeInfo) {

            let exists = await IRVC.checkIfSensorTypeExistsAndInsert(insertArray, sensorTypeInfo.sensorType, sensorTypeInfo.sensorID, sensorTypeInfo.thresholdValue, targetDate);
            if (!exists) {
                let newName = await BCC.getSensorTypeName(sensorTypeInfo.sensorType);
                let newReturnValue = new SensorTypeClass(sensorTypeInfo.sensorType, newName, []);
                await IRVC.checkForThresholdPass(sensorTypeInfo.sensorID, newName, sensorTypeInfo.thresholdValue, newReturnValue.thresholdPasses, targetDate)
                insertArray.push(newReturnValue);
            }
        });
    }

    static async checkIfSensorTypeExistsAndInsert(searchArray, sensorType, sensorID, thresholdValue, date) {
        let doesExist = false;

        await BCC.asyncForEach(searchArray, async function (searchArrayItem) {
            if (searchArrayItem.sensorType == sensorType) {
                await IRVC.checkForThresholdPass(sensorID, searchArrayItem.name, thresholdValue, searchArrayItem.thresholdPasses, date);
                doesExist = true;
            }
        });

        return doesExist;
    }

    static async checkForThresholdPass(sensorID, sensorType, thresholdValue, thresholdPassesArray, date) {
        let sensorValuesArray = await IRVC.getPredictionSensorValues(sensorID, sensorType, thresholdValue, date);

        await BCC.asyncForEach(sensorValuesArray, async function (sensorValue) {
            let newInterval = BCC.timeDiffToInterval(sensorValue.timestamp, date, parseInt(cfg.PAC_interval, 10), true);

            IVC.insertNewInterval(thresholdPassesArray, newInterval, sensorValue.timestamp);
        });
    }

    static async getPredictionSensorValues(sensorID, sensorType, thresholdValue, date) {
        let result = [];

        let dateMin = new Date(date);
        let dateMax = new Date(date);
        let weekOffset = new Date(date);
        dateMax.setHours(dateMax.getHours() + parseInt(cfg.PAC_hourReach, 10));
        weekOffset.setDate(weekOffset.getDate() - parseInt(cfg.PAC_weekOffset, 10) * 7);
        result = await QCC.getPredictionSensorValues(sensorID, dateMin, dateMax, sensorType, thresholdValue, weekOffset);

        return result;
    }

    // TimesExceeded are now populated with timestamps of when the threshold was exceeded.
    static convertTimestampArrayToProbability(data, date) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].thresholdPasses.length; j++) {
                let sum = 0;
                for (let l = 0; l < data[i].thresholdPasses[j].timesExceeded.length; l++) {
                    sum += WC.getAgeWeight(data[i].thresholdPasses[j].timesExceeded[l].date, date);
                }
                data[i].thresholdPasses[j].timesExceeded = Math.floor(sum / parseInt(cfg.PAC_weekOffset, 10) * 100);
            }
        }
        return data;
    }
}

// Insert Value Class
class IVC {

    // Insert interval value, if it exists, increment that value
    static insertNewInterval(insertArray, interval, timestamp) {
        let exist = IVC.doesValueExistAndInsert(insertArray, interval, timestamp);

        if (!exist)
            insertArray = IVC.insertIntoCorrectPositionInArray(interval, insertArray, timestamp);
    }

    static insertIntoCorrectPositionInArray(newInterval, insertArray, timestamp) {
        let index = 0;
        for (let i = 0; i < insertArray.length; i++) {
            if (insertArray[i].timeUntil > newInterval) {
                break;
            }
            index++;
        }
        insertArray.splice(index, 0, new ThresholdPassClass(newInterval, [{ date: timestamp }]));
        return insertArray;
    }

    static doesValueExistAndInsert(insertArray, newInterval, timestamp) {
        let exist = false;

        for (let i = 0; i < insertArray.length; i++) {
            if (insertArray[i].timeUntil == newInterval) {
                exist = true;
                let otherSensorSetValue = false
                for (let j = 0; j < insertArray[i].timesExceeded.length; j++) {
                    if (timestamp.getDate() == insertArray[i].timesExceeded[j].date.getDate()) {
                        otherSensorSetValue = true;
                        break;
                    }
                }
                if (!otherSensorSetValue)
                    insertArray[i].timesExceeded.push({ date: timestamp });
            }
            if (insertArray[i].timeUntil > newInterval)
                break;
        }
        return exist;
    }
}

// QCC: Query Call Class
class QCC {
    // All the query calls to the database.

    static async getPredictionSensorsInRoom(room) {
        let ret = await BCC.makeQuery("SELECT * FROM SensorInfo WHERE roomID=?", [room]);
        if (BCC.isErrorCode(ret))
            return [];

        let result = await BCC.pushItem(ret.recordset);
        return result;
    }

    static async getSensorTypesForSensor(sensorID) {
        let ret = await BCC.makeQuery("SELECT * FROM SensorThresholds WHERE sensorID=?", [sensorID]);
        if (BCC.isErrorCode(ret))
            return [];

        let result = await BCC.pushItem(ret.recordset);
        return result;
    }

    static async getPredictionSensorValues(sensorID, dateMin, dateMax, sensorType, thresholdValue, weekReach) {
        let ret;
        if (dateMin.getHours() > dateMax.getHours()) {
            ret = await BCC.makeQuery(
                "SELECT * FROM SensorValue_" + sensorType + " WHERE " +
                "(sensorID=? AND TIME_TO_SEC(TIME(timestamp)) >= ? AND sensorValue>=? AND timestamp >= ? AND timestamp <= ? AND WEEKDAY(timestamp) = ?) OR " +
                "(sensorID=? AND TIME_TO_SEC(TIME(timestamp)) <= ? AND sensorValue>=? AND timestamp >= ? AND timestamp <= ? AND WEEKDAY(timestamp) = ?)", [
                sensorID,
                QCC.getSecondsOfDay(dateMin),
                thresholdValue,
                weekReach,
                dateMin,
                QCC.jsDayToMySQLDay(dateMin.getDay()),

                sensorID,
                QCC.getSecondsOfDay(dateMax),
                thresholdValue,
                weekReach,
                dateMin,
                QCC.jsDayToMySQLDay(dateMin.getDay() + 1),
            ]);
        }
        else {
            ret = await BCC.makeQuery(
                "SELECT * FROM SensorValue_" + sensorType + " WHERE sensorID=? AND TIME_TO_SEC(TIME(timestamp)) >= ? AND TIME_TO_SEC(TIME(timestamp)) <= ? AND sensorValue>=? AND timestamp >= ? AND timestamp <= ? AND WEEKDAY(timestamp) = ?", [
                sensorID,
                QCC.getSecondsOfDay(dateMin),
                QCC.getSecondsOfDay(dateMax),
                thresholdValue,
                weekReach,
                dateMin,
                QCC.jsDayToMySQLDay(dateMin.getDay()),
            ]);
        }
        if (BCC.isErrorCode(ret))
            return new Date();

        let result = [];
        result = await BCC.pushItem(ret.recordset, result);
        return result;
    }

    static jsDayToMySQLDay(jsDay) {
        if (jsDay == 0)
            jsDay = 7;
        else {
            if (jsDay == 6)
                jsDay = 7;
            else
                jsDay -= 1;
        }
        return jsDay;
    }

    static getSecondsOfDay(datetime) {
        return datetime.getSeconds() + (60 * datetime.getMinutes()) + (60 * 60 * datetime.getHours());
    }
}

// WC: Weight class
class WC {
    static getAgeWeight(timestamp, date) {
        let daysSince = WC.getDaysSince(timestamp, date);
        let weight = WC.weightConverter(daysSince);
        return weight;
    }

    static getDaysSince(timestamp, date) {
        let timestampDate = new Date(timestamp);
        let senderDate = new Date(date);
        return ((senderDate.getTime() - timestampDate.getTime()) / millisecondsPerDay);
    }

    static weightConverter(timeSince) {
        let retWeight = parseFloat(cfg.PAC_WC_A) * timeSince + parseFloat(cfg.PAC_WC_B);
        if (retWeight < 0)
            retWeight = 0;
        return retWeight;
    }
}

//#endregion
