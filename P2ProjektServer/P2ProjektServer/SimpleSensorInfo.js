const sql = require("mssql");
const fs = require("fs");

module.exports.getSensorInfoQuery = async function () {
    let sensorInfo = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        let queryTable = await sql.query("SELECT * FROM [SensorInfo]");
        queryTable.recordset.forEach(v => sensorInfo.push(v));
    } catch (err) {
        console.log(err);
    }

    return sensorInfo;
}