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
    GTC.shouldFailWithNoParameters(ACC.WASC.addNewWarning());
    GTC.shouldReturnDatabaseErrorWithInput(ACC.WASC.addNewWarning(-99, ""));
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.addNewWarning(0, []), successCodes.AddWarning);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.addNewWarning([], 0), successCodes.AddWarning);
});

describe('removeWarning function', function () {
    GTC.shouldFailWithNoParameters(ACC.WASC.removeWarning());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.removeWarning(-1), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.removeWarning([]), successCodes.RemoveWarning);
});

describe('updateWarning function', function () {
    GTC.shouldFailWithNoParameters(ACC.WASC.updateWarning());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.updateWarning(-1, ""), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.updateWarning(0, []), successCodes.UpdateWarning);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.updateWarning([], 0), successCodes.UpdateWarning);
});

describe('addSolution function', function () {
    GTC.shouldFailWithNoParameters(ACC.WASC.addSolution());
    GTC.expectErrorCodeFromInput('Should fail if target priority is outside of range', ACC.WASC.addSolution(-1, -1, ""), failCodes.PriorityOutsideRange);
    GTC.shouldReturnDatabaseErrorWithInput(ACC.WASC.addSolution(-99, 0, ""));
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.addSolution(0, [], ""), successCodes.AddSolution);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.addSolution(0, 0, []), successCodes.AddSolution);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.addSolution([], 0, ""), successCodes.AddSolution);
});

describe('removeSolutionReference function', function () {
    GTC.shouldFailWithNoParameters(ACC.WASC.removeSolutionReference());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.removeSolutionReference(-1), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.removeSolutionReference([]), successCodes.RemoveSolutionRef);
});

describe('updateSolution function', function () {
    GTC.shouldFailWithNoParameters(ACC.WASC.updateSolution());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.updateSolution(-1, "", 0), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.updateSolution(-1, [], 0), successCodes.UpdateSolution);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.updateSolution([], "", 0), successCodes.UpdateSolution);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.updateSolution(-1, "", []), successCodes.UpdateSolution);
});

describe('addExistingSolution function', function () {
    GTC.shouldFailWithNoParameters(ACC.WASC.addExistingSolution());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.addExistingSolution(-1, 0), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.addExistingSolution(0, []), successCodes.AddExistingSolution);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.addExistingSolution([], 0), successCodes.AddExistingSolution);
});

describe('removeSolution function', function () {
    GTC.shouldFailWithNoParameters(ACC.WASC.removeSolution());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.WASC.removeSolution(-1), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.WASC.removeSolution([]), successCodes.RemoveSolution);
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
    GTC.shouldFailWithNoParameters(ACC.SEC.addNewRoom());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.addNewRoom([]), successCodes.AddRoom);
});

describe('removeRoom function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.removeRoom());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.SEC.removeRoom(-1), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.removeRoom([]), successCodes.RemoveRoom);
});

describe('updateRoom function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.updateRoom());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.SEC.updateRoom(-1, ""), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.updateRoom(0, []), successCodes.UpdateRoom);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.updateRoom([],0), successCodes.UpdateRoom);
});

describe('updateSensor function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.updateSensor());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.updateSensor(0, []), successCodes.UpdateSensor);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.updateSensor([], 0), successCodes.UpdateSensor);
});

describe('addNewSensor function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.addNewSensor());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.addNewSensor([]), successCodes.AddSensor);
});

describe('removeSensorReference function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.removeSensorReference());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.removeSensorReference([]), successCodes.RemoveSensorRef);
});

describe('removeSensor function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.removeSensor());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.removeSensor([]), successCodes.RemoveSensor);
});

describe('addNewSensorType function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.addNewSensorType());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.addNewSensorType([]), successCodes.AddSensorType);
});

describe('addExistingSensorType function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.addExistingSensorType());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.addExistingSensorType([],0,0), successCodes.AddExistingSensorType);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.addExistingSensorType(0,[],0), successCodes.AddExistingSensorType);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.addExistingSensorType(0,0,[]), successCodes.AddExistingSensorType);
});

describe('removeSensorType function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.removeSensorType());
    GTC.shouldFailIfTargetIDIsDefaultID(ACC.SEC.removeSensorType(-1), -1);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.removeSensorType([]), successCodes.RemoveSensorType);
});

describe('removeSensorTypeReference function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.removeSensorTypeReference());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.removeSensorTypeReference([]), successCodes.RemoveSensorTypeRef);
});

describe('updateSensorTypeThreshold function', function () {
    GTC.shouldFailWithNoParameters(ACC.SEC.updateSensorTypeThreshold());
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.updateSensorTypeThreshold([], 0, 0), successCodes.UpdateSensorTypeThreshold);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.updateSensorTypeThreshold(0, [], 0), successCodes.UpdateSensorTypeThreshold);
    GTC.shouldNotReturnCodeWithInput(ACC.SEC.updateSensorTypeThreshold(0, 0, []), successCodes.UpdateSensorTypeThreshold);
});



describe('insertSensorValue function', function () {
    GTC.shouldFailWithNoParameters(ACC.insertSensorValue());
    GTC.shouldNotReturnCodeWithInput(ACC.insertSensorValue([], 0, 0), successCodes.InsertSensorValue);
    GTC.shouldNotReturnCodeWithInput(ACC.insertSensorValue(0, [], 0), successCodes.InsertSensorValue);
    GTC.shouldNotReturnCodeWithInput(ACC.insertSensorValue(0, 0, []), successCodes.InsertSensorValue);
});

//#endregion