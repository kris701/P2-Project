/*
    =========================
            Header
    =========================
*/

var path = require('path');
var expect = require('chai').expect;

var WASACall = require(path.join(__dirname, '..', './WarningAndSolutionSelectionAlgorithm.js'));
var PredictionCalls = require(path.join(__dirname, '..', './PredictionAlgorithms.js'));

/*
    =========================
          Testing code
    =========================
*/

describe('getWarningsAndSolutions function', function () {

    this.timeout(20000);
    this.retries(3);

    it('Should fail with no parameters', async function () {
        const ReturnValue = await WASACall.WASC.getWarningsAndSolutions();
        expect(ReturnValue).to.be.equal("err");
    });

    it('Should fail if parameter is not an array', async function () {
        const ReturnValue = await WASACall.WASC.getWarningsAndSolutions("abc");
        expect(ReturnValue).to.be.equal("err");
    });

    it('Should return an array', async function () {
        const Predictions = await PredictionCalls.PAC.getPredictionDatetimeQuery(0);
        const ReturnValue = await WASACall.WASC.getWarningsAndSolutions(Predictions);
        expect(ReturnValue.Data).to.be.an('array');
    });
});