const sql = require("mssql");
const fs = require("fs");
let basicCalls = require(__dirname + "/BasicCalls.js");

const Interval = 15;

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
    constructor(TimeUntil, TimesExcedded) {
        this.TimeUntil = TimeUntil;
        this.TimesExcedded = TimesExcedded;
    }
}

module.exports.getPredictionDatetimeQuery = async function (room) {
    let ReturnItem = new ReturnClass(Interval, []);

    let sensorsInRoom = await getPredictionSensorsInRoom(room);
    await basicCalls.asyncForEach(sensorsInRoom, async function (v) {
        let SensorSensorTypes = await getSensorTypesForSensor(v.SensorID);

        await basicCalls.asyncForEach(SensorSensorTypes, async function (v2) {

            let Exists = false;
            await basicCalls.asyncForEach(ReturnItem.Data, async function (v3) {
                if (v3.SensorType == v2.SensorType) {
                    Exists = true;

                    await CheckForThresholdPass(v.SensorID, v3.Name, v2.ThresholdValue, v3.ThresholdPasses);
                }
            });
            if (!Exists) {
                let NewName = await getSensorTypeName(v2.SensorType);
                let NewReturnValue = new SensorType(v2.SensorType, NewName, []);
                await CheckForThresholdPass(v.SensorID, NewName, v2.ThresholdValue, NewReturnValue.ThresholdPasses)
                ReturnItem.Data.push(NewReturnValue);
            }
        });
    });

    return ReturnItem;
}

async function CheckForThresholdPass(SensorID, SensorType, ThresholdValue, ReturnArray) {
    let SensorValues = await getPredictionSensorValues(SensorID, SensorType);

    await basicCalls.asyncForEach(SensorValues, async function (v) {
        if (v.SensorValue > ThresholdValue) {

            let NewInterval = getTimeLeftInIntervals(v.Timestamp);
            let Exist = false;

            await basicCalls.asyncForEach(ReturnArray, async function (v2) {
                if (NewInterval == v2.TimeUntil) {

                    Exist = true;

                    v2.TimesExcedded += 1;
                }
            });

            if (!Exist) {
                ReturnArray.push(new ThresholdPass(
                    NewInterval,
                    1
                ));
            }

        }
    });
}

async function getPredictionSensorsInRoom(room) {
    let result = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput", [new basicCalls.QueryValue("roomInput", sql.Int, room)]);
    queryTable.recordset.forEach(v => result.push(v));

    return result;
}

async function getPredictionSensorValues(sensorID, sensorType) {
    let result = [];
    let dateMin = new Date();
    let dateMax = new Date();

    dateMin.setDate(dateMin.getDate() - 7);
    dateMax.setDate(dateMax.getDate() - 7);
    dateMax.setHours(dateMax.getHours() + 10);

    result = await getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, "SensorValue_" + sensorType);

    return result;
}

async function getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, sensorType) {
    let result = [];

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
    date.setDate(date.getDate() + 7);

    let millisecondsLeft = (date.getTime() - Date.now());
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

async function getSensorThreshold(sensorID, sensorType) {
    let result;
    
    let queryTable = await basicCalls.MakeQuery(
        "SELECT [ThresholdValue] FROM [SensorThresholds] WHERE [SensorID]=@sensorIDInput AND [SensorType]=@sensorTypeInput",
        [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID),
        new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType)]
    );
    result = queryTable.recordset[0].ThresholdValue

    return result;
}