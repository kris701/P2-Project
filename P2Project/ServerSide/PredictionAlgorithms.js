/*
    =========================
            Header
    =========================
*/

const sql = require("mssql");
let BCC = require(__dirname + "/BasicCalls.js").BCC;
let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;

// Time interval in minutes
const Interval = 15;

// How many weeks should we reach back
const WeekOffset = 20;
// Hów many hours should we watch forward
const HourReach = 3;

const millisecondsPerDay = 86400000;

// A and B variables for the weight class
const WC_A = -0.01;
const WC_B = 1;

// Minimum Times Exeded Value, if below, the value is removed
const MTEV = 0.5;

class ReturnClass {
    constructor(Interval, Data) {
        this.Interval = Interval;
        this.Data = Data;
    }
}
class SensorType {
    constructor(SensorType, Name, ThresholdPasses) {
        this.SensorType = SensorType;
        this.Name = Name;
        this.ThresholdPasses = ThresholdPasses;
    }
}
class ThresholdPass {
    constructor(TimeUntil, TimesExceeded) {
        this.TimeUntil = TimeUntil;
        this.TimesExceeded = TimesExceeded;
    }
}

/*
    =========================
            Code Part
    =========================
*/
// Public Area
// Prediction Algorithm Class

module.exports.PAC = class {
    static async getPredictionDatetimeQuery(room, date) {
        if (room == null)
            return failCodes.NoParameters;
        if (date == null)
            return failCodes.NoParameters;

        let ReturnItem = new ReturnClass(Interval, []);

        let sensorsInRoom = await QCC.getPredictionSensorsInRoom(room);
        await BCC.asyncForEach(sensorsInRoom, async function (SensorInfo) {
            let SensorSensorTypes = await QCC.getSensorTypesForSensor(SensorInfo.SensorID);

            await IRVC.insertAllThressholdPassesForSensorType(SensorSensorTypes, ReturnItem.Data, date);
        });
        await ROOBVC.checkAndRemoveOutOfBounds(ReturnItem.Data);

        return ReturnItem;
    }
}

// Private Area

// Remove Out of Bounds Values Class
class ROOBVC {
    static async checkAndRemoveOutOfBounds(CheckArray) {
        for (let i = 0; i < CheckArray.length; i++) {
            ROOBVC.checkAndRemoveTooLow(CheckArray[i].ThresholdPasses);
        }
    }

    static async checkAndRemoveTooLow(CheckArray) {
        for (let i = 0; i < CheckArray.length; i++) {
            if (CheckArray[i].TimesExceeded <= MTEV) {
                CheckArray.splice(i, 1);
                i--;
            }
        }
    }
}

// Insert Return Values Class
class IRVC {
    static async insertAllThressholdPassesForSensorType(SensorTypes, InsertArray, TargetDate) {
        await BCC.asyncForEach(SensorTypes, async function (SensorTypeInfo) {

            let Exists = await IRVC.CheckIfSensorTypeExistsAndInsert(InsertArray, SensorTypeInfo.SensorType, SensorTypeInfo.SensorID, SensorTypeInfo.ThresholdValue, TargetDate);
            if (!Exists) {
                let NewName = await QCC.getSensorTypeName(SensorTypeInfo.SensorType);
                let NewReturnValue = new SensorType(SensorTypeInfo.SensorType, NewName, []);
                await IRVC.CheckForThresholdPass(SensorTypeInfo.SensorID, NewName, SensorTypeInfo.ThresholdValue, NewReturnValue.ThresholdPasses, TargetDate)
                InsertArray.push(NewReturnValue);
            }
        });
    }

    static async CheckIfSensorTypeExistsAndInsert(SearchArray, SensorType, SensorID, ThresholdValue, date) {
        let doesExist = false;

        await BCC.asyncForEach(SearchArray, async function (SearchArrayItem) {
            if (SearchArrayItem.SensorType == SensorType) {
                await IRVC.CheckForThresholdPass(SensorID, SearchArrayItem.Name, ThresholdValue, SearchArrayItem.ThresholdPasses, date);
                doesExist = true;
            }
        });

        return doesExist;
    }

    static async CheckForThresholdPass(SensorID, SensorType, ThresholdValue, ThresholdPassesArray, date) {
        let SensorValues = await IRVC.getPredictionSensorValues(SensorID, SensorType, ThresholdValue, date);

        await BCC.asyncForEach(SensorValues, async function (SensorValue) {
            let NewInterval = IRVC.TimeDiffToInterval(SensorValue.Timestamp, date);

            IVC.InsertNewInterval(ThresholdPassesArray, NewInterval, SensorValue.Timestamp, date);
        });
    }

