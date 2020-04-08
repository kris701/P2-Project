/*
    =========================
            Header
    =========================
*/

var path = require('path');
var expect = require('chai').expect;

var BasicCalls = require(path.join(__dirname, '..', './BasicCalls.js'));
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;

/*
    =========================
          Testing code
    =========================
*/

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

    it('Should fail if input is not an array', async function () {
        let res = await BasicCalls.BCC.asyncForEach("abc", async function (v) {

        });
        expect(res).to.be.equal(failCodes.InputNotAnArray);
    });
});

describe('MakeQuery function', function () {

    it('Should fail with no parameters', async function () {
        const ReturnValue = await BasicCalls.BCC.MakeQuery();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if querytext not a string', async function () {
        const ReturnValue = await BasicCalls.BCC.MakeQuery(-99999, []);
        expect(ReturnValue).to.be.equal(failCodes.InputNotAString);
    });

    it('Should fail with no querytext', async function () {
        const ReturnValue = await BasicCalls.BCC.MakeQuery("", []);
        expect(ReturnValue).to.be.equal(failCodes.EmptyString);
    });

    it('Should fail if Input is not an array', async function () {
        const ReturnValue = await BasicCalls.BCC.MakeQuery("some text", "some text");
        expect(ReturnValue).to.be.equal(failCodes.InputNotAnArray);
    });
});
