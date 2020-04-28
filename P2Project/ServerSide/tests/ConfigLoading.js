//#region Header

var path = require('path');

var CLC = require(path.join(__dirname, '..', './ConfigLoading.js')).CLC;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('getServerConfiguration function', function () {

    this.timeout(10000);
    this.retries(3);

    GTC.shouldReturnObject(CLC.getServerConfiguration());
});

describe('checkForConfigUpdate function', function () {

    this.timeout(10000);
    this.retries(3);

    GTC.shouldFailWithnoParametersSimple(CLC.checkForConfigUpdate());
    GTC.shouldReturnADateObject(CLC.checkForConfigUpdate(new Date()));
});

//#endregion