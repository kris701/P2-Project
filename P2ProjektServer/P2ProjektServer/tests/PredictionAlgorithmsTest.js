var path = require('path');
var expect = require('chai').expect;

var PredictionCalls = require(path.join(__dirname, '..', './PredictionAlgorithms.js'));

describe('Get predictions function', function () {

    this.timeout(10000);
    this.retries(3);

    it('Should fail if not room is given', async function () {
        let res = await PredictionCalls.PAC.getPredictionDatetimeQuery();
        expect(res).to.be.equal("err");
    });

    //it('Should fail if room does not exist', async function () {
    //    let res = await PredictionCalls.PAC.getPredictionDatetimeQuery(-9999);
    //    expect(res).to.be.equal("err");
    //});

    it('Should return an array', async function () {
        let res = await PredictionCalls.PAC.getPredictionDatetimeQuery(0);
        expect(res.Data).to.be.an('array');
    });
});