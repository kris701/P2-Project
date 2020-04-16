/*
    =========================
            Header
    =========================
*/

var path = require('path');
var expect = require('chai').expect;

var AdminCall = require(path.join(__dirname, '..', './AdminCalls.js'));
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var successCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).successCodes;
var generalTests = require("./GeneralTests.js").GTC;

/*
    =========================
          Testing code
    =========================
*/

describe('adminGetAllWarningsAndSolutions function', function () {
    this.timeout(200000);

    generalTests.ShouldReturnArrayDotData(AdminCall.ACC.WASC.adminGetAllWarningsAndSolutions());
});

describe('adminGetAllSensorTypes function', function () {
    generalTests.ShouldReturnArrayDotData(AdminCall.ACC.SEC.adminGetAllSensorTypes());
    generalTests.OutputArrayMustBeLargerThanDotData(AdminCall.ACC.SEC.adminGetAllSensorTypes(), 0);
});

describe('adminAddNewWarning function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminAddNewWarning(), failCodes.NoParameters);
    generalTests.ShouldReturnDatabaseErrorWithInput(AdminCall.ACC.WASC.adminAddNewWarning(-99, ""), failCodes.DatabaseError);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminAddNewWarning(0, []), successCodes.AddWarning);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminAddNewWarning([], 0), successCodes.AddWarning);
});

describe('adminRemoveWarning function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminRemoveWarning(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.WASC.adminRemoveWarning(-1), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminRemoveWarning([]), successCodes.RemoveWarning);
});

describe('adminUpdateWarning function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminUpdateWarning(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.WASC.adminUpdateWarning(-1, ""), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminUpdateWarning(0, []), successCodes.UpdateWarning);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminUpdateWarning([], 0), successCodes.UpdateWarning);
});

describe('adminAddSolution function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminAddSolution(), failCodes.NoParameters);
    generalTests.ExpectErrorCodeFromInput('Should fail if target priority is outside of range', AdminCall.ACC.WASC.adminAddSolution(-1, -1, ""), failCodes.PriorityOutsideRange);
    generalTests.ShouldReturnDatabaseErrorWithInput(AdminCall.ACC.WASC.adminAddSolution(-99, 0, ""), failCodes.DatabaseError);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminAddSolution(0, [], ""), successCodes.AddSolution);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminAddSolution(0, 0, []), successCodes.AddSolution);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminAddSolution([], 0, ""), successCodes.AddSolution);
});

describe('adminRemoveSolutionReference function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminRemoveSolutionReference(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.WASC.adminRemoveSolutionReference(-1), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminRemoveSolutionReference([]), successCodes.RemoveSolutionRef);
});

describe('adminUpdateSolution function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminUpdateSolution(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.WASC.adminUpdateSolution(-1, "", 0), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminUpdateSolution(-1, [], 0), successCodes.UpdateSolution);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminUpdateSolution([], "", 0), successCodes.UpdateSolution);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminUpdateSolution(-1, "", []), successCodes.UpdateSolution);
});

describe('adminAddExistingSolution function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminAddExistingSolution(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.WASC.adminAddExistingSolution(-1, 0), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminAddExistingSolution(0, []), successCodes.AddExistingSolution);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminAddExistingSolution([], 0), successCodes.AddExistingSolution);
});

describe('adminRemoveSolution function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.WASC.adminRemoveSolution(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.WASC.adminRemoveSolution(-1), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.WASC.adminRemoveSolution([]), successCodes.RemoveSolution);
});

describe('adminGetAllSolutions function', function () {
    this.timeout(200000);

    generalTests.ShouldReturnArrayDotData(AdminCall.ACC.WASC.adminGetAllSolutions());
});

describe('adminGetAllWarningsAndSolutions function', function () {
    this.timeout(200000);

    generalTests.ShouldReturnArrayDotData(AdminCall.ACC.WASC.adminGetAllWarningsAndSolutions());
});



describe('adminAddNewRoom function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminAddNewRoom(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminAddNewRoom([]), successCodes.AddRoom);
});

describe('adminRemoveRoom function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminRemoveRoom(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.SEC.adminRemoveRoom(-1), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminRemoveRoom([]), successCodes.RemoveRoom);
});

describe('adminUpdateRoom function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminUpdateRoom(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.SEC.adminUpdateRoom(-1, ""), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminUpdateRoom(0, []), successCodes.UpdateRoom);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminUpdateRoom([],0), successCodes.UpdateRoom);
});

describe('adminUpdateSensor function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminUpdateSensor(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminUpdateSensor(0, []), successCodes.UpdateSensor);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminUpdateSensor([], 0), successCodes.UpdateSensor);
});

describe('adminAddNewSensor function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminAddNewSensor(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminAddNewSensor([]), successCodes.AddSensor);
});

describe('adminRemoveSensorReference function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminRemoveSensorReference(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminRemoveSensorReference([]), successCodes.RemoveSensorRef);
});

describe('adminRemoveSensor function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminRemoveSensor(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminRemoveSensor([]), successCodes.RemoveSensor);
});

describe('adminAddNewSensorType function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminAddNewSensorType(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminAddNewSensorType([]), successCodes.AddSensorType);
});

describe('adminAddExistingSensorType function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminAddExistingSensorType(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminAddExistingSensorType([],0,0), successCodes.AddExistingSensorType);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminAddExistingSensorType(0,[],0), successCodes.AddExistingSensorType);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminAddExistingSensorType(0,0,[]), successCodes.AddExistingSensorType);
});

describe('adminRemoveSensorType function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminRemoveSensorType(), failCodes.NoParameters);
    generalTests.ShouldFailIfTargetIDIsDefaultID(AdminCall.ACC.SEC.adminRemoveSensorType(-1), -1, failCodes.TargetIsDefaultID);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminRemoveSensorType([]), successCodes.RemoveSensorType);
});

describe('adminRemoveSensorTypeReference function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminRemoveSensorTypeReference(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminRemoveSensorTypeReference([]), successCodes.RemoveSensorTypeRef);
});

describe('adminUpdateSensorTypeThreshold function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.SEC.adminUpdateSensorTypeThreshold(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminUpdateSensorTypeThreshold([], 0, 0), successCodes.UpdateSensorTypeThreshold);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminUpdateSensorTypeThreshold(0, [], 0), successCodes.UpdateSensorTypeThreshold);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.SEC.adminUpdateSensorTypeThreshold(0, 0, []), successCodes.UpdateSensorTypeThreshold);
});



describe('adminInsertSensorValue function', function () {
    generalTests.ShouldFailWithToParameters(AdminCall.ACC.adminInsertSensorValue(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.adminInsertSensorValue([], 0, 0), successCodes.InsertSensorValue);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.adminInsertSensorValue(0, [], 0), successCodes.InsertSensorValue);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(AdminCall.ACC.adminInsertSensorValue(0, 0, []), successCodes.InsertSensorValue);
});


