const sql = require("mssql");
const fs = require("fs");

async function getSensorInfoQuery() {
    let result = [];

    try {
        await sql.connect(JSON.parse(fs.readFile("Config.json")));
        let queryTable = await sql.query("SELECT * FROM [] SensorInfo");
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}