
//#region Header
module.exports.successCodes = {
    AddWarning: 201,
    RemoveWarning: 202,
    UpdateWarning: 203,
    AddSolution: 204,
    RemoveSolution: 205,
    UpdateSolution: 206,
    AddExistingSolution: 207,
    RemoveSolutionRef: 208,
    AddRoom: 209,
    RemoveRoom: 210,
    UpdateRoom: 211,
    AddSensor: 212,
    RemoveSensor: 213,
    AddExistingSensor: 214,
    RemoveSensorRef: 215,
    AddSensorType: 216,
    AddExistingSensorType: 217,
    RemoveSensorType: 218,
    RemoveSensorTypeRef: 219,
    UpdateSensorTypeThreshold: 220,
    InsertSensorValue: 221,
    GotWarningsAndSoluton: 222,
    GotSimpleSensorInfo: 223,
    GotPredictions: 224,
    CredentialsCorrect: 225,
    ReadOpenAPIFile: 226,
    GotAllSensorTypes: 227,
    GotAllSolutions: 228,
    GotAllSensors: 229,
    UpdateSensor: 230,
    GotLiveData: 231,
    GotAllSensorTypeValues: 232,
    GotPriorityName: 233,
    GotAllWarningsAndSolutions: 234,
    GotAllPriorities: 235
}

module.exports.failCodes = {
    NoParameters: 401,
    TargetIsDefaultID: 402,
    PriorityOutsideRange: 403,
    OutputNotAnArray: 404,
    InputNotAnArray: 405,
    NoSensorTypes: 406,
    IDDoesNotExist: 407,
    DatabaseError: 408,
    InputNotAString: 409,
    EmptyString: 410,
    WrongInputCredentials: 411,
    ResourceNotFound: 412
}
//#endregion

//#region Public

module.exports.parseCode = function(code)
{
    switch (code) {
        case module.exports.failCodes.NoParameters: return "Error: No, missing or wrong parameters!";
        case module.exports.failCodes.TargetIsDefaultID: return "Error: Target ID is default ID";
        case module.exports.failCodes.PriorityOutsideRange: return "Error: Priority out of range!";
        case module.exports.failCodes.OutputNotAnArray: return "Error: Output not an array!";
        case module.exports.failCodes.InputNotAnArray: return "Error: Input not an array!";
        case module.exports.failCodes.NoSensorTypes: return "Error: No sensor types!";
        case module.exports.failCodes.IDDoesNotExist: return "Error: ID Does not exist!";
        case module.exports.failCodes.DatabaseError: return "Error: Database error!";
        case module.exports.failCodes.InputNotAString: return "Error: Input not a string!";
        case module.exports.failCodes.EmptyString: return "Error: String is empty!";
        case module.exports.failCodes.WrongInputCredentials: return "Error: Wrong credentials!";
        case module.exports.failCodes.ResourceNotFound: return "Error: Resource not found!";

        case module.exports.successCodes.AddWarning: return "Warning added succesfuly!";
        case module.exports.successCodes.RemoveWarning: return "Warning removed succesfuly!";
        case module.exports.successCodes.UpdateWarning: return "Warning updated succesfuly!";
        case module.exports.successCodes.AddSolution: return "Solution added succesfuly!";
        case module.exports.successCodes.RemoveSolution: return "Solution removed succesfuly!";
        case module.exports.successCodes.UpdateSolution: return "Solution updated succesfuly!";
        case module.exports.successCodes.AddExistingSolution: return "Existing solution added succesfuly!";
        case module.exports.successCodes.RemoveSolutionRef: return "Solution reference removed succesfuly!";
        case module.exports.successCodes.AddRoom: return "Room added succesfuly!";
        case module.exports.successCodes.RemoveRoom: return "Room removed succesfuly!";
        case module.exports.successCodes.UpdateRoom: return "Room updated succesfuly!";
        case module.exports.successCodes.AddSensor: return "Sensor added succesfuly!";
        case module.exports.successCodes.RemoveSensor: return "Sensor removed succesfuly!";
        case module.exports.successCodes.AddExistingSensor: return "Existing sensor added succesfuly!";
        case module.exports.successCodes.RemoveSensorRef: return "Sensor reference removed succesfuly!";
        case module.exports.successCodes.AddSensorType: return "Sensor type added succesfuly!";
        case module.exports.successCodes.AddExistingSensorType: return "Existing sensor type added succesfuly!";
        case module.exports.successCodes.RemoveSensorTypeRef: return "Sensor type reference removed succesfuly!";
        case module.exports.successCodes.RemoveSensorType: return "Sensor type removed succesfuly!";
        case module.exports.successCodes.UpdateSensorTypeThreshold: return "Sensor type threshold updated succesfuly!";
        case module.exports.successCodes.InsertSensorValue: return "Sensor value inserted succesfuly!";
        case module.exports.successCodes.CredentialsCorrect: return "Credentials where correct!";
        case module.exports.successCodes.UpdateSensor: return "Sensor updated sucesfuly!";

        default: return "Unknown code!";
    }
}

module.exports.parseToRetMSG = function(code)
{
    let BCC = require(__dirname + "/BasicCalls.js").BCC;
    return new BCC.retMSG(code, module.exports.parseCode(code));
}

//#endregion
