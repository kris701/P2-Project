//#region Header

var path = require('path');

var WASC = require(path.join(__dirname, '..', './WarningAndSolutionSelectionAlgorithm.js')).WASC;
var successCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).successCodes;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getWarningsAndSolutions function', function () {

    this.timeout(20000);
    this.retries(3);

    GTC.shouldFailWithNoParameters(WASC.getWarningsAndSolutions());
    GTC.shouldNotReturnCodeWithInput(WASC.getWarningsAndSolutions([], 0), successCodes.GotWarningsAndSoluton);
    GTC.shouldNotReturnCodeWithInput(WASC.getWarningsAndSolutions(0, []), successCodes.GotWarningsAndSoluton);
    GTC.shouldReturnArrayDotData(WASC.getWarningsAndSolutions(0, "2020-04-20T00:00:00"));
});

//#endregion