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

    class Resource {
        constructor(Name, Parameters, FunctionCall, SubResources) {
            this.Name = Name;
            this.Parameters = Parameters;
            this.FunctionCall = FunctionCall;
            this.SubResources = SubResources;
        }
    }

    const ResourceLibrary = new Resource("/", [], function () { return true }, [
        new Resource("getsensorinfo", [], sensorInfo.SSIC.getSensorInfoQuery, []),
        new Resource("getpredictiondata", ["room","date"], prediction.PAC.getPredictionDatetimeQuery, []),
        new Resource("getwarningsandsolutions", ["room", "date"], warningAndSolution.WASC.getWarningsAndSolutions, []),
        new Resource("admin", ["Username", "Password"], CheckCredentials, [
            new Resource("getallwarningsandsolutions", [], adminCalls.WASC.adminGetAllWarningsAndSolutions, [])
        ])
    ]);


    /*
        =========================
                Code Part
        =========================
    */

    let server = http.createServer(async function (req, res) {
        let response = new BCC.ReturnMessage(-1,"");
        try {
            let queryUrl = queryStringParse(req.url);
            response = await CheckAllResource(response, req, ResourceLibrary, queryUrl);

            if (response.ReturnCode == -1) {
                console.error("Resource not found!");
                response = new BCC.ReturnMessage(404, "Resource not found!");
            }

        } catch (err) {
            console.error(err);
            response = new BCC.ReturnMessage(404, "An error occured on the server!");
        }

        res.writeHead(response.ReturnCode, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify(response.Message));
        res.end();
    });

    async function CheckAllResource(Response, req, Resource, QueryURL) {
        if (CheckForResource(req, Resource.Name, Resource.Parameters, QueryURL) == true) {
            if (Resource.SubResources.length != 0) {
                let ResourceFunctionCallCheck = await ExecuteResource(Resource.FunctionCall, Resource.Parameters, QueryURL);
                if (ResourceFunctionCallCheck) {
                    for (let i = 0; i < Resource.SubResources.length; i++) {
                        Response = await CheckAllResource(Response, req, Resource.SubResources[i], QueryURL);
                        if (Response.ReturnCode != -1)
                            break;
                    }
                }
            }
            else
                Response = await ExecuteResource(Resource.FunctionCall, Resource.Parameters, QueryURL);
        }
        return Response;
    }

    async function _CheckAllResource(req) {
        let queryUrl = queryStringParse(req.url);
        if (CheckForResource(req, "/getsensorinfo", []) == true)
            return await ExecuteResource(sensorInfo.SSIC.getSensorInfoQuery, []);
        if (CheckForResource(req, "/getpredictiondata", [queryUrl.room, queryUrl.date]) == true)
            return await ExecuteResource(prediction.PAC.getPredictionDatetimeQuery, [queryUrl.room, queryUrl.date]);
        if (CheckForResource(req, "/getwarningsandsolutions", [queryUrl.room, queryUrl.date]) == true)
            return await ExecuteResource(warningAndSolution.WASC.getWarningsAndSolutions, [queryUrl.room, queryUrl.date]);

        if (CheckForResource(req, "/admin", [queryUrl.Username, queryUrl.Password]) == true) {
            let AdminCheck = await ExecuteResource(CheckCredentials, [queryUrl.Username, queryUrl.Password]);
            if (AdminCheck.Message) {
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);
                if (CheckForResource(req, "/addnewwarning", [queryUrl.sensorType, queryUrl.message]) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, [queryUrl.sensorType, queryUrl.message]);
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);
                if (CheckForResource(req, "/getallwarningsandsolutions", []) == true)
                    return await ExecuteResource(adminCalls.WASC.adminGetAllWarningsAndSolutions, []);

                return await CheckForResource(req, "/addnewwarning", [queryUrl.sensorType, queryUrl.message], response, adminCalls.WASC.adminAddNewWarning);
                return await CheckForResource(req, "/removewarning", [queryUrl.warningID], response, adminCalls.WASC.adminRemoveWarning);
                return await CheckForResource(req, "/updatewarning", [queryUrl.warningID, queryUrl.message], response, adminCalls.WASC.adminUpdateWarning);
                return await CheckForResource(req, "/addnewsolution", [queryUrl.warningID, queryUrl.priority, queryUrl.message], response, adminCalls.WASC.adminAddSolution);
                return await CheckForResource(req, "/removesolutionreference", [queryUrl.solutionID], response, adminCalls.WASC.adminRemoveSolutionReference);
                return await CheckForResource(req, "/updatesolution", [queryUrl.solutionID, queryUrl.message, queryUrl.priorit], response, adminCalls.WASC.adminUpdateSolution);
                return await CheckForResource(req, "/addexistingsolution", [queryUrl.solutionID, queryUrl.warningID], response, adminCalls.WASC.adminAddExistingSolution);
                return await CheckForResource(req, "/removesolution", [queryUrl.solutionID], response, adminCalls.WASC.adminRemoveSolution);
                return await CheckForResource(req, "/getallsolutions", [], response, adminCalls.WASC.adminGetAllSolutions);
                return await CheckForResource(req, "/addnewroom", [queryUrl.roomName], response, adminCalls.SEC.adminAddNewRoom);
                return await CheckForResource(req, "/removeroom", [queryUrl.roomID], response, adminCalls.SEC.adminRemoveRoom);
                return await CheckForResource(req, "/updateroom", [queryUrl.roomID, queryUrl.roomName], response, adminCalls.SEC.adminUpdateRoom);
                return await CheckForResource(req, "/getallsensortypes", [], response, adminCalls.SEC.adminGetAllSensorTypes);
                return await CheckForResource(req, "/addnewsensortype", [queryUrl.typeName], response, adminCalls.SEC.adminAddNewSensorType);
                return await CheckForResource(req, "/addexistingsensortype", [queryUrl.sensorType, queryUrl.sensorID, queryUrl.threshold], response, adminCalls.SEC.adminAddExistingSensorType);
                return await CheckForResource(req, "/removesensortype", [queryUrl.sensorType], response, adminCalls.SEC.adminRemoveSensorType);
                return await CheckForResource(req, "/removesensortypereference", [queryUrl.sensorType], response, adminCalls.SEC.adminRemoveSensorTypeReference);
                return await CheckForResource(req, "/updatesensortypethreshold", [queryUrl.sensorID, queryUrl.sensorType, queryUrl.threshold], response, adminCalls.SEC.adminUpdateSensorTypeThreshold);
                return await CheckForResource(req, "/getallsensors", [], response, adminCalls.SEC.adminGetAllSensors);
                return await CheckForResource(req, "/updatesensor", [queryUrl.sensorID, queryUrl.roomID], response, adminCalls.SEC.adminUpdateSensor);
                return await CheckForResource(req, "/addnewsensor", [queryUrl.roomID], response, adminCalls.SEC.adminAddNewSensor);
                return await CheckForResource(req, "/removesensorreference", [queryUrl.sensorID], response, adminCalls.SEC.adminRemoveSensorReference);
                return await CheckForResource(req, "/removesensor", [queryUrl.sensorID], response, adminCalls.SEC.adminRemoveSensor);
                return await CheckForResource(req, "/insertsensorvalue", [queryUrl.sensorID, queryUrl.sensorType, queryUrl.sensorValue], response, adminCalls.adminInsertSensorValue);
                return await CheckForResource(req, "/getallwarningsandsolutions", [], response, adminCalls.WASC.adminGetAllWarningsAndSolutions);
            }
            else {
                if (AdminCheck.ReturnCode == 0) {
                    console.error("Client (" + req.headers.host + ") Attempted to request resource: " + req.url + " with wrong credentials");
                    return new BCC.ReturnMessage(404, "Credentials Wrong!");
                }
            }
        }
    }

    function queryStringParse(url) {
        return querystring.parse(url.split("?")[1], "&", "=");
    }

    function CheckForResource(Request, TargetResource, QueryStringArray, QueryURL) {
        if (Request.url.includes(TargetResource)) {
            let WrongInput = false;
            for (let i = 0; i < QueryStringArray.length; i++) {
                WrongInput = true;
                for (let j = 0; j < Object.keys(QueryURL).length; j++) {
                    if (QueryStringArray[i] == Object.keys(QueryURL)[j]) {
                        WrongInput = false;
                        break;
                    }
                }
                if (WrongInput)
                    break;
            }
            if (WrongInput) {
                console.error("Client (" + Request.headers.host + ") Attempted to request resource: " + Request.url + ". However input was wrong!");
                return false;
            }

            console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
            return true;
        }
        return false;
    }

    async function ExecuteResource(FunctionCall, QueryStringArray, QueryURL) {
        if (QueryStringArray.length == 0)
            return await FunctionCall();
        else {
            let AccArr = new Array(QueryStringArray.length);
            for (let i = 0; i < QueryStringArray.length; i++) {
                for (let j = 0; j < Object.keys(QueryURL).length; j++) {
                    if (QueryStringArray[i] == Object.keys(QueryURL)[j]) {
                        AccArr.splice(i, 0, QueryURL[Object.keys(QueryURL)[j]]);
                        break;
                    }
                }
            }
            if (QueryStringArray.length == 1)
                return await FunctionCall(AccArr[0]);
            if (QueryStringArray.length == 2)
                return await FunctionCall(AccArr[0], AccArr[1]);
            if (QueryStringArray.length == 3)
                return await FunctionCall(AccArr[0], AccArr[1], AccArr[2]);
            if (QueryStringArray.length == 4)
                return await FunctionCall(AccArr[0], AccArr[1], AccArr[2], AccArr[3]);
            if (QueryStringArray.length == 5)
                return await FunctionCall(AccArr[0], AccArr[1], AccArr[2], AccArr[3], AccArr[4]);
        }
    }

    function CheckCredentials(Username, Password) {
        let ReturnValue = false
        AdminCredentials.forEach(function (v) {
            if (v.Username == Username && v.Password == Password)
                ReturnValue = true
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