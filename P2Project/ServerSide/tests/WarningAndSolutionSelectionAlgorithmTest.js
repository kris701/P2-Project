/*
    =========================
            Header
    =========================
*/

var path = require('path');
var expect = require('chai').expect;

var WASACall = require(path.join(__dirname, '..', './WarningAndSolutionSelectionAlgorithm.js'));
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var generalTests = require("./GeneralTests.js").GTC;

/*
    =========================
          Testing code
    =========================
*/

describe('getWarningsAndSolutions function', function () {

    this.timeout(20000);
    this.retries(3);

    generalTests.ShouldFailWithToParameters(WASACall.WASC.getWarningsAndSolutions(), failCodes.NoParameters);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(WASACall.WASC.getWarningsAndSolutions([], 0), -999);
    generalTests.ShouldNotReturnOKCodeIfInputIsWrong(WASACall.WASC.getWarningsAndSolutions(0, []), -999);
    generalTests.ShouldReturnArrayDotData(WASACall.WASC.getWarningsAndSolutions(0, new Date()));
});