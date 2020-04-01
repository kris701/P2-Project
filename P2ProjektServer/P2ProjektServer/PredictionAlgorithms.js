const sql = require("mssql");
const fs = require("fs");
let basicCalls = require(__dirname + "/BasicCalls.js");

const DateMode = {
    MIN: 0,
    MAX: 1
};

module.exports.getPredictionDatetimeQuery = async function (room) {
    let sensorsInRoom = await getPredictionSensorsInRoom(room);
    let sensorValues = [];
    let sensorValuesPastThreshold = [];
    let sensorTypes = await getSensorTypeNames();

    await basicCalls.asyncForEach(sensorsInRoom, async function (v) {
        sensorValues[v.SensorID] = await getPredictionSensorValues(v.SensorID, sensorTypes);
        sensorValuesPastThreshold[v.SensorID] = await checkSensorValueThresholds(sensorValues[v.SensorID], sensorTypes);
    });

    let pastThresholdTimestamps = formatPastThresholdTimestamps(sensorValuesPastThreshold, sensorTypes);

    let timeUntilPastThreshold = formatTimestampsToTimeLeftInFiveMinuteIntervals(pastThresholdTimestamps, sensorTypes);

    return timeUntilPastThreshold;
}

async function getPredictionSensorsInRoom(room) {
    let result = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput", [new basicCalls.QueryValue("roomInput", sql.Int, room)]);
    queryTable.recordset.forEach(v => result.push(v));

    return result;
}

async function getPredictionSensorValues(sensorID, sensorTypes) {
    let result = [];
    let dateMin = new Date();
    let dateMax = new Date();

    dateMin.setDate(dateMin.getDate() - 7);
    dateMax.setDate(dateMax.getDate() - 7);
    dateMax.setHours(dateMax.getHours() + 10);

    await basicCalls.asyncForEach(sensorTypes, async function (v) {
        result[v.TypeName] = await getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, "SensorValue_" + v.TypeName);
    });

    return result;
}

async function getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, sensorType) {
    let result = [];

    let queryTable = await basicCalls.MakeQuery(
        "SELECT * FROM [" + sensorType + "] WHERE [SensorID]=@sensorIDInput AND [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput",
        [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID),
        new basicCalls.QueryValue("timestampMinInput", sql.DateTime, dateMin),
        new basicCalls.QueryValue("timestampMaxInput", sql.DateTime, dateMax)]
    );
    queryTable.recordset.forEach(v => result.push(v));

    return result;
}

async function checkSensorValueThresholds(sensorValues, sensorTypes) {
    let valuesPastThreshold = [];

    await basicCalls.asyncForEach(sensorTypes, async function (v) {
        valuesPastThreshold[v.TypeName] = [];
        await basicCalls.asyncForEach(sensorValues[v.TypeName], async function (v2) {
            let threshold = await getSensorThreshold(v2.SensorID, v.SensorType);
            if (v2.SensorValue >= threshold) {
                valuesPastThreshold[v.TypeName].push(v2);
            }
        });
    });

    return valuesPastThreshold;
}

function formatPastThresholdTimestamps(sensorValuesPastThreshold, sensorTypes) {
    let result = [];

    sensorTypes.forEach(function (v) {
        result[v.TypeName] = [];
        sensorValuesPastThreshold.forEach(function (v2) {
            v2[v.TypeName].forEach(function (v3) {
                result[v.TypeName].push(v3.Timestamp);
            });
        });
    });

    return result;
}

function formatTimestampsToTimeLeftInFiveMinuteIntervals(pastThresholdTimestamps, sensorTypes) {
    let result = {};

    sensorTypes.forEach(function (v) {
        result[v.TypeName] = []
        pastThresholdTimestamps[v.TypeName].forEach(function (v2) {
            result[v.TypeName].push(getTimeLeftInFiveMinuteIntervals(v2));
        });
    });

    return result;
}

function getTimeLeftInFiveMinuteIntervals(timestamp) {
    let date = new Date(timestamp);
    date.setDate(date.getDate() + 7);

    let millisecondsLeft = (date.getTime() - Date.now());
    let secondsLeft = Math.floor(millisecondsLeft / 1000);
    let minutesLeft = Math.floor(secondsLeft / 60);
    let fiveMinutesLeft = Math.floor(minutesLeft / 5);

    return fiveMinutesLeft;
}

async function getSensorTypeNames() {
    let result = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorTypes]", []);
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