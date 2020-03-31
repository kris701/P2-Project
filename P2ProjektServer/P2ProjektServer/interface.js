try {
    let prediction = require(__dirname + "/PredictionAlgorithms.js");
    let sensorInfo = require(__dirname + "/SimpleSensorInfo.js");
    let warningAndSolution = require(__dirname + "/WarningAndSolutionSelectionAlgorithm");

    let http = require("http");
    const querystring = require("querystring");

    let server = http.createServer(async function (req, res) {
        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

        try {
            if (req.url == "/getsensorinfo") {
                console.log("Client connected to /getsensorinfo.");
                let response = await sensorInfo.getSensorInfoQuery();
                res.write(JSON.stringify(response));
                res.end();
            }
            else if (req.url.includes("/getpredictiondata")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (queryUrl.room != null) {
                    let response = await prediction.getPredictionDatetimeQuery(queryUrl.room);
                    res.write(JSON.stringify(response));
                }
                res.end();
            }
            else if (req.url.includes("/getwarningsandsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (queryUrl.room != null && queryUrl.date != null) {
                    let response = await getWarningsAndSolutionsQuery;
                    res.write(JSON.stringify(response));
                }
                res.end();
            }

        } catch (err) {
            console.log(err);
            console.log("Connection failed.");
            res.write(JSON.stringify("Connection failed."));
            res.end();
        }
    });

    function queryStringParse(url) {
        return querystring.parse(url.split("?")[1], "&", "="); // This splits the url at the ? sign and returns the last part, so abc?def becomes def
    }

    server.listen(5000);
    console.log("Node.js server is running and listening at port 5000.");

} catch (err) {
    // Simplified error for missing modules
    if (err.code == "MODULE_NOT_FOUND")
        console.log("Use 'NPM INSTALL " + err.message.substring(err.message.indexOf("'"), err.message.lastIndexOf("'")) + "' to get the module");
    else
        console.log(err)

    console.log("\n Press any key to exit")
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0))
}