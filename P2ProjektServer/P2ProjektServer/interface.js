try {
    let prediction = require("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/PredictionAlgorithms.js");
    let sensorInfo = require("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/SimpleSensorInfo.js");
    let warningAndSolution = require("C:/Users/m-s-t/Documents/GitHub/P2-Project/P2ProjektServer/P2ProjektServer/WarningAndSolutionSelectionAlgorithm");

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

                if (req.room != null) {
                    let response = await prediction.getPredictionDatetimeQuery(queryUrl.room);
                    res.write(JSON.stringify(response));
                }
                res.end();
            }
            else if (req.url.includes("/getwarningsandsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (req.room != null && req.date != null) {
                    let response = await getWarningsAndSolutionsQuery;
                    res.write(JSON.stringify(response));
                }
                res.end();
            }

        } catch {
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
    console.log(err)
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0))
}