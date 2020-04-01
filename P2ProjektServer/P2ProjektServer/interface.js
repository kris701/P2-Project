try {
    class Credentials {
        constructor(Username, Password) {
            this.Username = Username;
            this.Password = Password;
        }
    }

    let AdminCredentials = [new Credentials("Admin", "Password"), new Credentials("Admin2", "Password2")]

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
            } else if (CheckForResource(req, "/mainadminpage")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def
                if (CheckCredentials(new Credentials(queryUrl.Username, queryUrl.Password))) {
                    // Call the actual function
                }
                else
                    CredentialsWrong();
            }
            else if (CheckForResource(req, "/sensoreditpage")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/allrooms")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/addnewroom")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/removeroom")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/updateroom")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/displayallsensors")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/addexistingsensor")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/displayroominfo")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/selectsenor")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/addnewsensor")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/removesensorreference")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/displaysensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/addexistingsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/displayselectedsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/selectsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/addnewsensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/removesensortype")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/removesensortypereference")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/setsensortypethreshold")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/warningandsolutionpage")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/allwarningsandsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/addnewwarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/selectawarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/removewarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/updatewarning")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/attachedsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/selectasolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/addnewsolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/removesolutionreference")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/updatesolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/allsolutionsthatsnotattached")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/selectsolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

            }
            else if (CheckForResource(req, "/removesolution")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

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

    function CheckCredentials(CredentialsInfo) {
        // run through all admin credentials, and check for username and password
        // return true if credentials are ok, false if not
        // See the class in the top of the file
    }

    function CredentialsWrong() {
        console.log("Client (" + req.headers.host + ") Attempted to request resource: " + req.url + ". However with wrong credentials");
        res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify("Wrong username or password"));
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