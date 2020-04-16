try {
    /*
        =========================
                Header
        =========================
    */

    // File class
    class Credentials {
        constructor(Username, Password) {
            this.Username = Username;
            this.Password = Password;
        }
    }

    // Admin credentials
    let AdminCredentials = [new Credentials("Admin", "Password"), new Credentials("Sensor", "SensorPassword")]

    // Include all other js files
    let prediction = require(__dirname + "/PredictionAlgorithms.js");
    let sensorInfo = require(__dirname + "/SimpleSensorInfo.js");
    let warningAndSolution = require(__dirname + "/WarningAndSolutionSelectionAlgorithm");
    let adminCalls = require(__dirname + "/AdminCalls.js").ACC;
    let BCC = require(__dirname + "/BasicCalls.js").BCC;

    // Include modules
    let http = require("http");
    const querystring = require("querystring");




    /*
        =========================
                Code Part
        =========================
    */

    let server = http.createServer(async function (req, res) {
        let response = new BCC.ReturnMessage(-1,"");
        try {
            var queryUrl = queryStringParse(req.url);

            response = await CheckForResource(req, "/getsensorinfo", [], response, sensorInfo.SSIC.getSensorInfoQuery);
            response = await CheckForResource(req, "/getpredictiondata", [queryUrl.room, queryUrl.date], response, prediction.PAC.getPredictionDatetimeQuery);
            response = await CheckForResource(req, "/getwarningsandsolutions", [queryUrl.room, queryUrl.date], response, warningAndSolution.WASC.getWarningsAndSolutions);

            if (response.Message == "") {
                let AdminCheck = await CheckForResource(req, "/admin", [queryUrl.Username, queryUrl.Password], new BCC.ReturnMessage(-1, ""), CheckCredentials);
                if (AdminCheck.Message) {
                    response = await CheckForResource(req, "/getallwarningsandsolutions", [], response, adminCalls.WASC.adminGetAllWarningsAndSolutions);
                    response = await CheckForResource(req, "/addnewwarning", [queryUrl.sensorType, queryUrl.message], response, adminCalls.WASC.adminAddNewWarning);
                    response = await CheckForResource(req, "/removewarning", [queryUrl.warningID], response, adminCalls.WASC.adminRemoveWarning);
                    response = await CheckForResource(req, "/updatewarning", [queryUrl.warningID, queryUrl.message], response, adminCalls.WASC.adminUpdateWarning);
                    response = await CheckForResource(req, "/addnewsolution", [queryUrl.warningID, queryUrl.priority, queryUrl.message], response, adminCalls.WASC.adminAddSolution);
                    response = await CheckForResource(req, "/removesolutionreference", [queryUrl.solutionID], response, adminCalls.WASC.adminRemoveSolutionReference);
                    response = await CheckForResource(req, "/updatesolution", [queryUrl.solutionID, queryUrl.message, queryUrl.priorit], response, adminCalls.WASC.adminUpdateSolution);
                    response = await CheckForResource(req, "/addexistingsolution", [queryUrl.solutionID, queryUrl.warningID], response, adminCalls.WASC.adminAddExistingSolution);
                    response = await CheckForResource(req, "/removesolution", [queryUrl.solutionID], response, adminCalls.WASC.adminRemoveSolution);
                    response = await CheckForResource(req, "/getallsolutions", [], response, adminCalls.WASC.adminGetAllSolutions);
                    response = await CheckForResource(req, "/addnewroom", [queryUrl.roomName], response, adminCalls.SEC.adminAddNewRoom);
                    response = await CheckForResource(req, "/removeroom", [queryUrl.roomID], response, adminCalls.SEC.adminRemoveRoom);
                    response = await CheckForResource(req, "/updateroom", [queryUrl.roomID, queryUrl.roomName], response, adminCalls.SEC.adminUpdateRoom);
                    response = await CheckForResource(req, "/getallsensortypes", [], response, adminCalls.SEC.adminGetAllSensorTypes);
                    response = await CheckForResource(req, "/addnewsensortype", [queryUrl.typeName], response, adminCalls.SEC.adminAddNewSensorType);
                    response = await CheckForResource(req, "/addexistingsensortype", [queryUrl.sensorType, queryUrl.sensorID, queryUrl.threshold], response, adminCalls.SEC.adminAddExistingSensorType);
                    response = await CheckForResource(req, "/removesensortype", [queryUrl.sensorType], response, adminCalls.SEC.adminRemoveSensorType);
                    response = await CheckForResource(req, "/removesensortypereference", [queryUrl.sensorType], response, adminCalls.SEC.adminRemoveSensorTypeReference);
                    response = await CheckForResource(req, "/updatesensortypethreshold", [queryUrl.sensorID, queryUrl.sensorType, queryUrl.threshold], response, adminCalls.SEC.adminUpdateSensorTypeThreshold);
                    response = await CheckForResource(req, "/getallsensors", [], response, adminCalls.SEC.adminGetAllSensors);
                    response = await CheckForResource(req, "/updatesensor", [queryUrl.sensorID, queryUrl.roomID], response, adminCalls.SEC.adminUpdateSensor);
                    response = await CheckForResource(req, "/addnewsensor", [queryUrl.roomID], response, adminCalls.SEC.adminAddNewSensor);
                    response = await CheckForResource(req, "/removesensorreference", [queryUrl.sensorID], response, adminCalls.SEC.adminRemoveSensorReference);
                    response = await CheckForResource(req, "/removesensor", [queryUrl.sensorID], response, adminCalls.SEC.adminRemoveSensor);
                    response = await CheckForResource(req, "/insertsensorvalue", [queryUrl.sensorID, queryUrl.sensorType, queryUrl.sensorValue], response, adminCalls.adminInsertSensorValue);
                    response = await CheckForResource(req, "/getallwarningsandsolutions", [], response, adminCalls.WASC.adminGetAllWarningsAndSolutions);
                }
                else {
                    if (AdminCheck.ReturnCode == 0) {
                        console.error("Client (" + req.headers.host + ") Attempted to request resource: " + req.url + " with wrong credentials");
                        response.ReturnCode = 404;
                        response.Message = "Credentials Wrong!";
                    }
                }
            }

            if (response.ReturnCode == -1) {
                console.error("Resource not found!");
                response.ReturnCode = 404;
                response.Message = "Resource not found!";
            }

        } catch (err) {
            console.error(err);
            response.ReturnCode = 404;
            response.Message = "An error occured on the server!";
        }

        res.writeHead(response.ReturnCode, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify(response.Message));
        res.end();
    });

    function queryStringParse(url) {
        return querystring.parse(url.split("?")[1], "&", "=");
    }

    async function CheckForResource(Request, TargetResource, CheckQueryStringArray, Response, FunctionCall) {
        if (Response.ReturnCode != -1)
            return Response;
        if (Request.url.includes(TargetResource)) {
            if (CheckQueryStringArray != null) {
                let WrongInput = false;
                for (let i = 0; i < CheckQueryStringArray.length; i++)
                    if (CheckQueryStringArray[i] == null)
                        WrongInput = true;
                if (WrongInput) {
                    console.error("Client (" + Request.headers.host + ") Attempted to request resource: " + Request.url + ". However input was wrong!");
                    Response.Message = "Wrong input!";
                    Response.ReturnCode = 404;
                    return Response;
                }

                console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
                if (CheckQueryStringArray.length == 0)
                    Response = await FunctionCall();
                if (CheckQueryStringArray.length == 1)
                    Response = await FunctionCall(CheckQueryStringArray[0]);
                if (CheckQueryStringArray.length == 2)
                    Response = await FunctionCall(CheckQueryStringArray[0], CheckQueryStringArray[1]);
                if (CheckQueryStringArray.length == 3)
                    Response = await FunctionCall(CheckQueryStringArray[0], CheckQueryStringArray[1], CheckQueryStringArray[2]);
            }
            else {
                console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
                Response = await FunctionCall;
            }
        }
        return Response;
    }

    function CheckCredentials(Username, Password) {
        let ReturnValue = new BCC.ReturnMessage(0, false);
        AdminCredentials.forEach(function (v) {
            if (v.Username == Username && v.Password == Password)
                ReturnValue = new BCC.ReturnMessage(0, true);
        });

        return ReturnValue;
    }

    server.listen(3910);
    console.log("Node.js server is running and listening at port 3910.");

} catch (err) {
    /*
        =========================
            Main Error catch
        =========================
    */



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