try {
    let prediction = require(__dirname + "/PredictionAlgorithms.js");
    let sensorInfo = require(__dirname + "/SimpleSensorInfo.js");
    let warningAndSolution = require(__dirname + "/WarningAndSolutionSelectionAlgorithm");

    let http = require("http");
    const querystring = require("querystring");

    let server = http.createServer(async function (req, res) {
        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

        try {
            if (CheckForResource(req, "/getsensorinfo")) {
                let response = await sensorInfo.getSensorInfoQuery();
                res.write(JSON.stringify(response));
            }
            else if (CheckForResource(req, "/getpredictiondata")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (queryUrl.room != null) {
                    let response = await prediction.getPredictionDatetimeQuery(queryUrl.room);
                    res.write(JSON.stringify(response));
                }
            }
            else if (CheckForResource(req, "/getwarningsandsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (queryUrl.room != null && queryUrl.date != null) {
                    let response = await getWarningsAndSolutionsQuery;
                    res.write(JSON.stringify(response));
                }
            }
            else {
                console.log("Client (" + req.headers.host + ") Attempted to request resource: " + req.url + ". However the resource was not found.");
                res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
                res.write(JSON.stringify("Resource not found!"));
            }

        } catch (err) {
            console.log(err);
            res.write(JSON.stringify("An error occured on the server!"));
        }

        res.end();
    });

    let server = http.createServer(async function (req, res) {
        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

        try {
            if (CheckForResource(req, "/mainadminpage")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def
            }
            else if (checkForResource(req, "/sensoreditpage")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/allrooms")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/addnewroom")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/removeroom")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/updateroom")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/displayallsensors")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/addexistingsensor")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/displayroominfo")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/selectsenor")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/addnewsensor")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/removesensorreference")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/displaysensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/addexistingsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/displayselectedsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/selectsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/addnewsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/removesensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/removesensortypereference")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/setsensortypethreshold")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/warningandsolutionpage")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/allwarningsandsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/addnewwarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/selectawarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/removewarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/updatewarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/attachedsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/selectasolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/addnewsolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/removesolutionreference")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/updatesolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/allsolutionsthatsnotattached")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/selectsolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (checkForResource(req, "/removesolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
        }
    }

    function queryStringParse(url) {
        return querystring.parse(url.split("?")[1], "&", "="); // This splits the url at the ? sign and returns the last part, so abc?def becomes def
    }

    function CheckForResource(Request, TargetResource) {
        if (Request.url.includes(TargetResource)) {
            console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
            return true;
        }
        else return false;
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