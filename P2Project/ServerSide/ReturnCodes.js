
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
    GotPredictions: 224
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
        default: return "Unknown code!";
    }
}

module.exports.parseToRetMSG = function(code)
{
    let BCC = require(__dirname + "/BasicCalls.js").BCC;
    return new BCC.retMSG(code, module.exports.parseCode(code));
}

//#endregion