const sql = require("mssql");
const fs = require("fs");

async function getPredictionDatetime(room) {
    let sensorsInRoom = await getPredictionSensorsInRoom(room);
    let sensorValues = await getPredictionSensorValues(sensorIDs);
}

async function getPredictionSensorsInRoom(room) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("roomInput", sql.NVarChar(50), room);

        let queryTable = await request.query("SELECT * FROM [SensorInfo] WHERE [RoomID]=@roomInput");
        queryTable.recordset.forEach(v => push(result));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function getPredictionSensorValues(sensorIDs) {
    let result = [];
    let date = new Date(); // This creates a new date containing the current date and time
    date.setDate(date.getDate() - 7); // Offset the dates day of the month with 7 days so we get last weeks values

    result.CO2 = await getPredictionCO2SensorValues(date, sensorIDs);
    result.RH = await getPredictionRHSensorValues(date, sensorIDs);
    result.Temperature = await getPredictionTemperatureSensorValues(date, sensorIDs);

    return result;
}

async function getPredictionCO2SensorValues(date, sensorIDs) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("timestampMinInput", sql.DateTime, date.setDatetimeToMinMax(date, "Min"));
        request.input("timestampMaxInput", sql.DateTime, date.setDatetimeToMinMax(date, "Max"));

        let queryTable = await request.query("SELECT * FROM [SensorValue_CO2] WHERE [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput");
        queryTable.recordset.forEach(v => push(result));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function getPredictionRHSensorValues(date, sensorIDs) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("timestampMinInput", sql.DateTime, date.setDatetimeToMinMax(date, "Min"));
        request.input("timestampMaxInput", sql.DateTime, date.setDatetimeToMinMax(date, "Max"));

        let queryTable = await request.query("SELECT * FROM [SensorValue_RH] WHERE [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput");
        queryTable.recordset.forEach(v => push(result));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function getPredictionTemperatureSensorValues(date, sensorIDs) {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        var request = new sql.Request();
        request.input("timestampMinInput", sql.DateTime, date.setDatetimeToMinMax(date, "Min"));
        request.input("timestampMaxInput", sql.DateTime, date.setDatetimeToMinMax(date, "Max"));

        let queryTable = await request.query("SELECT * FROM [SensorValue_Temperature] WHERE [Timestamp] BETWEEN @timestampMinInput AND @timestampMaxInput");
        queryTable.recordset.forEach(v => push(result));
    } catch (err) {
        console.log(err);
    }

    return result;
}

function setDatetimeToMinMax(date, mode) {
    if (mode == "Min") {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    } else if (mode == "Max") {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        date.setMilliseconds(999);
    }

    return date;
}