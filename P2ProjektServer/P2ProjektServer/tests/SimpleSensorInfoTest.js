/*
    =========================
            Header
    =========================
*/

var path = require('path');
var expect = require('chai').expect;

var SimpleSensorInfoCall = require(path.join(__dirname, '..', './SimpleSensorInfo.js'));

/*
    =========================
          Testing code
    =========================
*/

describe('getSensorInfoQuery function', function () {

    this.timeout(10000);
    this.retries(3);

    it('Should return an array', async function () {
        let res = await SimpleSensorInfoCall.SSIC.getSensorInfoQuery();
        expect(res).to.be.an('array');
    });
});