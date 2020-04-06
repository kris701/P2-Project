var path = require('path');
var expect = require('chai').expect;

var AdminCall = require(path.join(__dirname, '..', './AdminCalls.js'));

describe('Get all WAS', function () {

    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllWarningsAndSolutions();
        expect(ReturnValue.Data).to.be.an('array');
    });
});

describe('Get all sensor types', function () {

    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllSensorTypes();
        expect(ReturnValue.Data).to.be.an('array');
    });
    it('Should include at least one sensor type', async function () {
        const AllSensorTypes = await AdminCall.ACC.adminGetAllSensorTypes();
        expect(AllSensorTypes.Data).to.have.length.above(0);
    });
});

describe('Add warning', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewWarning();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensortype does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewWarning(99999, "");
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove warning', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveWarning();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target warning ID is equal to the default warning', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveWarning(-1);
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target warning ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveWarning(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Update warning', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateWarning();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target warning ID is equal to the default warning', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateWarning(-1, "");
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target warning ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateWarning(-99999, "");
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Add solution', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddSolution();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target priority is outside of range', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddSolution(-1, -1, "");
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target warning ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddSolution(-99999, 0, "");
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove solution reference', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolutionReference();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target solution ID is equal to the default warning', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolutionReference(-1);
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target solution ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolutionReference(-99999, 0, "");
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Update solution', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSolution();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target solution ID is equal to the default warning', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSolution(-1, "");
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target solution ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSolution(-99999, "");
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Add existing solution', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSolution();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target solution ID is equal to the default solution', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSolution(-99999, 0);
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target solution ID or warning ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSolution(-99999, -99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove solution', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolution();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target solution ID is equal to the default solution', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolution(-1);
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target solution ID or warning ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSolution(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Get all solutions', function () {

    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllSolutions();
        expect(ReturnValue.Data).to.be.an('array');
    });
});

describe('Add new room', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewRoom();
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove Room', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveRoom();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target room ID is equal to the default solution', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveRoom(-1);
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target room ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveRoom(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Update Room', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateRoom();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target room ID is equal to the default solution', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateRoom(-1, "");
        expect(ReturnValue).to.be.equal(400);
    });

    it('Should fail if target room ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateRoom(-99999, "");
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Get all sensors', function () {
    it('Should return an array', async function () {
        const ReturnValue = await AdminCall.ACC.adminGetAllWarningsAndSolutions();
        expect(ReturnValue.Data).to.be.an('array');
    });
});

describe('Update Sensor', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensor();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target room ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensor(0, -99999);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensor(0, -99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Add new sensor', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewSensor();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target room ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewSensor(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove Sensor reference', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorReference();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID is the default sensor ID', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorReference(-1);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorReference(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove Sensor', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensor();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID is the default sensor ID', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensor(-1);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensor(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Add new Sensor type', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddNewSensorType();
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Add existing Sensor type', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSensorType();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if sensor type does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSensorType(-99999, 0, 0);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID is the default sensor ID', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSensorType(0, -1, 0);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminAddExistingSensorType(0, -99999, 0);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove Sensor type', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorType();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if sensor type does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorType(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Remove Sensor type reference', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorTypeReference();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if sensor type does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminRemoveSensorTypeReference(-99999);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Update sensor threshold', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensorTypeThreshold();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if sensor type does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensorTypeThreshold(-99999, 0, 0);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID is the default sensor ID', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensorTypeThreshold(0, -1, 0);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminUpdateSensorTypeThreshold(0, -99999, 0);
        expect(ReturnValue).to.be.above(399);
    });
});

describe('Insert sensor value', function () {
    it('Should fail with no parameters', async function () {
        const ReturnValue = await AdminCall.ACC.adminInsertSensorValue();
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if sensor type does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminInsertSensorValue(-99999, 0, 0);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID is the default sensor ID', async function () {
        const ReturnValue = await AdminCall.ACC.adminInsertSensorValue(0, -1, 0);
        expect(ReturnValue).to.be.above(399);
    });

    it('Should fail if target sensor ID does not exist', async function () {
        const ReturnValue = await AdminCall.ACC.adminInsertSensorValue(0, -99999, 0);
        expect(ReturnValue).to.be.above(399);
    });
});