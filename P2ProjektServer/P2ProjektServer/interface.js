try {
    class Credentials {
        constructor(Username, Password) {
            this.Username = Username;
            this.Password = Password;
        }
    }

    let AdminCredentials = [new Credentials("Admin", "Password"), new Credentials("Sensor", "SensorPassword")]

    let prediction = require(__dirname + "/PredictionAlgorithms.js");
    let sensorInfo = require(__dirname + "/SimpleSensorInfo.js");
    let warningAndSolution = require(__dirname + "/WarningAndSolutionSelectionAlgorithm");
    let adminCalls = require(__dirname + "/AdminCalls.js");

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
                var queryUrl = queryStringParse(req.url);

                if (queryUrl.room != null) {
                    let predictionData = await prediction.getPredictionDatetimeQuery(queryUrl.room);
                    let response = await warningAndSolution.getWarningsAndSolutions(predictionData);
                    res.write(JSON.stringify(response));
                }
            } 
            else if (CheckForResource(req, "/admin")) {
                var queryUrl = queryStringParse(req.url);

                if (CheckCredentials(new Credentials(queryUrl.Username, queryUrl.Password))) {
                    if (CheckForResource(req, "/getallwarningsandsolutions")) {
                        let response = await adminCalls.adminGetAllWarningsAndSolutions();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/addnewwarning")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddNewWarning(queryUrl.sensorType, queryUrl.message);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removewarning")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddNewWarning(queryUrl.warningID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updatewarning")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminUpdateWarning(queryUrl.warningID, queryUrl.message);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addnewsolution")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddSolution(queryUrl.warningID, queryUrl.priority, queryUrl.message);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesolutionreference")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminRemoveSolutionReference(queryUrl.solutionID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updatesolution")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminUpdateSolution(queryUrl.solutionID, queryUrl.message);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addexistingsolution")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddExistingSolution(queryUrl.solutionID, queryUrl.warningID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesolution")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminRemoveSolution(queryUrl.solutionID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/getallsolutions")) {
                        let response = await adminCalls.adminGetAllSolutions();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/addnewroom")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddNewRoom(queryUrl.roomName);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removeroom")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminRemoveRoom(queryUrl.roomID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updateroom")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminUpdateRoom(queryUrl.roomID, queryUrl.roomName);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/getallsensors")) {
                        let response = await adminCalls.adminGetAllSensors();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/updatesensor")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminUpdateSensor(queryUrl.sensorID, queryUrl.roomID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addnewsensor")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddNewSensor(queryUrl.sensorID, queryUrl.roomID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensorreference")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminRemoveSensorReference(queryUrl.sensorID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensor")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminRemoveSensor(queryUrl.sensorID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/getallsensortypes")) {
                        let response = await adminCalls.adminGetAllSensorTypes();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/addnewsensortype")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddNewSensorType(queryUrl.typeName);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addexistingsensortype")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminAddExistingSensorType(queryUrl.sensorType, queryUrl.sensorID, queryUrl.threshold);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensortype")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminRemoveSensorType(queryUrl.sensorType);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensortypereference")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminRemoveSensorTypeReference(queryUrl.sensorType);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updatesensortypethreshold")) {
                        if (queryUrl.room != null) {
                            let response = await adminCalls.adminUpdateSensorTypeThreshold(queryUrl.sensorID, queryUrl.sensorType, queryUrl.threshold);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/insertsensorvalue")) {
                        var queryUrl = queryStringParse(req.url);

                        // /insertsensorvalue?SensorID=<sensorid>&SensorType=<sensortype>&SensorValue=<sensorvalue>
                        // Make function
                    }
                }
                else
                    CredentialsWrong(req, res);
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
        return querystring.parse(url.split("?")[1], "&", "=");
    }

    function CheckForResource(Request, TargetResource) {
        if (Request.url.includes(TargetResource)) {
            console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
            return true;
        }
        else return false;
    }

    function CheckCredentials(CredentialsInfo) {
        let credentialsCheck = false;

        AdminCredentials.forEach(function (v) {
            if (v.Username == CredentialsInfo.Username && v.Password == CredentialsInfo.Password)
                credentialsCheck = true;
        });

        return credentialsCheck;
    }

    function CredentialsWrong(req, res) {
        console.log("Client (" + req.headers.host + ") Attempted to request resource: " + req.url + " with wrong credentials");
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