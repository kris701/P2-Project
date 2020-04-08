var path = require('path');
var expect = require('chai').expect;

var BasicCalls = require(path.join(__dirname, '..', './BasicCalls.js'));

describe('Async foreach', function () {

    it('Should be async', async function () {
        let list = [1, 2, 3, 4, 5];
        let outlist = [];
        await BasicCalls.BCC.asyncForEach(list, async function (v) {
            outlist.push(v);
            await new Promise(resolve => setTimeout(resolve, 100));
        });
        outlist.push(6);
        list.push(6);

        expect(outlist).to.eql(list);
    });
});

describe('MakeQuery function', function () {

    it('Should fail with no parameters', async function () {
        const ReturnValue = await BasicCalls.BCC.MakeQuery();
        expect(ReturnValue).to.be.equal("err");
    });

    it('Should fail with no querytext', async function () {
        const ReturnValue = await BasicCalls.BCC.MakeQuery("", []);
        expect(ReturnValue).to.be.equal("err");
    });

    it('Should fail with wrong parameters', async function () {
        const ReturnValue = await BasicCalls.BCC.MakeQuery([1, 4], "some text");
        expect(ReturnValue).to.be.equal("err");
    });
});
