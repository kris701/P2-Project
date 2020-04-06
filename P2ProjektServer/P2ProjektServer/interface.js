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
                        let response = await adminCalls.adminClass.adminGetAllWarningsAndSolutions();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/addnewwarning")) {
                        if (queryUrl.sensorType != null && queryUrl.message != null) {
                            let response = await adminCalls.adminClass.adminAddNewWarning(queryUrl.sensorType, queryUrl.message);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removewarning")) {
                        if (queryUrl.warningID != null) {
                            let response = await adminCalls.adminClass.adminRemoveWarning(queryUrl.warningID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updatewarning")) {
                        if (queryUrl.warningID != null && queryUrl.message != null) {
                            let response = await adminCalls.adminClass.adminUpdateWarning(queryUrl.warningID, queryUrl.message);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addnewsolution")) {
                        if (queryUrl.warningID != null && queryUrl.priority != null && queryUrl.message != null) {
                            let response = await adminCalls.adminClass.adminAddSolution(queryUrl.warningID, queryUrl.priority, queryUrl.message);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesolutionreference")) {
                        if (queryUrl.solutionID != null) {
                            let response = await adminCalls.adminClass.adminRemoveSolutionReference(queryUrl.solutionID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updatesolution")) {
                        if (queryUrl.solutionID != null && queryUrl.message != null && queryUrl.priority) {
                            let response = await adminCalls.adminClass.adminUpdateSolution(queryUrl.solutionID, queryUrl.message, queryUrl.priority);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addexistingsolution")) {
                        if (queryUrl.solutionID != null && queryUrl.warningID != null) {
                            let response = await adminCalls.adminClass.adminAddExistingSolution(queryUrl.solutionID, queryUrl.warningID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesolution")) {
                        if (queryUrl.solutionID != null) {
                            let response = await adminCalls.adminClass.adminRemoveSolution(queryUrl.solutionID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/getallsolutions")) {
                        let response = await adminCalls.adminClass.adminGetAllSolutions();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/addnewroom")) {
                        if (queryUrl.roomName != null) {
                            let response = await adminCalls.adminClass.adminAddNewRoom(queryUrl.roomName);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removeroom")) {
                        if (queryUrl.roomID != null) {
                            let response = await adminCalls.adminClass.adminRemoveRoom(queryUrl.roomID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updateroom")) {
                        if (queryUrl.roomID != null && queryUrl.roomName != null) {
                            let response = await adminCalls.adminClass.adminUpdateRoom(queryUrl.roomID, queryUrl.roomName);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/getallsensors")) {
                        let response = await adminCalls.adminClass.adminGetAllSensors();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/updatesensor")) {
                        if (queryUrl.sensorID != null && queryUrl.roomID) {
                            let response = await adminCalls.adminClass.adminUpdateSensor(queryUrl.sensorID, queryUrl.roomID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addnewsensor")) {
                        if (queryUrl.sensorID != null & queryUrl.roomID != null) {
                            let response = await adminCalls.adminClass.adminAddNewSensor(queryUrl.sensorID, queryUrl.roomID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensorreference")) {
                        if (queryUrl.sensorID != null) {
                            let response = await adminCalls.adminClass.adminRemoveSensorReference(queryUrl.sensorID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensor")) {
                        if (queryUrl.sensorID != null) {
                            let response = await adminCalls.adminClass.adminRemoveSensor(queryUrl.sensorID);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/getallsensortypes")) {
                        let response = await adminCalls.adminClass.adminGetAllSensorTypes();
                        res.write(JSON.stringify(response));
                    }
                    else if (CheckForResource(req, "/addnewsensortype")) {
                        if (queryUrl.typeName != null) {
                            let response = await adminCalls.adminClass.adminAddNewSensorType(queryUrl.typeName);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/addexistingsensortype")) {
                        if (queryUrl.sensorType != null && queryUrl.sensorID != null && queryUrl.threshold != null) {
                            let response = await adminCalls.adminClass.adminAddExistingSensorType(queryUrl.sensorType, queryUrl.sensorID, queryUrl.threshold);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensortype")) {
                        if (queryUrl.sensorType != null) {
                            let response = await adminCalls.adminClass.adminRemoveSensorType(queryUrl.sensorType);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/removesensortypereference")) {
                        if (queryUrl.sensorType != null) {
                            let response = await adminCalls.adminClass.adminRemoveSensorTypeReference(queryUrl.sensorType);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/updatesensortypethreshold")) {
                        if (queryUrl.sensorID != null && queryUrl.sensorType && queryUrl.threshold != null) {
                            let response = await adminCalls.adminClass.adminUpdateSensorTypeThreshold(queryUrl.sensorID, queryUrl.sensorType, queryUrl.threshold);
                            res.write(JSON.stringify(response));
                        }
                    }
                    else if (CheckForResource(req, "/insertsensorvalue")) {
                        if (queryUrl.SensorID != null && queryUrl.SensorType && queryUrl.SensorValue != null) {
                            let response = await adminCalls.adminClass.adminInsertSensorValue(queryUrl.SensorID, queryUrl.SensorType, queryUrl.SensorValue);
                            res.write(JSON.stringify(response));
                        }
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