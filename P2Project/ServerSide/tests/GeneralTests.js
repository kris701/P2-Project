//#region Header

var expect = require('chai').expect;

//#endregion

//#region Tests

// General Tests Class
module.exports.GTC = class {
    static shouldFailWithToParameters(functionCall, returnCode) {
        it('Should fail with no paramteres, by returning code ' + returnCode, async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(returnCode);
        });
    }

    static shouldFailWithToParametersSimple(functionCall, returnCode) {
        it('Should fail with no paramteres, by returning code ' + returnCode, async function () {
            let returnValue = await functionCall;
            expect(returnValue).to.be.equal(returnCode);
        });
    }

    static shouldReturnArray(functionCall) {
        it('Should return an array', async function () {
            let returnValue = await functionCall;
            expect(returnValue.message).to.be.an('array');
        });
    }

    static shouldReturnArrayDotData(functionCall) {
        it('Should return an array', async function () {
            let returnValue = await functionCall;
            expect(returnValue.message.data).to.be.an('array');
        });
    }

    static outputArrayMustBeLargerThanDotData(functionCall, largerThan) {
        it('Return array should be larger than ' + largerThan, async function () {
            let returnValue = await functionCall;
            expect(returnValue.message.data).to.have.length.above(largerThan);
        });
    }

    static shouldFailIfTargetIDIsDefaultID(functionCall, defaultID, returnCode) {
        it('Should fail if target id is equal to default id: ' + defaultID + ' and return error code ' + returnCode, async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(returnCode);
        });
    }

    static expectErrorCodeFromInput(expectText, functionCall, returnCode) {
        it('Expect code(' + returnCode + '): ' + expectText, async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(returnCode);
        });
    }

    static expectErrorCodeFromInputSimple(expectText, functionCall, returnCode) {
        it('Expect code(' + returnCode + '): ' + expectText, async function () {
            let returnValue = await functionCall;
            expect(returnValue).to.be.equal(returnCode);
        });
    }

    static shouldReturnDatabaseErrorWithInput(functionCall, returnCode) {
        it('Should return DB error with wrong input', async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(returnCode);
        });
    }

    static shouldNotReturnOKCodeIfInputIsWrong(functionCall, returnCode) {
        it('Should not return OK code if input is wrong', async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).not.to.be.equal(returnCode);
        });
    }
}

//#endregion