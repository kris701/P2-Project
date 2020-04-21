//#region Header

var path = require('path');
var expect = require('chai').expect;

var BCC = require(path.join(__dirname, '..', './BasicCalls.js')).BCC;
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var GTC = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('asyncForEach function', function () {

    it('Should be async', async function () {
        let list = [1, 2, 3, 4, 5];
        let outlist = [];
        let res = await BCC.asyncForEach(list, async function (v) {
            outlist.push(v);
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        outlist.push(6);
        list.push(6);

        expect(outlist).to.eql(list);
        expect(res).to.not.eql(failCodes.InputNotAnArray);
    });

    GTC.expectErrorCodeFromInputSimple('Should fail if input is not an array', BCC.asyncForEach("abc", async function (v) { }), failCodes.InputNotAnArray);
});

describe('makeQuery function', function () {
    GTC.shouldFailWithnoParametersSimple(BCC.makeQuery());
    GTC.expectErrorCodeFromInputSimple('Should fail if querytext not a string', BCC.makeQuery(-99999, []), failCodes.InputNotAString);
    GTC.expectErrorCodeFromInputSimple('Should fail with no querytext', BCC.makeQuery("", []), failCodes.EmptyString);
    GTC.expectErrorCodeFromInputSimple('Should fail if Input is not an array', BCC.makeQuery("some text", "some text"), failCodes.InputNotAnArray);
});

//#endregion
