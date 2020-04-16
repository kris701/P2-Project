//#region Header

var path = require('path');
var expect = require('chai').expect;

var SimpleSensorInfoCall = require(path.join(__dirname, '..', './SimpleSensorInfo.js'));
var generalTests = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getSensorInfoQuery function', function () {

    this.timeout(10000);
    this.retries(3);

    generalTests.ShouldReturnArray(SimpleSensorInfoCall.SSIC.getSensorInfoQuery());
});

//#endregion