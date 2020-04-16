
var expect = require('chai').expect;

// General Tests Class
module.exports.GTC = class {
    static ShouldFailWithToParameters(functionCall, returnCode) {
        it('Should fail with no paramteres, by returning code ' + returnCode, async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.ReturnCode).to.be.equal(returnCode);
        });
    }

    static ShouldFailWithToParametersSimple(functionCall, returnCode) {
        it('Should fail with no paramteres, by returning code ' + returnCode, async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue).to.be.equal(returnCode);
        });
    }

    static ShouldReturnArray(functionCall) {
        it('Should return an array', async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.Message).to.be.an('array');
        });
    }

    static ShouldReturnArrayDotData(functionCall) {
        it('Should return an array', async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.Message.Data).to.be.an('array');
        });
    }

    static OutputArrayMustBeLargerThanDotData(functionCall, largerThan) {
        it('Return array should be larger than ' + largerThan, async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.Message.Data).to.have.length.above(largerThan);
        });
    }

    static ShouldFailIfTargetIDIsDefaultID(functionCall, defaultID, returnCode) {
        it('Should fail if target id is equal to default id: ' + defaultID + ' and return error code ' + returnCode, async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.ReturnCode).to.be.equal(returnCode);
        });
    }

    static ExpectErrorCodeFromInput(expectText, functionCall, returnCode) {
        it('Expect code(' + returnCode + '): ' + expectText, async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.ReturnCode).to.be.equal(returnCode);
        });
    }

    static ExpectErrorCodeFromInputSimple(expectText, functionCall, returnCode) {
        it('Expect code(' + returnCode + '): ' + expectText, async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue).to.be.equal(returnCode);
        });
    }

    static ShouldReturnDatabaseErrorWithInput(functionCall, returnCode) {
        it('Should return DB error with wrong input', async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.ReturnCode).to.be.equal(returnCode);
        });
    }

    static ShouldNotReturnOKCodeIfInputIsWrong(functionCall, returnCode) {
        it('Should not return OK code if input is wrong', async function () {
            let ReturnValue = await functionCall;
            expect(ReturnValue.ReturnCode).not.to.be.equal(returnCode);
        });
    }
}