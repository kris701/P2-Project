//#region Header

var path = require('path');

var PAC = require(path.join(__dirname, '..', './PredictionAlgorithms.js')).PAC;
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getPredictionDatetimeQuery function', function () {

    this.timeout(10000);
    this.retries(3);

    GTC.shouldFailWithToParameters(PAC.getPredictionDatetimeQuery(), failCodes.NoParameters);
    GTC.shouldReturnArrayDotData(PAC.getPredictionDatetimeQuery(0, "2020-04-20T00:00:00"));
});

//#endregion