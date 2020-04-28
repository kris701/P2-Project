//#region Header

var expect = require('chai').expect;
var path = require('path');
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;

//#endregion

//#region Tests

// General Tests Class
module.exports.GTC = class {
    static shouldFailWithNoParameters(functionCall) {
        it('( ' + failCodes.NoParameters + ' ) Should fail with no paramteres', async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(failCodes.NoParameters);
        });
    }

    static shouldFailWithnoParametersSimple(functionCall) {
        it('( ' + failCodes.NoParameters + ' ) Should fail with no paramteres', async function () {
            let returnValue = await functionCall;
            expect(returnValue).to.be.equal(failCodes.NoParameters);
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

    static shouldReturnObject(functionCall) {
        it('Should return an object', async function () {
            let returnValue = await functionCall;
            expect(returnValue).to.be.an('object');
        });
    }

    static shouldReturnADateObject(functionCall) {
        it('Should return a Date object', async function () {
            let returnValue = await functionCall;
            expect(returnValue).to.be.an('Date');
        });
    }

    static outputArrayMustBeLargerThanDotData(functionCall, largerThan) {
        it('Return array should be larger than ' + largerThan, async function () {
            let returnValue = await functionCall;
            expect(returnValue.message.data).to.have.length.above(largerThan);
        });
    }

    static shouldFailIfTargetIDIsDefaultID(functionCall, defaultID) {
        it('( ' + failCodes.TargetIsDefaultID + ' ) Should fail if target id is equal to default id: ' + defaultID, async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(failCodes.TargetIsDefaultID);
        });
    }

    static expectErrorCodeFromInput(expectText, functionCall, returnCode) {
        it('( ' + returnCode + ' ) ' + expectText, async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(returnCode);
        });
    }

    static expectErrorCodeFromInputSimple(expectText, functionCall, returnCode) {
        it('( ' + returnCode + ' ) ' + expectText, async function () {
            let returnValue = await functionCall;
            expect(returnValue).to.be.equal(returnCode);
        });
    }

    static shouldReturnDatabaseErrorWithInput(functionCall) {
        it('( ' + failCodes.DatabaseError + ' ) Should return DB error with wrong input', async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).to.be.equal(failCodes.DatabaseError);
        });
    }

    static shouldNotReturnCodeWithInput(functionCall, returnCode) {
        it('( ' + returnCode + ' ) Should not return OK code if input is wrong', async function () {
            let returnValue = await functionCall;
            expect(returnValue.returnCode).not.to.be.equal(returnCode);
        });
    }
}

//#endregion