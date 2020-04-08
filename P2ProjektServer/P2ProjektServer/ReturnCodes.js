module.exports.adminFunctionsSuccessCodes = {
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
    InsertSensorValue: 221
}

module.exports.adminFunctionsFailCodes = {
    NoParameters: 401,
    TargetIsDefaultID: 402,
    PriorityOutsideRange: 403,
    OutputNotAnArray: 404,
    InputNotAnArray: 405,
    NoSensorTypes: 406,
    IDDoesNotExist: 407,
    DatabaseError: 408
}