//#region Header

// External files
let prediction = require(__dirname + "/PredictionAlgorithms.js");
let sensorInfo = require(__dirname + "/SimpleSensorInfo.js");
let warningAndSolution = require(__dirname + "/WarningAndSolutionSelectionAlgorithm");
let adminCalls = require(__dirname + "/AdminCalls.js").ACC;
let BCC = require(__dirname + "/BasicCalls.js").BCC;

// Resource Class
class Resource {
    constructor(Name, Parameters, FunctionCall, SubResources) {
        this.Name = Name;
        this.Parameters = Parameters;
        this.FunctionCall = FunctionCall;
        this.SubResources = SubResources;
    }
}
// Credentials class
class Credentials {
    constructor(Username, Password) {
        this.Username = Username;
        this.Password = Password;
    }
}

// ResourceLib
const ResourceLibrary = new Resource("/", [], function () { return true }, [
    new Resource("getsensorinfo", [], sensorInfo.SSIC.getSensorInfoQuery, []),
    new Resource("getpredictiondata", ["room", "date"], prediction.PAC.getPredictionDatetimeQuery, []),
    new Resource("getwarningsandsolutions", ["room", "date"], warningAndSolution.WASC.getWarningsAndSolutions, []),
    new Resource("admin", ["Username", "Password"], CheckCredentials, [
        new Resource("getallwarningsandsolutions", [], adminCalls.WASC.adminGetAllWarningsAndSolutions, []),
        new Resource("addnewwarning", ["sensorType", "message"], adminCalls.WASC.adminAddNewWarning, []),
        new Resource("removewarning", ["warningID"], adminCalls.WASC.adminRemoveWarning, []),
        new Resource("updatewarning", ["warningID", "message"], adminCalls.WASC.adminUpdateWarning, []),
        new Resource("addnewsolution", ["warningID", "priority", "message"], adminCalls.WASC.adminAddSolution, []),
        new Resource("removesolutionreference", ["solutionID"], adminCalls.WASC.adminRemoveSolutionReference, []),
        new Resource("updatesolution", ["solutionID", "message", "priority"], adminCalls.WASC.adminUpdateSolution, []),
        new Resource("addexistingsolution", ["solutionID", "warningID"], adminCalls.WASC.adminAddExistingSolution, []),
        new Resource("removesolution", ["solutionID"], adminCalls.WASC.adminRemoveSolution, []),
        new Resource("getallsolutions", [], adminCalls.WASC.adminGetAllSolutions, []),
        new Resource("addnewroom", ["roomName"], adminCalls.WASC.adminAddNewRoom, []),
        new Resource("removeroom", ["roomID"], adminCalls.WASC.adminRemoveRoom, []),
        new Resource("updateroom", ["roomID", "roomName"], adminCalls.WASC.adminUpdateRoom, []),
        new Resource("getallsensortypes", [], adminCalls.WASC.adminGetAllSensorTypes, []),
        new Resource("addnewsensortype", ["typeName"], adminCalls.WASC.adminAddNewSensorType, []),
        new Resource("addexistingsensortype", ["sensorType", "sensorID", "threshold"], adminCalls.WASC.adminAddExistingSensorType, []),
        new Resource("removesensortype", ["sensorType"], adminCalls.WASC.adminRemoveSensorType, []),
        new Resource("removesensortypereference", ["sensorType"], adminCalls.WASC.adminRemoveSensorTypeReference, []),
        new Resource("updatesensortypethreshold", ["sensorID", "sensorType", "threshold"], adminCalls.WASC.adminUpdateSensorTypeThreshold, []),
        new Resource("getallsensors", [], adminCalls.WASC.adminGetAllSensors, []),
        new Resource("updatesensor", ["sensorID", "roomID"], adminCalls.WASC.adminUpdateSensor, []),
        new Resource("addnewsensor", ["roomID"], adminCalls.WASC.adminAddNewSensor, []),
        new Resource("removesensorreference", ["sensorID"], adminCalls.WASC.adminRemoveSensorReference, []),
        new Resource("removesensor", ["sensorID"], adminCalls.WASC.adminRemoveSensor, []),
        new Resource("insertsensorvalue", ["sensorID", "sensorType", "sensorValue"], adminCalls.WASC.adminInsertSensorValue, [])
    ])
]);

// Admin credentials
let AdminCredentials = [new Credentials("Admin", "Password"), new Credentials("Sensor", "SensorPassword")]

//#endregion

//#region Public

// Resource Check Class
module.exports.RCC = class {
    static async CheckAllResource(Response, req, QueryURL) {
        return await InnerCheckAllResource(Response, req, ResourceLibrary, QueryURL);
    }
}

//#endregion

//#region Private

async function InnerCheckAllResource(Response, req, Resource, QueryURL) {
    if (CheckForResource(req, Resource.Name, Resource.Parameters, QueryURL) == true) {
        if (Resource.SubResources.length != 0) {
            let ResourceFunctionCallCheck = await ExecuteResource(Resource.FunctionCall, Resource.Parameters, QueryURL);
            if (ResourceFunctionCallCheck) {
                for (let i = 0; i < Resource.SubResources.length; i++) {
                    Response = await InnerCheckAllResource(Response, req, Resource.SubResources[i], QueryURL);
                    if (Response.ReturnCode != -1)
                        break;
                }
            }
            else
                Response = new BCC.ReturnMessage(404, "Error in input/credentials");
        }
        else
            Response = await ExecuteResource(Resource.FunctionCall, Resource.Parameters, QueryURL);
    }
    return Response;
}

function CheckForResource(Request, TargetResource, QueryStringArray, QueryURL) {
    if (Request.url.includes(TargetResource)) {
        if (DoesQueryContainAllNeededKeys(QueryStringArray, QueryURL)) {
            console.error("Client (" + Request.headers.host + ") Attempted to request resource: " + Request.url + ". However input was wrong!");
            return false;
        }

        console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
        return true;
    }
    return false;
}

function DoesQueryContainAllNeededKeys(QueryStringArray, QueryURL) {
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
    return WrongInput;
}

async function ExecuteResource(FunctionCall, QueryStringArray, QueryURL) {
    if (QueryStringArray.length == 0)
        return await FunctionCall();
    else {
        let AccArr = TranslateQueryToResourceParameters(QueryStringArray, QueryURL);

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

function TranslateQueryToResourceParameters(QueryStringArray, QueryURL) {
    let ReturnArray = new Array(QueryStringArray.length);
    for (let i = 0; i < QueryStringArray.length; i++) {
        for (let j = 0; j < Object.keys(QueryURL).length; j++) {
            if (QueryStringArray[i] == Object.keys(QueryURL)[j]) {
                ReturnArray.splice(i, 0, QueryURL[Object.keys(QueryURL)[j]]);
                break;
            }
        }
    }
    return ReturnArray;
}

// Misc resource functions:

function CheckCredentials(Username, Password) {
    let ReturnValue = false
    AdminCredentials.forEach(function (v) {
        if (v.Username == Username && v.Password == Password)
            ReturnValue = true
    });

    return ReturnValue;
}

//#endregion