//#region Header

var path = require('path');

var ACC = require(path.join(__dirname, '..', './AdminCalls.js')).ACC;
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var successCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).successCodes;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getAllWarningsAndSolutions function', function () {
    this.timeout(200000);

    GTC.shouldReturnArrayDotData(ACC.WASC.getAllWarningsAndSolutions());
});

describe('getAllSensorTypes function', function () {
    GTC.shouldReturnArrayDotData(ACC.SEC.getAllSensorTypes());
    GTC.outputArrayMustBeLargerThanDotData(ACC.SEC.getAllSensorTypes(), 0);
});

describe('addNewWarning function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.addNewWarning(), failCodes.NoParameters);
    GTC.shouldReturnDatabaseErrorWithInput(ACC.WASC.addNewWarning(-99, ""), failCodes.DatabaseError);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.addNewWarning(0, []), successCodes.AddWarning);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.addNewWarning([], 0), successCodes.AddWarning);
});

describe('removeWarning function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.removeWarning(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.removeWarning(-1), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.removeWarning([]), successCodes.RemoveWarning);
});

describe('updateWarning function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.updateWarning(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.updateWarning(-1, ""), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.updateWarning(0, []), successCodes.UpdateWarning);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.updateWarning([], 0), successCodes.UpdateWarning);
});

describe('addSolution function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.addSolution(), failCodes.NoParameters);
    GTC.expectErrorCodeFromInput('Should fail if target priority is outside of range', ACC.WASC.addSolution(-1, -1, ""), failCodes.PriorityOutsideRange);
    GTC.shouldReturnDatabaseErrorWithInput(ACC.WASC.addSolution(-99, 0, ""), failCodes.DatabaseError);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.addSolution(0, [], ""), successCodes.AddSolution);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.addSolution(0, 0, []), successCodes.AddSolution);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.addSolution([], 0, ""), successCodes.AddSolution);
});

describe('removeSolutionReference function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.removeSolutionReference(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.removeSolutionReference(-1), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.removeSolutionReference([]), successCodes.RemoveSolutionRef);
});

describe('updateSolution function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.updateSolution(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.updateSolution(-1, "", 0), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.updateSolution(-1, [], 0), successCodes.UpdateSolution);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.updateSolution([], "", 0), successCodes.UpdateSolution);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.updateSolution(-1, "", []), successCodes.UpdateSolution);
});

describe('addExistingSolution function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.addExistingSolution(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.addExistingSolution(-1, 0), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.addExistingSolution(0, []), successCodes.AddExistingSolution);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.addExistingSolution([], 0), successCodes.AddExistingSolution);
});

describe('removeSolution function', function () {
    GTC.shouldFailWithToParameters(ACC.WASC.removeSolution(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.removeSolution(-1), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.WASC.removeSolution([]), successCodes.RemoveSolution);
});

describe('getAllSolutions function', function () {
    this.timeout(200000);

    GTC.shouldReturnArrayDotData(ACC.WASC.getAllSolutions());
});

describe('getAllWarningsAndSolutions function', function () {
    this.timeout(200000);

    GTC.shouldReturnArrayDotData(ACC.WASC.getAllWarningsAndSolutions());
});



describe('addNewRoom function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.addNewRoom(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.addNewRoom([]), successCodes.AddRoom);
});

describe('removeRoom function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.removeRoom(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.SEC.removeRoom(-1), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.removeRoom([]), successCodes.RemoveRoom);
});

describe('updateRoom function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.updateRoom(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.SEC.updateRoom(-1, ""), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.updateRoom(0, []), successCodes.UpdateRoom);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.updateRoom([],0), successCodes.UpdateRoom);
});

describe('updateSensor function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.updateSensor(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.updateSensor(0, []), successCodes.UpdateSensor);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.updateSensor([], 0), successCodes.UpdateSensor);
});

describe('addNewSensor function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.addNewSensor(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.addNewSensor([]), successCodes.AddSensor);
});

describe('removeSensorReference function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.removeSensorReference(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.removeSensorReference([]), successCodes.RemoveSensorRef);
});

describe('removeSensor function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.removeSensor(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.removeSensor([]), successCodes.RemoveSensor);
});

describe('addNewSensorType function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.addNewSensorType(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.addNewSensorType([]), successCodes.AddSensorType);
});

describe('addExistingSensorType function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.addExistingSensorType(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.addExistingSensorType([],0,0), successCodes.AddExistingSensorType);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.addExistingSensorType(0,[],0), successCodes.AddExistingSensorType);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.addExistingSensorType(0,0,[]), successCodes.AddExistingSensorType);
});

describe('removeSensorType function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.removeSensorType(), failCodes.NoParameters);
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.SEC.removeSensorType(-1), -1, failCodes.TargetIsDefaultID);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.removeSensorType([]), successCodes.RemoveSensorType);
});

describe('removeSensorTypeReference function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.removeSensorTypeReference(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.removeSensorTypeReference([]), successCodes.RemoveSensorTypeRef);
});

describe('updateSensorTypeThreshold function', function () {
    GTC.shouldFailWithToParameters(ACC.SEC.updateSensorTypeThreshold(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.updateSensorTypeThreshold([], 0, 0), successCodes.UpdateSensorTypeThreshold);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.updateSensorTypeThreshold(0, [], 0), successCodes.UpdateSensorTypeThreshold);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.SEC.updateSensorTypeThreshold(0, 0, []), successCodes.UpdateSensorTypeThreshold);
});



describe('insertSensorValue function', function () {
    GTC.shouldFailWithToParameters(ACC.insertSensorValue(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.insertSensorValue([], 0, 0), successCodes.InsertSensorValue);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.insertSensorValue(0, [], 0), successCodes.InsertSensorValue);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(ACC.insertSensorValue(0, 0, []), successCodes.InsertSensorValue);
});

//#endregion