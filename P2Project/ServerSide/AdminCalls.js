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
            if (typeof (sensorType) == typeof (0) && typeof (message) == typeof ("")) {
                let ret = await BCC.makeQuery("INSERT INTO Warnings (sensorType, message) values (?, ?)", [sensorType,message]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return  RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddWarning);
        }

        static async removeWarning(warningID) {
            if (typeof (warningID) == typeof (0)) {
                if (warningID == -1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("UPDATE Solutions SET warningID=-1 WHERE warningID=?", [warningID]);
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
            if (typeof (warningID) == typeof (0) && typeof (message) == typeof ("")) {
                if (warningID == -1) 
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
            if (typeof (warningID) == typeof (0) && typeof (warningPriority) == typeof (0) && typeof (message) == typeof ("")) {
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
            if (typeof (solutionID) == typeof (0)) {
                if (solutionID == -1) 
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);
                
                let ret = await BCC.makeQuery("UPDATE Solutions SET warningID=-1 WHERE solutionID=?", [solutionID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else 
                return RC.parseToRetMSG(RC.failCodes.NoParameters);
            
            return RC.parseToRetMSG(RC.successCodes.RemoveSolutionRef);
        }

        static async updateSolution(solutionID, message, warningPriority) {
            if (typeof (solutionID) == typeof (0) && typeof (message) == typeof ("") && typeof (warningPriority) == typeof (0)) {
                if (solutionID == -1)
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
            if (typeof (solutionID) == typeof (0) && typeof (warningID) == typeof (0)) {
                if (solutionID == -1) 
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
            if (typeof (solutionID) == typeof (0)) {
                if (solutionID == -1)
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

            return new BCC.retMSG(200, returnItem);
        }
    }

    // Sensor Edit Class
    static SEC = class {

        // Rooms
        static async addNewRoom(roomName) {
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
            if (typeof (roomID) == typeof (0)) {
                if (roomID == -1)
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
            if (typeof (roomID) == typeof (0) && typeof (roomName) == typeof ("")) {
                if (roomID == -1)
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

            return RC.parseToRetMSG(-1, returnItem);
        }

        static async updateSensor(sensorID, roomID) {
            if (typeof (sensorID) == typeof (0) && typeof (roomID) == typeof (0)) {
                let ret = await BCC.makeQuery( "UPDATE SensorInfo SET roomID=? WHERE sensorID=?", [roomID, sensorID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.UpdateSensor);
        }

        static async addNewSensor(roomID) {
            if (typeof (roomID) == typeof (0)) {
                let ret = await BCC.makeQuery("INSERT INTO SensorInfo (roomID) values (?)",[roomID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddSensor);
        }

        static async removeSensorReference(sensorID) {
            if (typeof (sensorID) == typeof (0)) {
                let ret = await BCC.makeQuery("UPDATE SensorInfo SET roomID=-1 WHERE sensorID=?", [sensorID]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSensorRef);
        }

        static async removeSensor(sensorID) {
            if (typeof (sensorID) == typeof (0)) {
                await removeSensorsFromValueTables(sensorID);
                let ret = await BCC.makeQuery("DELETE SensorThresholds WHERE sensorID=?", [sensorID]);
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
                returnItem.data.push(v);
            })

            return new BCC.retMSG(200, returnItem);
        }

        static async addNewSensorType(typeName) {
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
            if (typeof (sensorType) == typeof (0) && typeof (sensorID) == typeof (0) && typeof (threshold) == typeof (0)) {
                let ret = await BCC.makeQuery(
                    "INSERT INTO SensorThresholds (sensorID, sensorType, thresholdValue) values (?, ?, ?)",
                    [sensorID, sensorType, threshold]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.AddExistingSensorType);
        }

        static async removeSensorType(sensorType) {
            if (typeof (sensorType) == typeof (0)) {
                if (sensorType == -1)
                    return RC.parseToRetMSG(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.makeQuery("DELETE FROM SensorTypes WHERE sensorType=?", [sensorType]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSensorType);
        }

        static async removeSensorTypeReference(sensorType) {
            if (typeof (sensorType) == typeof (0)) {
                let ret = await BCC.makeQuery("DELETE FROM SensorThresholds WHERE sensorType=?", [sensorType]);
                if (BCC.isErrorCode(ret))
                    return RC.parseToRetMSG(RC.failCodes.DatabaseError);
            }
            else 
                return RC.parseToRetMSG(RC.failCodes.NoParameters);

            return RC.parseToRetMSG(RC.successCodes.RemoveSensorTypeRef);
        }

        static async updateSensorTypeThreshold(sensorID, sensorType, threshold) {
            if (typeof (sensorID) == typeof (0) && typeof (sensorType) == typeof (0) && typeof (threshold) == typeof (0)) {
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
        if (typeof (sensorID) == typeof (0) && typeof (sensorType) == typeof (0) && typeof (sensorValue) == typeof (0)) {
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
}

//#endregion

//#region Private

async function getAllWarningsQuery() {
    let result = [];

    let queryTable = await BCC.makeQuery("SELECT * FROM Warnings", []);
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItems = await getAllSolutionsForAWarning(v.warningID);
        let warningItem = new WarningItem(v.warningID, v.sensorType, v.message, solutionItems);
        result.push(warningItem);
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
        if (v.SensorType != -1) {
            await BCC.makeQuery("DELETE FROM SensorValue_" + v.TypeName + " WHERE sensorID=?", [sensorID]);
        }
    });
}

//#endregion
