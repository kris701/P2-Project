//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;
let successCodes = require(__dirname + "/ReturnCodes.js").successCodes;
let RC = require(__dirname + "/ReturnCodes.js");

// Time interval in minutes
const interval = 15;

// How many weeks should we reach back
const weekOffset = 20;
// Hów many hours should we watch forward
const hourReach = 3;

const millisecondsPerDay = 86400000;

// A and B variables for the weight class
const WC_A = -0.01;
const WC_B = 1;

// Minimum Times Exeded Value, if below, the value is removed
const MTEV = 1;

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

        let returnItem = new ReturnClass(interval, []);

        let sensorsInRoom = await QCC.getPredictionSensorsInRoom(room);
        await BCC.asyncForEach(sensorsInRoom, async function (sensorInfo) {
            let sensorsSensorTypes = await QCC.getSensorTypesForSensor(sensorInfo.sensorID);

            await IRVC.insertAllThressholdPassesForSensorType(sensorsSensorTypes, returnItem.data, date);
        });

        for (let i = 0; i < returnItem.data.length; i++) {
            returnItem.data[i] = IVC.avrArrayValues(returnItem.data[i]);
        }

        await ROOBVC.checkAndRemoveOutOfBounds(returnItem.data);

        return new BCC.retMSG(successCodes.GotPredictions, returnItem);
    }
}

//#endregion

//#region Private

// Remove Out of Bounds Values Class
class ROOBVC {
    static async checkAndRemoveOutOfBounds(checkArray) {
        for (let i = 0; i < checkArray.length; i++) {
            ROOBVC.checkAndRemoveTooLow(checkArray[i].thresholdPasses);
        }
    }

    static async checkAndRemoveTooLow(checkArray) {
        for (let i = 0; i < checkArray.length; i++) {
            if (checkArray[i].timesExceeded <= MTEV) {
                checkArray.splice(i, 1);
                i--;
            }
        }
    }
}

// Insert Return Values Class
class IRVC {
    static async insertAllThressholdPassesForSensorType(sensorTypes, insertArray, targetDate) {
        await BCC.asyncForEach(sensorTypes, async function (sensorTypeInfo) {

            let exists = await IRVC.checkIfSensorTypeExistsAndInsert(insertArray, sensorTypeInfo.sensorType, sensorTypeInfo.sensorID, sensorTypeInfo.thresholdValue, targetDate);
            if (!exists) {
                let newName = await QCC.getSensorTypeName(sensorTypeInfo.sensorType);
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

            IVC.insertNewInterval(thresholdPassesArray, newInterval, sensorValue.timestamp, date, thresholdValue, sensorValue.sensorValue);
        });
    }

    static async getPredictionSensorValues(sensorID, sensorType, thresholdValue, date) {
        let result = [];

        let oldestEntry = await QCC.getOldestEntry(sensorType, sensorID);
        oldestEntry.setDate(oldestEntry.getDate() - 1 - Math.ceil(hourReach / 24));

        for (let i = 7; i <= (weekOffset * 7); i += 7) {
            let dateMin = new Date(date);
            let dateMax = new Date(date);

            dateMin.setDate(dateMin.getDate() - i);
            dateMax.setDate(dateMax.getDate() - i);
            dateMax.setHours(dateMax.getHours() + hourReach);

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
        let intervalMinutesLeft = Math.floor(minutesLeft / interval);

        return intervalMinutesLeft;
    }

}

// Insert Value Class
class IVC {

    // Insert interval value, if it exists, increment that value
    static insertNewInterval(insertArray, interval, timestamp, date, thresholdValue, sensorValue) {
        let exist = IVC.doesValueExistAndInsert(insertArray, interval, timestamp, date, thresholdValue, sensorValue);

        if (!exist)
            insertArray = IVC.insertIntoCorrectPositionInArray(interval, insertArray, timestamp, date, thresholdValue, sensorValue);
    }

    // O(n), Omega(1), Theta(n)
    static insertIntoCorrectPositionInArray(newInterval, insertArray, timestamp, date, thresholdValue, sensorValue) {
        let index = 0;
        for (let i = 0; i < insertArray.length; i++) {
            if (insertArray[i].timeUntil > newInterval) {
                break;
            }
            index++;
        }
        let weight = WC.getAgeWeight(timestamp, date) + WC.getValueWeight(sensorValue, thresholdValue);
        insertArray.splice(index, 0, new ThresholdPassClass(newInterval, [weight]));
        return insertArray;
    }

    // O(n), Omega(1), Theta(1)
    static doesValueExistAndInsert(insertArray, newInterval, timestamp, date, thresholdValue, sensorValue) {
        let exist = false;

        for (let i = 0; i < insertArray.length; i++) {
            if (insertArray[i].timeUntil == newInterval) {
                exist = true;
                insertArray[i].timesExceeded.push((WC.getAgeWeight(timestamp, date) + WC.getValueWeight(sensorValue, thresholdValue)));
            }
            if (insertArray[i].timeUntil > newInterval)
                break;
        }
        return exist;
    }

    static avrArrayValues(insertArray) {
        for (let i = 0; i < insertArray.thresholdPasses.length; i++) {
            let newValue = 0;
            for (let j = 0; j < insertArray.thresholdPasses[i].timesExceeded.length; j++) {
                newValue += insertArray.thresholdPasses[i].timesExceeded[j];
            }
            newValue = newValue / insertArray.thresholdPasses[i].timesExceeded.length;
            insertArray.thresholdPasses[i].timesExceeded = newValue;
        }
        return insertArray;
    }
}

// QCC: Query Call Class
class QCC {
    // All the query calls to the database.

    static async getPredictionSensorsInRoom(room) {
        let result = [];

        let ret = await BCC.makeQuery("SELECT * FROM SensorInfo WHERE roomID=?", [room]);
        if (BCC.isErrorCode(ret))
            return result;
        await BCC.asyncForEach(ret.recordset, async function (v) {
            result.push(v);
        });

        return result;
    }

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
            result.push(v);
        });

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
        await BCC.asyncForEach(ret.recordset, async function (v) {
            result.push(v);
        });

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
        let retWeight = WC_A * timeSince + WC_B;
        if (retWeight < 0)
            retWeight = 0;
        return retWeight;
    }

    static getValueWeight(value, thresholdValue) {
        return value / thresholdValue;
    }
}

//#endregion