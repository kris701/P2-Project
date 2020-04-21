//#region Header

var path = require('path');

var WASC = require(path.join(__dirname, '..', './WarningAndSolutionSelectionAlgorithm.js')).WASC;
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getWarningsAndSolutions function', function () {

    this.timeout(20000);
    this.retries(3);

    GTC.shouldFailWithToParameters(WASC.getWarningsAndSolutions(), failCodes.NoParameters);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(WASC.getWarningsAndSolutions([], 0), -999);
    GTC.shouldNotReturnOKCodeIfInputIsWrong(WASC.getWarningsAndSolutions(0, []), -999);
    GTC.shouldReturnArrayDotData(WASC.getWarningsAndSolutions(0, new Date()));
});

//#endregion