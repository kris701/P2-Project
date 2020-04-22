//#region Header

// External files
let PAC = require(__dirname + "/PredictionAlgorithms.js").PAC;
let SSIC = require(__dirname + "/SimpleSensorInfo.js").SSIC;
let WASC = require(__dirname + "/WarningAndSolutionSelectionAlgorithm").WASC;
let ACC = require(__dirname + "/AdminCalls.js").ACC;
let BCC = require(__dirname + "/BasicCalls.js").BCC;
let RC = require(__dirname + "/ReturnCodes.js");

// Resource Class
class Resource {
    constructor(name, parameters, functionCall, subResourcesArray) {
        this.name = name;
        this.parameters = parameters;
        this.functionCall = functionCall;
        this.subResourcesArray = subResourcesArray;
    }
}
// Credentials class
class Credentials {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

// ResourceLib
const ResourceLibrary = new Resource("/", [], function () { return true }, [
    new Resource("getsensorinfo", [], SSIC.getSensorInfoQuery, []),
    new Resource("getpredictiondata", ["room", "date"], PAC.getPredictionDatetimeQuery, []),
    new Resource("getwarningsandsolutions", ["room", "date"], WASC.getWarningsAndSolutions, []),
    new Resource("admin", ["username", "password"], checkCredentials, [
        new Resource("login", [], function () { return new BCC.retMSG(RC.successCodes.CredentialsCorrect, "Credentials correct!") }, []),
        new Resource("getallwarningsandsolutions", [], ACC.WASC.getAllWarningsAndSolutions, []),
        new Resource("addnewwarning", ["sensorType", "message"], ACC.WASC.addNewWarning, []),
        new Resource("removewarning", ["warningID"], ACC.WASC.removeWarning, []),
        new Resource("updatewarning", ["warningID", "message"], ACC.WASC.updateWarning, []),
        new Resource("addnewsolution", ["warningID", "priority", "message"], ACC.WASC.addSolution, []),
        new Resource("removesolutionreference", ["solutionID"], ACC.WASC.removeSolutionReference, []),
        new Resource("updatesolution", ["solutionID", "message", "priority"], ACC.WASC.updateSolution, []),
        new Resource("addexistingsolution", ["solutionID", "warningID"], ACC.WASC.addExistingSolution, []),
        new Resource("removesolution", ["solutionID"], ACC.WASC.removeSolution, []),
        new Resource("getallsolutions", [], ACC.WASC.getAllSolutions, []),
        new Resource("addnewroom", ["roomName"], ACC.WASC.addNewRoom, []),
        new Resource("removeroom", ["roomID"], ACC.WASC.removeRoom, []),
        new Resource("updateroom", ["roomID", "roomName"], ACC.WASC.updateRoom, []),
        new Resource("getallsensortypes", [], ACC.WASC.getAllSensorTypes, []),
        new Resource("addnewsensortype", ["typeName"], ACC.WASC.addNewSensorType, []),
        new Resource("addexistingsensortype", ["sensorType", "sensorID", "threshold"], ACC.WASC.addExistingSensorType, []),
        new Resource("removesensortype", ["sensorType"], ACC.WASC.removeSensorType, []),
        new Resource("removesensortypereference", ["sensorType"], ACC.WASC.removeSensorTypeReference, []),
        new Resource("updatesensortypethreshold", ["sensorID", "sensorType", "threshold"], ACC.WASC.updateSensorTypeThreshold, []),
        new Resource("getallsensors", [], ACC.WASC.getAllSensors, []),
        new Resource("updatesensor", ["sensorID", "roomID"], ACC.WASC.updateSensor, []),
        new Resource("addnewsensor", ["roomID"], ACC.WASC.addNewSensor, []),
        new Resource("removesensorreference", ["sensorID"], ACC.WASC.removeSensorReference, []),
        new Resource("removesensor", ["sensorID"], ACC.WASC.removeSensor, []),
        new Resource("insertsensorvalue", ["sensorID", "sensorType", "sensorValue"], ACC.WASC.insertSensorValue, [])
    ])
]);

// Admin credentials
let adminCredentials = [new Credentials("Admin", "Password"), new Credentials("Sensor", "SensorPassword")]

//#endregion

//#region Public

// Resource Check Class
module.exports.RCC = class {
    static async checkAllResource(response, req, queryURL) {
        return await innerCheckAllResource(response, req, ResourceLibrary, queryURL);
    }
}

//#endregion

//#region Private

async function innerCheckAllResource(response, req, resource, queryURL) {
    if (checkForResource(req, resource.name, resource.parameters, queryURL) == true) {
        if (resource.subResourcesArray.length != 0) {
            response = await checkInnerResources(response, req, resource, queryURL);
        }
        else
            response = await executeResource(resource.functionCall, resource.parameters, queryURL);
    }
    return response;
}

async function checkInnerResources(response, req, resource, queryURL) {
    let resourceFunctionCallCheck = await executeResource(resource.functionCall, resource.parameters, queryURL);
    if (resourceFunctionCallCheck) {
        for (let i = 0; i < resource.subResourcesArray.length; i++) {
            response = await innerCheckAllResource(response, req, resource.subResourcesArray[i], queryURL);
            if (response.returnCode != -1)
                break;
        }
    }
    else
        response = new RC.parseToRetMSG(RC.failCodes.WrongInputCredentials);
    return response;
}

function checkForResource(request, targetResource, queryStringArray, queryURL) {
    if (request.url.includes(targetResource)) {
        if (doesQueryContainAllNeededKeys(queryStringArray, queryURL)) {
            console.error("Client (" + request.headers.host + ") Attempted to request resource: " + request.url + ". However input was wrong!");
            return false;
        }

        console.log("Client (" + request.headers.host + ") requested resource: " + targetResource);
        return true;
    }
    return false;
}

function doesQueryContainAllNeededKeys(queryStringArray, queryURL) {
    let isInputWrong = false;
    for (let i = 0; i < queryStringArray.length; i++) {
        isInputWrong = true;
        for (let j = 0; j < Object.keys(queryURL).length; j++) {
            if (queryStringArray[i] == Object.keys(queryURL)[j]) {
                isInputWrong = false;
                break;
            }
        }
        if (isInputWrong)
            break;
    }
    return isInputWrong;
}

async function executeResource(functionCall, queryStringArray, queryURL) {
    if (queryStringArray.length == 0)
        return await functionCall();
    else {
        let correctedParametersArray = translateQueryToResourceParameters(queryStringArray, queryURL);
        return await functionCall(...correctedParametersArray)
    }
}

function translateQueryToResourceParameters(queryStringArray, queryURL) {
    let returnArray = new Array(queryStringArray.length);
    for (let i = 0; i < queryStringArray.length; i++) {
        for (let j = 0; j < Object.keys(queryURL).length; j++) {
            if (queryStringArray[i] == Object.keys(queryURL)[j]) {
                returnArray.splice(i, 0, queryURL[Object.keys(queryURL)[j]]);
                break;
            }
        }
    }
    return returnArray;
}

// Misc resource functions:

function checkCredentials(username, password) {
    let returnValue = false
    adminCredentials.forEach(function (v) {
        if (v.username == username && v.password == password)
            returnValue = true
    });

    return returnValue;
}

//#endregion