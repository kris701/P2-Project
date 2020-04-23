//#region Header

var path = require('path');

var LDC = require(path.join(__dirname, '..', './LiveData.js')).LDC;
var successCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).successCodes;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getLiveData function', function () {

    this.timeout(10000);
    this.retries(3);

    GTC.shouldFailWithNoParameters(LDC.getLiveData());
    GTC.shouldReturnArrayDotData(LDC.getLiveData(0, "2020-04-20T00:00:00"));

    GTC.shouldNotReturnCodeWithInput(LDC.getLiveData([], 0), successCodes.GotLiveData);
    GTC.shouldNotReturnCodeWithInput(LDC.getLiveData(0, []), successCodes.GotLiveData);

});

//#endregion