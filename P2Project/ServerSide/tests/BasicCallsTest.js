//#region Header

var path = require('path');
var expect = require('chai').expect;

var BasicCalls = require(path.join(__dirname, '..', './BasicCalls.js'));
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var generalTests = require("./GeneralTests.js").GTC;

//#endregion

//#region Tests

describe('asyncForEach function', function () {

    it('Should be async', async function () {
        let list = [1, 2, 3, 4, 5];
        let outlist = [];
        let res = await BasicCalls.BCC.asyncForEach(list, async function (v) {
            outlist.push(v);
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        outlist.push(6);
        list.push(6);

        expect(outlist).to.eql(list);
        expect(res).to.not.eql(failCodes.InputNotAnArray);
    });

    generalTests.ExpectErrorCodeFromInputSimple('Should fail if input is not an array', BasicCalls.BCC.asyncForEach("abc", async function (v) { }), failCodes.InputNotAnArray);
});

describe('MakeQuery function', function () {
    generalTests.ShouldFailWithToParametersSimple(BasicCalls.BCC.MakeQuery(), failCodes.NoParameters);
    generalTests.ExpectErrorCodeFromInputSimple('Should fail if querytext not a string', BasicCalls.BCC.MakeQuery(-99999, []), failCodes.InputNotAString);
    generalTests.ExpectErrorCodeFromInputSimple('Should fail with no querytext', BasicCalls.BCC.MakeQuery("", []), failCodes.EmptyString);
    generalTests.ExpectErrorCodeFromInputSimple('Should fail if Input is not an array', BasicCalls.BCC.MakeQuery("some text", "some text"), failCodes.InputNotAnArray);
});

//#endregion
