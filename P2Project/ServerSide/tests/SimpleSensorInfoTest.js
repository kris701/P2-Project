//#region Header

var path = require('path');

var SSIC = require(path.join(__dirname, '..', './SimpleSensorInfo.js')).SSIC;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getSensorInfoQuery function', function () {

    this.timeout(10000);
    this.retries(3);

    GTC.shouldReturnArray(SSIC.getSensorInfoQuery());
});

//#endregion