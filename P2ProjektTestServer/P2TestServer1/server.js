let http = require("http");
const sql = require("mssql");
const querystring = require("querystring");

const config = {
    server: "sql6009.site4now.net",
    user: "DB_A4BDCF_p2projekt_admin",
    password: "a12345678",
    database: "DB_A4BDCF_p2projekt"
};

let server = http.createServer(async function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

    try {
        if (req.url == "/datatypes") {
            let response = await datatypeQuery();
            res.write(JSON.stringify(response));
            res.end();
        }
        else if (req.url.includes("/sensorids")) {
            var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            let response = await sensorIDQuery(queryUrl.datatype, queryUrl.starttime, queryUrl.endtime);
            res.write(JSON.stringify(response));
            res.end();
        }
        else if (req.url.includes("/results")) {
            var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            let response = await resultsQuery(queryUrl.datatype, queryUrl.starttime, queryUrl.endtime, queryUrl.sensorid);
            res.write(JSON.stringify(response));
            res.end();
        }
        else if (req.url.includes("/newresult")) {
            var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            let response = await newResultQuery(queryUrl.datatype, queryUrl.sensorid, queryUrl.sensorvalue);
            res.write(JSON.stringify(response));
            res.end();
        }
        else if (req.url.includes("/getallsensors")) {
            let response = await getAllSensorsQuery();
            res.write(JSON.stringify(response));
            res.end();
        }
    } catch {
        console.log("Connection failed.");
        res.write(JSON.stringify("Connection failed."));
        res.end();
    }
});

async function datatypeQuery() {
    let result = [];
    try {
        await sql.connect(config);
        let queryTable = await sql.query('SELECT * FROM INFORMATION_SCHEMA.TABLES');
        queryTable.recordset.forEach(v => result.push(v.TABLE_NAME));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function sensorIDQuery(datatype, starttime, endtime) {
    let result = [];
    try {
        await sql.connect(config);
        var request = new sql.Request();
        request.input("startTimeInput", sql.DateTime, starttime);
        request.input("endTimeInput", sql.DateTime, endtime);

        let queryTable = await request.query("SELECT DISTINCT(SensorID) FROM [" + datatype + "] WHERE [Timestamp] BETWEEN @startTimeInput AND @endTimeInput");
        console.dir(queryTable);
        queryTable.recordset.forEach(v => result.push(v.SensorID));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function resultsQuery(datatype, starttime, endtime, sensorID) {
    let result = [];
    try {
        await sql.connect(config);
        var request = new sql.Request();
        request.input("startTimeInput", sql.DateTime, starttime);
        request.input("endTimeInput", sql.DateTime, endtime);
        request.input("sensorIDInput", sql.Int, sensorID);

        let queryTable = await request.query("SELECT * FROM [" + datatype + "] WHERE [Timestamp] BETWEEN @startTimeInput AND @endTimeInput AND [SensorID]=@sensorIDInput");
        console.dir(queryTable);
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

async function newResultQuery(datatype, sensorID, sensorValue) {
    let result;
    try {
        await sql.connect(config);
        var request = new sql.Request();
        request.input("sensorIDInput", sql.Int, sensorID);
        request.input("sensorValueInput", sql.Int, sensorValue);

        result = await request.query("INSERT INTO [" + datatype + "] (SensorID,SensorValue) values (@sensorIDInput, @sensorValueInput)");
        console.dir(result);
    } catch (err) {
        console.log(err);
        if (err.number == 547) return "No sensor with ID " + sensorID + " exists.";
    }

    return result;
}

async function getAllSensorsQuery() {
    let result = [];
    try {
        await sql.connect(config);
        let queryTable = await sql.query("SELECT * FROM [SensorData]");
        queryTable.recordset.forEach(v => result.push(v));
    } catch (err) {
        console.log(err);
    }

    return result;
}

function queryStringParse(url) {
    return querystring.parse(url.split("?")[1], "&", "="); // This splits the url at the ? sign and returns the last part, so abc?def becomes def
}

server.listen(5000);
console.log("Node.js server is running and listening at port 5000.");