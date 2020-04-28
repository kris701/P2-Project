//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;
let successCodes = require(__dirname + "/ReturnCodes.js").successCodes;
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
            return RC.parseToRetMSG(failCodes.NoParameters);
        if (typeof (parseInt(room,10)) != typeof(0))
            return RC.parseToRetMSG(failCodes.NoParameters);
        if (typeof (date) != typeof (""))
            return RC.parseToRetMSG(failCodes.NoParameters);

        cfg = require(__dirname + "/ConfigLoading.js").configuration;

        let returnItem = new ReturnClass(parseInt(cfg.PAC_interval, 10), []);

        let sensorsInRoom = await QCC.getPredictionSensorsInRoom(room);
        await BCC.asyncForEach(sensorsInRoom, async function (sensorInfo) {
            let sensorsSensorTypes = await QCC.getSensorTypesForSensor(sensorInfo.sensorID);

            await IRVC.insertAllThressholdPassesForSensorType(sensorsSensorTypes, returnItem.data, date);
        });

        returnItem.data = IRVC.convertTimestampArrayToProbability(returnItem.data, date);

        return new BCC.retMSG(successCodes.GotPredictions, returnItem);
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
            let newInterval = IRVC.timeDiffToInterval(sensorValue.timestamp, date);

            IVC.insertNewInterval(thresholdPassesArray, newInterval, sensorValue.timestamp);
        });
    }

    static async getPredictionSensorValues(sensorID, sensorType, thresholdValue, date) {
        let result = [];

        let oldestEntry = await QCC.getOldestEntry(sensorType, sensorID);
        oldestEntry.setDate(oldestEntry.getDate() - 1 - Math.ceil(parseInt(cfg.PAC_hourReach, 10) / 24));

        let weekLook = (parseInt(cfg.PAC_weekOffset, 10) * 7);
        for (let i = 7; i <= weekLook; i += 7) {
            let dateMin = new Date(date);
            let dateMax = new Date(date);

            dateMin.setDate(dateMin.getDate() - i);
            dateMax.setDate(dateMax.getDate() - i);
            dateMax.setHours(dateMax.getHours() + parseInt(cfg.PAC_hourReach, 10));

            if (dateMin < oldestEntry)
                break;

            result = await QCC.getPredictionSensorValues(result, sensorID, dateMin, dateMax, sensorType, thresholdValue);
        }

        return result;
    }

    static timeDiffToInterval(timestamp, senderdate) {
        let date = new Date(timestamp);
        let CurrentDate = new Date(senderdate);
        date.setDate(CurrentDate.getDate());
        date.setMonth(CurrentDate.getMonth());

        if (date < CurrentDate) {
            date.setDate(date.getDate() + 1);
        }

        let millisecondsLeft = (date.getTime() - CurrentDate.getTime());
        let secondsLeft = Math.floor(millisecondsLeft / 1000);
        let minutesLeft = Math.floor(secondsLeft / 60);
        let intervalMinutesLeft = Math.floor(minutesLeft / parseInt(cfg.PAC_interval, 10));

        return intervalMinutesLeft;
    }

    // TimesExceeded are now populated with timestamps of when the threshold was exceeded.
    static convertTimestampArrayToProbability(data, date) {
        //for (let i = 0; i < data.length; i++) {
        //    for (let j = 0; j < data[i].thresholdPasses.length; j++) {
        //        data[i].thresholdPasses[j].timesExceeded = (data[i].thresholdPasses[j].timesExceeded.length / parseInt(cfg.PAC_weekOffset, 10)) * 100;
        //    }
        //}
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].thresholdPasses.length; j++) {
                let sum = 0;
                for (let l = 0; l < data[i].thresholdPasses[j].timesExceeded.length; l++) {
                    sum += WC.getAgeWeight(data[i].thresholdPasses[j].timesExceeded[l].date, date);
                }
                data[i].thresholdPasses[j].timesExceeded = BCC.roundToDigit(sum / parseInt(cfg.PAC_weekOffset, 10)) * 100;
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


    static async getOldestEntry(sensorType, sensorID) {
        let ret = await BCC.makeQuery(
            "SELECT * FROM SensorValue_" + sensorType + " WHERE sensorID=? ORDER By timestamp ASC LIMIT 1", [sensorID]);
        if (BCC.isErrorCode(ret))
            return new Date();

        if (ret.recordset.length >= 1) {
            return new Date(ret.recordset[0].timestamp);
        }
        else
            return new Date();
    }

    static async getPredictionSensorValues(result, sensorID, dateMin, dateMax, sensorType, thresholdValue) {
        let ret = await BCC.makeQuery(
            "SELECT * FROM SensorValue_" + sensorType + " WHERE sensorID=? AND timestamp BETWEEN ? AND ? AND sensorValue>=?", [
            sensorID,
            dateMin,
            dateMax,
            thresholdValue
        ]);
        if (BCC.isErrorCode(ret))
            return new Date();

        result = await BCC.pushItem(ret.recordset, result);
        return result;
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