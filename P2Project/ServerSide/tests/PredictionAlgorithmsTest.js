//#region Header

var path = require('path');
var expect = require('chai').expect;

var PredictionCalls = require(path.join(__dirname, '..', './PredictionAlgorithms.js'));
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var generalTests = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getPredictionDatetimeQuery function', function () {

    this.timeout(10000);
    this.retries(3);

    generalTests.ShouldFailWithToParameters(PredictionCalls.PAC.getPredictionDatetimeQuery(), failCodes.NoParameters);
    generalTests.ShouldReturnArrayDotData(PredictionCalls.PAC.getPredictionDatetimeQuery(0, "2020-04-20T00:00:00"));
});

//#endregion