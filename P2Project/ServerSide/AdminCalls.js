//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let RC = require(__dirname + "/ReturnCodes.js");

class WarningItem {
    constructor(warningID, sensorType, message, solutions) {
        this.warningID = warningID;
        this.sensorType = sensorType;
        this.message = message;
        this.solutions = solutions;
    }
}

class SolutionItem {
    constructor(solutionID, warningPriority, message) {
        this.solutionID = solutionID;
        this.warningPriority = warningPriority;
        this.message = message;
    }
}

class ReturnItem {
    constructor(data) {
        this.data = data;
    }
}

//#endregion

//#region Public

// Admin Call Class
module.exports.ACC = class {
    // Warning And Solutions Class
    static WASC = class {

        // Warnings
        static async getAllWarningsAndSolutions() {
            let returnItem = new ReturnItem([]);

            returnItem.data = await getAllWarningsQuery();

            return new BCC.retMSG(200, returnItem);
        }

        static async addNewWarning(sensorType, message) {
            if (sensorType == null || message == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorType, 10)) == typeof (0) && typeof (message) == typeof ("")) {
                let ret = await BCC.makeQuery("INSERT INTO Warnings (sensorType, message) values (?, ?)", [sensorType,message]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return  RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddWarning);
        }

        static async removeWarning(warningID) {
            if (warningID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(warningID, 10)) == typeof (0)) {
                if (warningID == 1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("UPDATE Solutions SET warningID=1 WHERE warningID=?", [warningID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
                ret = await BCC.makeQuery("DELETE FROM Warnings WHERE warningID=?", [warningID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            
            return RC.parseToRetMSG(RC.successCodes.RemoveWarning);
        }

        static async updateWarning(warningID, message) {
            if (warningID == null || message == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(warningID, 10)) == typeof (0) && typeof (message) == typeof ("")) {
                if (warningID == 1) 
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("UPDATE Warnings SET message=? WHERE warningID=?", [warningID,message]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            
            return RC.parseToRetMSG(RC.failCodes.UpdateWarning);
        }

        // Solutions
        static async addSolution(warningID, warningPriority, message) {
            if (warningID == null || warningPriority == null || message == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(warningID, 10)) == typeof (0) && typeof (parseInt(warningPriority, 10)) == typeof (0) && typeof (message) == typeof ("")) {
                if (warningPriority < 0 || warningPriority > 3)
                    return RC.parseToRetMSG(RC.failCodes.PriorityOutsideRange);

                let ret = await BCC.makeQuery("INSERT INTO Solutions (warningID, warningPriority, message) values (?, ?, ?)", [warningID, warningPriority, message]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(successCodes.AddSolution);
        }

        static async removeSolutionReference(solutionID) {
            if (solutionID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(solutionID, 10)) == typeof (0)) {
                if (solutionID == 1) 
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);
                
                let ret = await BCC.makeQuery("UPDATE Solutions SET warningID=1 WHERE solutionID=?", [solutionID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else 
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            
            return RC.parseToRetMSG(RC.successCodes.RemoveSolutionRef);
        }

        static async updateSolution(solutionID, message, warningPriority) {
            if (solutionID == null || message == null || warningPriority == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(solutionID, 10)) == typeof (0) && typeof (message) == typeof ("") && typeof (parseInt(warningPriority, 10)) == typeof (0)) {
                if (solutionID == 1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("UPDATE Solutions SET message=?, warningPriority=? WHERE solutionID=?",[message, solutionID, warningPriority]
                );
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.UpdateSolution);
        }

        static async addExistingSolution(solutionID, warningID) {
            if (solutionID == null || warningID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(solutionID, 10)) == typeof (0) && typeof (parseInt(warningID, 10)) == typeof (0)) {
                if (solutionID == 1) 
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("UPDATE Solutions SET warningID=? WHERE solutionID=?", [warningID, solutionID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddExistingSolution);
        }

        static async removeSolution(solutionID) {
            if (solutionID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(solutionID, 10)) == typeof (0)) {
                if (solutionID == 1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("DELETE FROM Solutions WHERE solutionID=?", [solutionID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSolution);
        }

        static async getAllSolutions() {
            let returnItem = new ReturnItem([]);

            let ret = await BCC.makeQuery("SELECT * FROM Solutions", []);
            if (BCC.isErrorCode(ret))
                return RC.parseToRetMSG(RC.failCodes.DatabaseError);

            await BCC.asyncForEach(ret.recordset, async function (v) {
                returnItem.data.push(v);
            });

            return new BCC.retMSG(RC.successCodes.GotAllSolutions, returnItem);
        }
    }

    // Sensor Edit Class
    static SEC = class {

        // Rooms
        static async addNewRoom(roomName) {
            if (roomName == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (roomName) == typeof ("")) {
                let ret = await BCC.makeQuery("INSERT INTO SensorRooms (roomName) values (?)", [roomName]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddRoom);
        }

        static async removeRoom(roomID) {
            if (roomID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(roomID, 10)) == typeof (0)) {
                if (roomID == 1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("DELETE FROM SensorRooms WHERE roomID=?", [roomID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveRoom);;
        }

        static async updateRoom(roomID, roomName) {
            if (roomID == null || roomName == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(roomID, 10)) == typeof (0) && typeof (roomName) == typeof ("")) {
                if (roomID == 1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("UPDATE SensorRooms SET roomName=? WHERE roomID=?", [roomName, roomID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.UpdateRoom);;
        }

        // Sensors
        static async getAllSensors() {
            let returnItem = new ReturnItem([]);

            let ret = await BCC.makeQuery("SELECT * FROM SensorInfo", []);
            if (BCC.isErrorCode(ret))
                return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            await BCC.asyncForEach(ret.recordset, async function (v) {
                returnItem.data.push(v);
            })

            return new BCC.retMSG(RC.successCodes.GotAllSensors, returnItem);
        }

        static async updateSensor(sensorID, roomID) {
            if (roomID == null || sensorID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorID, 10)) == typeof (0) && typeof (parseInt(roomID, 10)) == typeof (0)) {
                let ret = await BCC.makeQuery( "UPDATE SensorInfo SET roomID=? WHERE sensorID=?", [roomID, sensorID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.UpdateSensor);
        }

        static async addNewSensor(roomID) {
            if (roomID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(roomID, 10)) == typeof (0)) {
                let ret = await BCC.makeQuery("INSERT INTO SensorInfo (roomID) values (?)",[roomID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddSensor);
        }

        static async removeSensorReference(sensorID) {
            if (sensorID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorID, 10)) == typeof (0)) {
                let ret = await BCC.makeQuery("UPDATE SensorInfo SET roomID=1 WHERE sensorID=?", [sensorID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSensorRef);
        }

        static async removeSensor(sensorID) {
            if (sensorID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorID, 10)) == typeof (0)) {
                await removeSensorsFromValueTables(sensorID);
                let ret = await BCC.makeQuery("DELETE FROM SensorThresholds WHERE sensorID=?", [sensorID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
                ret = await BCC.makeQuery("DELETE FROM SensorInfo WHERE sensorID=?", [sensorID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else 
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSensor);
        }

        // Sensor Types
        static async getAllSensorTypes() {
            let returnItem = new ReturnItem([]);

            let ret = await BCC.makeQuery("SELECT * FROM SensorTypes", []);
            if (BCC.isErrorCode(ret))
                return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            await BCC.asyncForEach(ret.recordset, async function (v) {
                if (v.sensorType != 1)
                    returnItem.data.push(v);
            })

            return new BCC.retMSG(RC.successCodes.GotAllSensorTypes, returnItem);
        }

        static async getAllThresholdValues() {
            let returnItem = new ReturnItem([]);

            let ret = await BCC.makeQuery("SELECT * FROM SensorThresholds", []);
            if (BCC.isErrorCode(ret))
                return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            await BCC.asyncForEach(ret.recordset, async function (v) {
                if (v.sensorType != 1)
                    returnItem.data.push(v);
            })

            return new BCC.retMSG(RC.successCodes.GotAllSensorTypeValues, returnItem);
        }

        static async addNewSensorType(typeName) {
            if (typeName == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (typeName) == typeof ("")) {
                let ret = await BCC.makeQuery("INSERT INTO SensorTypes (typeName) values (?)", [typeName]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddSensorType);
        }

        static async addExistingSensorType(sensorType, sensorID, threshold) {
            if (sensorType == null || sensorID == null || threshold == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorType, 10)) == typeof (0) && typeof (parseInt(sensorID, 10)) == typeof (0) && typeof (parseInt(threshold, 10)) == typeof (0)) {
                let ret = await BCC.makeQuery(
                    "INSERT INTO SensorThresholds (sensorID, sensorType, thresholdValue) VALUES (?, ?, ?)",
                    [sensorID, sensorType, threshold]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddExistingSensorType);
        }

        static async removeSensorType(sensorType) {
            if (sensorType == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorType, 10)) == typeof (0)) {
                if (sensorType == 1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("DELETE FROM SensorTypes WHERE sensorType=?", [sensorType]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSensorType);
        }

        static async removeSensorTypeReference(sensorType, sensorID) {
            if (sensorType == null || sensorID == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorType, 10)) == typeof (0) && typeof (parseInt(sensorID, 10)) == typeof (0)) {
                let ret = await BCC.makeQuery("DELETE FROM SensorThresholds WHERE sensorType=? AND sensorID=?", [sensorType, sensorID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else 
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSensorTypeRef);
        }

        static async updateSensorTypeThreshold(sensorID, sensorType, threshold) {
            if (sensorID == null || sensorType == null || threshold == null)
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            if (typeof (parseInt(sensorID, 10)) == typeof (0) && typeof (parseInt(sensorType, 10)) == typeof (0) && typeof (parseInt(threshold, 10)) == typeof (0)) {
                let ret = await BCC.makeQuery(
                    "UPDATE SensorThresholds SET thresholdValue=? WHERE sensorID=? AND sensorType=?",
                    [threshold, sensorID, sensorType]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else 
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.UpdateSensorTypeThreshold);
        }
    }

    static async insertSensorValue(sensorID, sensorType, sensorValue) {
        if (sensorID == null || sensorType == null || sensorValue == null)
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (parseInt(sensorID, 10)) == typeof (0) && typeof (parseInt(sensorType, 10)) == typeof (0) && typeof (parseInt(sensorValue, 10)) == typeof (0)) {
            let ret = await BCC.makeQuery("SELECT typeName FROM SensorTypes WHERE sensorType=?", [sensorType]);
            if (BCC.isErrorCode(ret))
                return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            ret = await BCC.makeQuery(
                "INSERT INTO SensorValue_" + ret + " (sensorID, sensorValue) values (?, ?)", [sensorID, sensorValue]);
            if (BCC.isErrorCode(ret))
                return RC.parseToRetMSG(RC.failCodes.DatabaseError);
        }
        else 
            return RC.parseToRetMSG(RC.failCodes.NoParameters);

        return RC.parseToRetMSG(RC.successCodes.InsertSensorValue);
    }

    static async checkCredentials(username, password) {
        if (username == null || password == null)
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (username) == typeof (" ") && typeof (password) == typeof (" ")) {
            let ret = await BCC.makeQuery("SELECT * FROM AdminCredentials WHERE username=? AND password=?", [username, password]);
            if (BCC.isErrorCode(ret))
                return false;

            if (ret.recordset.length != 0)
                return true;
        }
        else
            return false;

        return false;
    }
}

//#endregion

//#region Private

async function getAllWarningsQuery() {
    let result = [];

    let queryTable = await BCC.makeQuery("SELECT * FROM Warnings", []);
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        if (v.warningID != 1) {
            let solutionItems = await getAllSolutionsForAWarning(v.warningID);
            let warningItem = new WarningItem(v.warningID, v.sensorType, v.message, solutionItems);
            result.push(warningItem);
        }
    });

    return result;
}

async function getAllSolutionsForAWarning(warningID) {
    let result = [];

    let queryTable = await BCC.makeQuery("SELECT * FROM Solutions WHERE warningID=?", [warningID]);
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItem = new SolutionItem(v.solutionID, v.warningPriority, v.message);
        result.push(solutionItem);
    });

    return result;
}

async function removeSensorsFromValueTables(sensorID) {
    let sensorTypes = await BCC.makeQuery("SELECT * FROM SensorTypes", []);
    await BCC.asyncForEach(sensorTypes, async function (v) {
        if (v.SensorType != 1) {
            await BCC.makeQuery("DELETE FROM SensorValue_" + v.TypeName + " WHERE sensorID=?", [sensorID]);
        }
    });
}

//#endregion
