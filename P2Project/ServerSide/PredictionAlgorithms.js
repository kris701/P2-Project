/*
    =========================
            Header
    =========================
*/

const sql = require("mssql");
let BCC = require(__dirname + "/BasicCalls.js").BCC;
let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;

const Interval = 15;
const WeekOffset = 20;
const HourReach = 3;

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

        let sensorsInRoom = await getPredictionSensorsInRoom(room);
        await BCC.asyncForEach(sensorsInRoom, async function (v) {
            let SensorSensorTypes = await getSensorTypesForSensor(v.SensorID);

            await LoopThroughAllSensorTypes(SensorSensorTypes, ReturnItem, date);
        });

        return ReturnItem;
    }
}

// Private Area

async function LoopThroughAllSensorTypes(SensorSensorTypes, ReturnItem, date) {
    await BCC.asyncForEach(SensorSensorTypes, async function (v) {

        let Exists = await CheckForEqualValue(ReturnItem.Data, v.SensorType, v.SensorID, v.ThresholdValue, date);
        if (!Exists) {
            let NewName = await getSensorTypeName(v.SensorType);
            let NewReturnValue = new SensorType(v.SensorType, NewName, []);
            await CheckForThresholdPass(v.SensorID, NewName, v.ThresholdValue, NewReturnValue.ThresholdPasses, date)
            ReturnItem.Data.push(NewReturnValue);
        }
    });
}

async function CheckForEqualValue(SearchArray, SensorType, SensorID, ThresholdValue, date) {
    let ReturnValue = false;
    await BCC.asyncForEach(SearchArray, async function (v) {
        if (v.SensorType == SensorType) {
            await CheckForThresholdPass(SensorID, v.Name, ThresholdValue, v.ThresholdPasses, date);
            ReturnValue = true;
        }
    });
    return ReturnValue;
}

async function CheckForThresholdPass(SensorID, SensorType, ThresholdValue, ReturnArray, date) {
    let SensorValues = await getPredictionSensorValues(SensorID, SensorType, ThresholdValue, date);

    await BCC.asyncForEach(SensorValues, async function (v) {
        let NewInterval = getTimeLeftInIntervals(v.Timestamp, date);
        let Exist = await DoesValueExistAndInsert(ReturnArray, NewInterval);

        if (!Exist)
            ReturnArray = await InsertIntoCorrectPositionInArray(NewInterval, ReturnArray);
    });
}

// O(n), Omega(1), Theta(n)
async function InsertIntoCorrectPositionInArray(NewInterval, ReturnArray) {
    let Index = 0;
    for (let i = 0; i < ReturnArray.length; i++) {
        if (ReturnArray[i].TimeUntil > NewInterval) {
            break;
        }
        Index++;
    }
    ReturnArray.splice(Index, 0, new ThresholdPass(NewInterval, 1));
    return ReturnArray;
}

// O(n), Omega(1), Theta(1)
async function DoesValueExistAndInsert(ReturnArray, NewInterval) {
    let Exist = false;
    for (let i = 0; i < ReturnArray.length; i++) {
        if (ReturnArray[i].TimeUntil == NewInterval) {
            Exist = true;
            ReturnArray[i].TimesExceeded += 1;
        }
        if (ReturnArray[i].TimeUntil > NewInterval)
            break;
    }
    return Exist;
}

async function getPredictionSensorsInRoom(room) {
    let result = [];

    let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput", [new BCC.QueryValue("roomInput", sql.Int, room)]);
    queryTable.recordset.forEach(v => result.push(v));

    return result;
}

async function getPredictionSensorValues(sensorID, sensorType, ThresholdValue, date) {
    let result = [];

    let OldestEntry = await GetOldestEntry(sensorType, sensorID);
    OldestEntry.setDate(OldestEntry.getDate() - 1 - Math.ceil(HourReach / 24));

    for (let i = 7; i <= (WeekOffset * 7); i+=7) {
        let dateMin = new Date(date);
        let dateMax = new Date(date);

        dateMin.setDate(dateMin.getDate() - i);
        dateMax.setDate(dateMax.getDate() - i);
        dateMax.setHours(dateMax.getHours() + HourReach);

        if (dateMin < OldestEntry)
            break;

        result = await getPredictionSensorValuesQuery(result, sensorID, dateMin, dateMax, sensorType, ThresholdValue);
    }

    return result;
}

async function GetOldestEntry(SensorType, SensorID) {
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

async function getPredictionSensorValuesQuery(result, sensorID, dateMin, dateMax, sensorType, ThresholdValue) {
    let queryTable = await BCC.MakeQuery(
        "SELECT * FROM [SensorValue_" + sensorType + "] WHERE [SensorID]=@sensorIDInput AND [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput AND [SensorValue]>=@thresholdValueInput", [
        new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
        new BCC.QueryValue("timestampMinInput", sql.DateTime, dateMin),
        new BCC.QueryValue("timestampMaxInput", sql.DateTime, dateMax),
            new BCC.QueryValue("thresholdValueInput", sql.Int, ThresholdValue)
    ]);
    queryTable.recordset.forEach(v => result.push(v));

    return result;
}


function getTimeLeftInIntervals(timestamp, senderdate) {
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

async function getSensorTypeName(SensorTypeID) {
    let result;

    let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorTypes]WHERE [SensorType]=@typeID", [new BCC.QueryValue("typeID", sql.Int, SensorTypeID)]);

    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        result = v.TypeName;
    });

    return result;
}

async function getSensorTypesForSensor(sensorID) {
    let result = [];

    let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorID", [new BCC.QueryValue("sensorID", sql.Int, sensorID)]);

    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        result.push(v);
    });

    return result;
}