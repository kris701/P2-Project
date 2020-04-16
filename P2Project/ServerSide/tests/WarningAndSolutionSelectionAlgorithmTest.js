/*
    =========================
            Header
    =========================
*/

var path = require('path');
var expect = require('chai').expect;

var WASACall = require(path.join(__dirname, '..', './WarningAndSolutionSelectionAlgorithm.js'));
var PredictionCalls = require(path.join(__dirname, '..', './PredictionAlgorithms.js'));
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
    generalTests.ExpectErrorCodeFromInput('Should fail if parameter is not an array', WASACall.WASC.getWarningsAndSolutions("abc"), failCodes.InputNotAnArray);

    it('Should return an array', async function () {
        const Predictions = await PredictionCalls.PAC.getPredictionDatetimeQuery(0, new Date());
        const ReturnValue = await WASACall.WASC.getWarningsAndSolutions(Predictions);
        expect(ReturnValue.Data).to.be.an('array');
    });
});