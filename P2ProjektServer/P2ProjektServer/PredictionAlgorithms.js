const sql = require("mssql");
let basicCalls = require(__dirname + "/BasicCalls.js");

const Interval = 15;
const WeekOffset = 5;
const HourReach = 24;

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

module.exports.getPredictionDatetimeQuery = async function (room) {
    let ReturnItem = new ReturnClass(Interval, []);

    let sensorsInRoom = await getPredictionSensorsInRoom(room);
    await basicCalls.asyncForEach(sensorsInRoom, async function (v) {
        let SensorSensorTypes = await getSensorTypesForSensor(v.SensorID);

        await LoopThroughAllSensorTypes(SensorSensorTypes, ReturnItem);
    });

    return ReturnItem;
}

async function LoopThroughAllSensorTypes(SensorSensorTypes, ReturnItem) {
    await basicCalls.asyncForEach(SensorSensorTypes, async function (v) {

        let Exists = await CheckForEqualValue(ReturnItem.Data, v.SensorType, v.SensorID);
        if (!Exists) {
            let NewName = await getSensorTypeName(v.SensorType);
            let NewReturnValue = new SensorType(v.SensorType, NewName, []);
            await CheckForThresholdPass(v.SensorID, NewName, v.ThresholdValue, NewReturnValue.ThresholdPasses)
            ReturnItem.Data.push(NewReturnValue);
        }
    });
}

async function CheckForEqualValue(SearchArray, SensorType, SensorID) {
    let ReturnValue = false;
    await basicCalls.asyncForEach(SearchArray, async function (v) {
        if (v.SensorType == SensorType) {
            await CheckForThresholdPass(SensorID, v.Name, v.ThresholdValue, v.ThresholdPasses);
            ReturnValue = true;
        }
    });
    return ReturnValue;
}

async function CheckForThresholdPass(SensorID, SensorType, ThresholdValue, ReturnArray) {
    let SensorValues = await getPredictionSensorValues(SensorID, SensorType);

    await basicCalls.asyncForEach(SensorValues, async function (v) {
        if (v.SensorValue > ThresholdValue) {

            let NewInterval = getTimeLeftInIntervals(v.Timestamp);
            let Exist = await DoesValueExistAndInsert(ReturnArray, NewInterval);

            if (!Exist)
                ReturnArray = await InsertIntoCorrectPositionInArray(NewInterval, ReturnArray);
        }
    });
}

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

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput", [new basicCalls.QueryValue("roomInput", sql.Int, room)]);
    queryTable.recordset.forEach(v => result.push(v));

    return result;
}

async function getPredictionSensorValues(sensorID, sensorType) {
    let result = [];

    for (let i = 7; i <= (WeekOffset * 7); i+=7) {
        let dateMin = new Date();
        let dateMax = new Date();

        dateMin.setDate(dateMin.getDate() - i);
        dateMax.setDate(dateMax.getDate() - i);
        dateMax.setHours(dateMax.getHours() + HourReach);

        result = await getPredictionSensorValuesQuery(result, sensorID, dateMin, dateMax, "SensorValue_" + sensorType);
    }

    return result;
}

async function getPredictionSensorValuesQuery(result, sensorID, dateMin, dateMax, sensorType) {
    let queryTable = await basicCalls.MakeQuery(
        "SELECT * FROM [" + sensorType + "] WHERE [SensorID]=@sensorIDInput AND [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput", [
        new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID),
        new basicCalls.QueryValue("timestampMinInput", sql.DateTime, dateMin),
        new basicCalls.QueryValue("timestampMaxInput", sql.DateTime, dateMax)
    ]);
    queryTable.recordset.forEach(v => result.push(v));

    return result;
}


function getTimeLeftInIntervals(timestamp) {
    let date = new Date(timestamp);
    let CurrentDate = new Date();
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

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorTypes]WHERE [SensorType]=@typeID", [new basicCalls.QueryValue("typeID", sql.Int, SensorTypeID)]);

    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        result = v.TypeName;
    });

    return result;
}

async function getSensorTypesForSensor(sensorID) {
    let result = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorThresholds] WHERE [SensorID]=@sensorID", [new basicCalls.QueryValue("sensorID", sql.Int, sensorID)]);

    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        result.push(v);
    });

    return result;
}