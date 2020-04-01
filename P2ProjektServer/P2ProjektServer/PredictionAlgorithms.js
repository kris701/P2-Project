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

    await basicCalls.asyncForEach(sensorsInRoom, async function (v) {
        sensorValues[v.SensorID] = await getPredictionSensorValues(v.SensorID);
        sensorValuesPastThreshold[v.SensorID] = checkSensorValueThresholds(sensorValues[v.SensorID]);
    });

    let pastThresholdTimestamps = formatPastThresholdTimestamps(sensorValuesPastThreshold);

    let timeUntilPastThreshold = formatTimestampsToTimeLeftInFiveMinuteIntervals(pastThresholdTimestamps);

    return timeUntilPastThreshold;
}

async function getPredictionSensorsInRoom(room) {
    let result = [];

    try {
        let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput", [new basicCalls.QueryValue("roomInput", sql.Int, room)]);
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function getPredictionSensorValues(sensorID) {
    let result = [];
    let dateMin = new Date();
    let dateMax = new Date();

    dateMin.setDate(dateMin.getDate() - 7);
    dateMax.setDate(dateMax.getDate() - 7);
    dateMax.setHours(dateMax.getHours() + 2);

    result.CO2 = await getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, "SensorValue_CO2");
    result.RH = await getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, "SensorValue_RH");
    result.Temperature = await getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, "SensorValue_Temperature");

    return result;
}

async function getPredictionSensorValuesQuery(sensorID, dateMin, dateMax, sensorType) {
    let result = [];

    try {
        let queryTable = await basicCalls.MakeQuery(
            "SELECT * FROM [" + sensorType + "] WHERE [SensorID]=@sensorIDInput AND [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput", [
            new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID),
            new basicCalls.QueryValue("timestampMinInput", sql.DateTime, dateMin),
            new basicCalls.QueryValue("timestampMaxInput", sql.DateTime, dateMax)
        ]);
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

function checkSensorValueThresholds(sensorValues) {
    let valuesPastThreshold = [];
    valuesPastThreshold.CO2 = [];
    valuesPastThreshold.RH = [];
    valuesPastThreshold.Temperature = [];
    let file = fs.readFileSync(__dirname + "/Thresholds.json");
    let thresholds = JSON.parse(file);

    sensorValues.CO2.forEach(v => {
        if (v.SensorValue >= thresholds.CO2) {
            valuesPastThreshold.CO2.push(v);
        }
    })
    sensorValues.RH.forEach(v => {
        if (v.SensorValue >= thresholds.RH) {
            valuesPastThreshold.RH.push(v);
        }
    })
    sensorValues.Temperature.forEach(v => {
        if (v.SensorValue >= thresholds.Temperature) {
            valuesPastThreshold.Temperature.push(v);
        }
    })

    return valuesPastThreshold;
}

function formatPastThresholdTimestamps(sensorValuesPastThreshold) {
    let result = [];
    let CO2 = {};
    let RH = {};
    let Temperature = {};
    let CO2Values = [];
    let RHValues = [];
    let TemperatureValues = [];

    CO2.Type = "CO2";
    RH.Type = "RH";
    Temperature.Type = "Temperature";

    sensorValuesPastThreshold.forEach(function (v) {
        v.CO2.forEach(v2 => CO2Values.push(v2.Timestamp));
        v.RH.forEach(v2 => RHValues.push(v2.Timestamp));
        v.Temperature.forEach(v2 => TemperatureValues.push(v2.Timestamp));
    });

    CO2.Values = CO2Values;
    RH.Values = RHValues;
    Temperature.Values = TemperatureValues;

    result.push(CO2);
    result.push(RH);
    result.push(Temperature);

    return result;
}

function formatTimestampsToTimeLeftInFiveMinuteIntervals(pastThresholdTimestamps) {
    let result = {};
    result.CO2 = [];
    result.RH = [];
    result.Temperature = [];

    pastThresholdTimestamps.forEach(function (v) {
        v.Values.forEach(function (v2) {
            switch (v.Type) {
                case "CO2":
                    result.CO2.push(getTimeLeftInFiveMinuteIntervals(v2));
                    break;
                case "RH":
                    result.RH.push(getTimeLeftInFiveMinuteIntervals(v2));
                    break;
                case "Temperature":
                    result.Temperature.push(getTimeLeftInFiveMinuteIntervals(v2));
                    break;
            }
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