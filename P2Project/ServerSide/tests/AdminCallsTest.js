/*
    =========================
            Header
    =========================
*/

var path = require('path');
var expect = require('chai').expect;

var AdminCall = require(path.join(__dirname, '..', './AdminCalls.js'));
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;

/*
    =========================
          Testing code
    =========================
*/

describe('adminGetAllWarningsAndSolutions function', function () {

    this.timeout(20000);

    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllWarningsAndSolutions();
        expect(ReturnValue.Data).to.be.an('array');
    });
});

describe('adminGetAllSensorTypes function', function () {

    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllSensorTypes();
        expect(ReturnValue.Data).to.be.an('array');
    });
    it('Should include at least one sensor type', async function () {
        const AllSensorTypes = await AdminCall.ACC.adminGetAllSensorTypes();
        expect(AllSensorTypes.Data).to.have.length.above(0);
    });
});

describe('adminAddNewWarning function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewWarning();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if target sensortype does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminAddNewWarning(99999, "");
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminRemoveWarning function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveWarning();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target warning ID is equal to the default warning', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveWarning(-1);
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target warning ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveWarning(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminUpdateWarning function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateWarning();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target warning ID is equal to the default warning', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateWarning(-1, "");
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target warning ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminUpdateWarning(-99999, "");
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminAddSolution function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddSolution();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target priority is outside of range', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddSolution(-1, -1, "");
        expect(ReturnValue).to.be.equal(failCodes.PriorityOutsideRange);
    });

    //it('Should fail if target warning ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminAddSolution(-99999, 0, "");
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminRemoveSolutionReference function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolutionReference();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target solution ID is equal to the default warning', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolutionReference(-1);
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target solution ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveSolutionReference(-99999, 0, "");
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminUpdateSolution function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSolution();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target solution ID is equal to the default solution', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSolution(-1, "", 0);
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target solution ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminUpdateSolution(-99999, "");
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminAddExistingSolution function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSolution();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target solution ID is equal to the default solution', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSolution(-1, 0);
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target solution ID or warning ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminAddExistingSolution(-99999, -99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminRemoveSolution function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolution();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target solution ID is equal to the default solution', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolution(-1);
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target solution ID or warning ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveSolution(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminGetAllSolutions function', function () {

    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllSolutions();
        expect(ReturnValue.Data).to.be.an('array');
    });
});

describe('adminAddNewRoom function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewRoom();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });
});

describe('adminRemoveRoom function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveRoom();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target room ID is equal to the default room', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveRoom(-1);
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target room ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveRoom(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminUpdateRoom function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateRoom();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    it('Should fail if target room ID is equal to the default room', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateRoom(-1, "");
        expect(ReturnValue).to.be.equal(failCodes.TargetIsDefaultID);
    });

    //it('Should fail if target room ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminUpdateRoom(-99999, "");
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminGetAllWarningsAndSolutions function', function () {
    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllWarningsAndSolutions();
        expect(ReturnValue.Data).to.be.an('array');
    });
});

describe('adminUpdateSensor function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensor();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if target room ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminUpdateSensor(0, -99999);
    //    expect(ReturnValue).to.be.above(399);
    //});

    //it('Should fail if target sensor ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminUpdateSensor(0, -99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminAddNewSensor function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewSensor();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if target room ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminAddNewSensor(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminRemoveSensorReference function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorReference();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if target sensor ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveSensorReference(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminRemoveSensor function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensor();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if target sensor ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveSensor(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminAddNewSensorType function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewSensorType();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });
});

describe('adminAddExistingSensorType function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSensorType();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if sensor type does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminAddExistingSensorType(-99999, 0, 0);
    //    expect(ReturnValue).to.be.above(399);
    //});

    //it('Should fail if target sensor ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminAddExistingSensorType(0, -99999, 0);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminRemoveSensorType function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorType();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if sensor type does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveSensorType(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminRemoveSensorTypeReference function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorTypeReference();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if sensor type does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminRemoveSensorTypeReference(-99999);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminUpdateSensorTypeThreshold function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensorTypeThreshold();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if sensor type does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminUpdateSensorTypeThreshold(-99999, 0, 0);
    //    expect(ReturnValue).to.be.above(399);
    //});

    //it('Should fail if target sensor ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminUpdateSensorTypeThreshold(0, -99999, 0);
    //    expect(ReturnValue).to.be.above(399);
    //});
});

describe('adminInsertSensorValue function', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminInsertSensorValue();
        expect(ReturnValue).to.be.equal(failCodes.NoParameters);
    });

    //it('Should fail if sensor type does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminInsertSensorValue(-99999, 0, 0);
    //    expect(ReturnValue).to.be.above(399);
    //});

    //it('Should fail if target sensor ID does not exist', async function () {
    //    const ReturnValue = await AdminCall.ACC.adminInsertSensorValue(0, -99999, 0);
    //    expect(ReturnValue).to.be.above(399);
    //});
});