    static async getPredictionSensorValues(sensorID, sensorType, ThresholdValue, date) {
        let result = [];

        let OldestEntry = await QCC.GetOldestEntry(sensorType, sensorID);
        OldestEntry.setDate(OldestEntry.getDate() - 1 - Math.ceil(HourReach / 24));

        for (let i = 7; i <= (WeekOffset * 7); i += 7) {
            let dateMin = new Date(date);
            let dateMax = new Date(date);

            dateMin.setDate(dateMin.getDate() - i);
            dateMax.setDate(dateMax.getDate() - i);
            dateMax.setHours(dateMax.getHours() + HourReach);

            if (dateMin < OldestEntry)
                break;

            result = await QCC.getPredictionSensorValues(result, sensorID, dateMin, dateMax, sensorType, ThresholdValue);
        }

        return result;
    }

    static TimeDiffToInterval(timestamp, senderdate) {
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
        let IntervalMinutesLeft = Math.floor(minutesLeft / Interval);

        return IntervalMinutesLeft;
    }

}

// Insert Value Class
class IVC {

    // Insert interval value, if it exists, increment that value
    static async InsertNewInterval(InsertArray, Interval, timestamp, date) {
        let Exist = await IVC.DoesValueExistAndInsert(InsertArray, Interval, timestamp, date);

        if (!Exist)
            InsertArray = await IVC.InsertIntoCorrectPositionInArray(Interval, InsertArray, timestamp, date);
    }

    // O(n), Omega(1), Theta(n)
    static async InsertIntoCorrectPositionInArray(NewInterval, InsertArray, timestamp, date) {
        let Index = 0;
        for (let i = 0; i < InsertArray.length; i++) {
            if (InsertArray[i].TimeUntil > NewInterval) {
                break;
            }
            Index++;
        }
        let weight = WC.getWeight(timestamp, date);
        InsertArray.splice(Index, 0, new ThresholdPass(NewInterval, weight));
        return InsertArray;
    }

    // O(n), Omega(1), Theta(1)
    static async DoesValueExistAndInsert(InsertArray, NewInterval, timestamp, date) {
        let Exist = false;

        for (let i = 0; i < InsertArray.length; i++) {
            if (InsertArray[i].TimeUntil == NewInterval) {
                Exist = true;
                let weight = WC.getWeight(timestamp, date);
                InsertArray[i].TimesExceeded += weight;
            }
            if (InsertArray[i].TimeUntil > NewInterval)
                break;
        }
        return Exist;
    }
}

// QCC: Query Call Class
class QCC {
    // All the query calls to the database.

    static async getPredictionSensorsInRoom(room) {
        let result = [];

        let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput", [new BCC.QueryValue("roomInput", sql.Int, room)]);
        await BCC.asyncForEach(queryTable.recordset, async function (v) {
            result.push(v);
        });

        return result;
    }

    static async getSensorTypeName(SensorTypeID) {
        let result;

        let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorTypes]WHERE [SensorType]=@typeID", [new BCC.QueryValue("typeID", sql.Int, SensorTypeID)]);

        await BCC.asyncForEach(queryTable.recordset, async function (v) {
            result = v.TypeName;
        });

        return result;
    }

    static async getSensorTypesForSensor(sensorID) {
        let result = [];

        let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorID", [new BCC.QueryValue("sensorID", sql.Int, sensorID)]);

        await BCC.asyncForEach(queryTable.recordset, async function (v) {
            result.push(v);
        });

        return result;
    }


    static async GetOldestEntry(SensorType, SensorID) {
        let queryTable = await BCC.MakeQuery(
            "SELECT MIN(Timestamp) as Timestamp FROM [SensorValue_" + SensorType + "] WHERE [SensorID]=@sensorIDInput", [
            new BCC.QueryValue("sensorIDInput", sql.Int, SensorID),
        ]);

        if (queryTable.recordset.length >= 1) {
            return new Date(queryTable.recordset[0].Timestamp);
        }
        else
            return new Date();
    }

    static async getPredictionSensorValues(result, sensorID, dateMin, dateMax, sensorType, ThresholdValue) {
        let queryTable = await BCC.MakeQuery(
            "SELECT * FROM [SensorValue_" + sensorType + "] WHERE [SensorID]=@sensorIDInput AND [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput AND [SensorValue]>=@thresholdValueInput", [
            new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
            new BCC.QueryValue("timestampMinInput", sql.DateTime, dateMin),
            new BCC.QueryValue("timestampMaxInput", sql.DateTime, dateMax),
            new BCC.QueryValue("thresholdValueInput", sql.Int, ThresholdValue)
        ]);
        await BCC.asyncForEach(queryTable.recordset, async function (v) {
            result.push(v);
        });

        return result;
    }

}

// WC: Weight class
class WC {
    static getWeight(timestamp, date) {
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
        let RetWeight = WC_A * timeSince + WC_B;
        if (RetWeight < 0)
            RetWeight = 0;
        return RetWeight;
    }
}