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
            let responseTable = [];

            sql.connect(config, function (err) {
                if (err) console.log(err);

                var request = new sql.Request();
                request.query('SELECT * FROM INFORMATION_SCHEMA.TABLES', function (err, response) {
                    if (err) console.log(err);
                    console.dir(response);

                    response.recordset.forEach(v => responseTable.push(v.TABLE_NAME));
                    res.write(JSON.stringify(responseTable));
                    res.end();
                });
            });
        }
        else if (req.url.includes("/sensorids")) {
            var queryUrl = querystring.parse(req.url.split("?")[1], "&", "="); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            let responseTable = [];

            sql.connect(config, function (err) {
                if (err) console.log(err);

                var request = new sql.Request();
                request.input("startTimeInput", sql.DateTime, queryUrl.starttime);
                request.input("endTimeInput", sql.DateTime, queryUrl.endtime);

                request.query("SELECT DISTINCT(SensorID) FROM [" + queryUrl.datatype + "] WHERE [Timestamp] BETWEEN @startTimeInput AND @endTimeInput", function (err, response) {
                    if (err) console.log(err);
                    console.dir(response);

                    response.recordset.forEach(v => responseTable.push(v.SensorID));
                    res.write(JSON.stringify(responseTable));
                    res.end();
                });
            });
        }
        else if (req.url.includes("/results")) {
            var queryUrl = querystring.parse(req.url.split("?")[1], "&", "="); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            let responseTable = [];

            sql.connect(config, function (err) {
                if (err) console.log(err);

                var request = new sql.Request();
                request.input("startTimeInput", sql.DateTime, queryUrl.starttime);
                request.input("endTimeInput", sql.DateTime, queryUrl.endtime);
                request.input("sensorIDInput", sql.Int, queryUrl.sensorid);

                request.query("SELECT * FROM [" + queryUrl.datatype + "] WHERE [Timestamp] BETWEEN @startTimeInput AND @endTimeInput AND [SensorID]=@sensorIDInput", function (err, response) {
                    if (err) console.log(err);
                    console.dir(response);

                    response.recordset.forEach(v => responseTable.push(v));
                    res.write(JSON.stringify(responseTable));
                    res.end();
                });
            });
        }
        else if (req.url.includes("/newresult")) {
            var queryUrl = querystring.parse(req.url.split("?")[1], "&", "="); // This splits the url at the ? sign and returns the last part, so abc?def becomes def
            sql.input("sensorIDInput", sql.Int, queryUrl.sensorid);
            sql.input("sensorValueInput", sql.Float, queryUrl.sensorvalue);

            sql.connect(config, function (err) {
                if (err) console.log(err);

                var request = new sql.Request();
                request.query("INSERT INTO [" + queryUrl.datatype + "] (SensorID,SensorValue) values (@sensorIDInput, @sensorValueInput)", function (err, response) {
                    if (err) console.log(err);
                    console.dir(response);

                    res.write(JSON.stringify(response));
                    res.end();
                });
            });
        }
        else if (req.url.includes("/getsensorsinallrooms")) {
            let responseTable = [];

            sql.connect(config, function (err) {
                if (err) console.log(err);

                var request = new sql.Request();
                request.query("SELECT * FROM [SensorData]", function (err, response) {
                    if (err) console.log(err);
                    console.dir(response);

                    response.recordset.forEach(v => responseTable.push(v));
                    res.write(JSON.stringify(responseTable));
                    res.end();
                });
            });
        }
    } catch {
        console.log("Connection failed.");
    }
});

server.listen(5000);
console.log("Node.js server is running and listening at port 5000.");