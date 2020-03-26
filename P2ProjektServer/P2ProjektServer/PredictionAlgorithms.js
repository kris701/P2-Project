const sql = require("mssql");
const fs = require("fs");

async function getPredictionDatetime(room) {
    let sensorsInRoom = await getPredictionSensorsInRoom(room);
    let sensorValues = [];
    let sensorValuesPastThreshold = [];

    sensorsInRoom.forEach(v => {
        sensorValues[v.SensorID] = await getPredictionSensorValues(v.SensorID);
        sensorValuesPastThreshold[v.SensorID] = checkSensorValueThresholds(sensorValues[v.SensorID]);
    });

    let pastThresholdTimestamps = [];
    sensorValuesPastThreshold.forEach(v => pastThresholdTimestamps.push(v.Timestamp));

    return pastThresholdTimestamps;
}

async function getPredictionSensorsInRoom(room) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("roomInput", sql.NVarChar(50), room);

        let queryTable = await request.query("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput");
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function getPredictionSensorValues(sensorID) {
    let result = [];
    let date = new Date(); // This creates a new date containing the current date and time
    date.setDate(date.getDate() - 7); // Offset the dates day of the month with 7 days so we get last weeks values

    result.CO2 = await getPredictionCO2SensorValues(date, sensorID);
    result.RH = await getPredictionRHSensorValues(date, sensorID);
    result.Temperature = await getPredictionTemperatureSensorValues(date, sensorID);

    return result;
}

async function getPredictionCO2SensorValues(date, sensorID) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("timestampMinInput", sql.DateTime, date.setDatetimeToMinMax(date, "Min"));
        request.input("timestampMaxInput", sql.DateTime, date.setDatetimeToMinMax(date, "Max"));
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = await request.query("SELECT * FROM [SensorValue_CO2] WHERE [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput AND [SensorID]=@sensorIDInput");
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function getPredictionRHSensorValues(date, sensorID) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("timestampMinInput", sql.DateTime, date.setDatetimeToMinMax(date, "Min"));
        request.input("timestampMaxInput", sql.DateTime, date.setDatetimeToMinMax(date, "Max"));
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = await request.query("SELECT * FROM [SensorValue_RH] WHERE [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput AND [SensorID]=@sensorIDInput");
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function getPredictionTemperatureSensorValues(date, sensorID) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("timestampMinInput", sql.DateTime, setDatetimeToMinMax(date, "min"));
        request.input("timestampMaxInput", sql.DateTime, setDatetimeToMinMax(date, "max"));
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = await request.query("SELECT * FROM [SensorValue_Temperature] WHERE [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput AND [SensorID]=@sensorIDInput");
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

function setDatetimeToMinMax(date, mode) {
    if (mode == "min") {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    } else if (mode == "max") {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        date.setMilliseconds(999);
    }

    return date;
}

function checkSensorValueThresholds(sensorValues) {
    let valuesPastThreshold = [];
    valuesPastThreshold.CO2 = [];
    valuesPastThreshold.RH = [];
    valuesPastThreshold.Temperature = [];
    let thresholds = JSON.parse(fs.readFile("Thresholds.json"));

    sensorValues.CO2.forEach(v => {
        if (v.sensorValue >= thresholds.CO2) {
            valuesPastThreshold.CO2.push(v);
        }
    })
    sensorValues.RH.forEach(v => {
        if (v.sensorValue >= thresholds.RH) {
            valuesPastThreshold.RH.push(v);
        }
    })
    sensorValues.Temperature.forEach(v => {
        if (v.sensorValue >= thresholds.Temperature) {
            valuesPastThreshold.Temperature.push(v);
        }
    })
}