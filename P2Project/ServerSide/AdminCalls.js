//#region Header

const sql = require("mssql");
let BCC = require(__dirname + "/BasicCalls.js").BCC;
let RC = require(__dirname + "/ReturnCodes.js");

class WarningItem {
    constructor(WarningID, SensorType, Message, Solutions) {
        this.WarningID = WarningID;
        this.SensorType = SensorType;
        this.Message = Message;
        this.Solutions = Solutions;
    }
}

class SolutionItem {
    constructor(SolutionID, WarningPriority, Message) {
        this.SolutionID = SolutionID;
        this.WarningPriority = WarningPriority;
        this.Message = Message;
    }
}

class ReturnItem {
    constructor(Data) {
        this.Data = Data;
    }
}

//#endregion

//#region Public

// Admin Call Class
module.exports.ACC = class {
    // Warning And Solutions Class
    static WASC = class {

        // Warnings
        static async adminGetAllWarningsAndSolutions() {
            let returnItem = new ReturnItem([]);

            returnItem.Data = await getAllWarningsQuery();

            return new BCC.ReturnMessage(200, returnItem);
        }

        static async adminAddNewWarning(sensorType, message) {
            if (typeof (sensorType) == typeof (0) && typeof (message) == typeof ("")) {
                let ret = await BCC.MakeQuery(
                    "INSERT INTO [Warnings] (SensorType, Message) values (@sensorTypeInput, @messageInput)",
                    [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType),
                    new BCC.QueryValue("messageInput", sql.NVarChar(50), message)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return  RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.AddWarning);
        }

        static async adminRemoveWarning(warningID) {
            if (typeof (warningID) == typeof (0)) {
                if (warningID == -1)
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery("UPDATE [Solutions] SET [WarningID]=-1 WHERE [WarningID]=@warningIDInput", [new BCC.QueryValue("warningIDInput", sql.Int, warningID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
                ret = await BCC.MakeQuery("DELETE FROM [Warnings] WHERE [WarningID]=@warningIDInput", [new BCC.QueryValue("warningIDInput", sql.Int, warningID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);
            
            return RC.ParseToReturnMessage(RC.successCodes.RemoveWarning);
        }

        static async adminUpdateWarning(warningID, message) {
            if (typeof (warningID) == typeof (0) && typeof (message) == typeof ("")) {
                if (warningID == -1) 
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery(
                    "UPDATE [Warnings] SET [Message]=@messageInput WHERE [WarningID]=@warningIDInput",
                    [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
                    new BCC.QueryValue("messageInput", sql.NVarChar(50), message)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);
            
            return RC.ParseToReturnMessage(RC.failCodes.UpdateWarning);
        }

        // Solutions
        static async adminAddSolution(warningID, warningPriority, message) {
            if (typeof (warningID) == typeof (0) && typeof (warningPriority) == typeof (0) && typeof (message) == typeof ("")) {
                if (warningPriority < 0 || warningPriority > 3)
                    return RC.ParseToReturnMessage(RC.failCodes.PriorityOutsideRange);

                let ret = await BCC.MakeQuery(
                    "INSERT INTO [Solutions] (WarningID, WarningPriority, Message) values (@warningIDInput, @warningPriorityInput, @messageInput)",
                    [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
                    new BCC.QueryValue("warningPriorityInput", sql.Int, warningPriority),
                    new BCC.QueryValue("messageInput", sql.NVarChar(50), message)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(successCodes.AddSolution);
        }

        static async adminRemoveSolutionReference(solutionID) {
            if (typeof (solutionID) == typeof (0)) {
                if (solutionID == -1) 
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);
                
                let ret = await BCC.MakeQuery("UPDATE [Solutions] SET [WarningID]=-1 WHERE [SolutionID]=@solutionIDInput", [new BCC.QueryValue("solutionIDInput", sql.Int, solutionID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else 
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);
            
            return RC.ParseToReturnMessage(RC.successCodes.RemoveSolutionRef);
        }

        static async adminUpdateSolution(solutionID, message, warningPriority) {
            if (typeof (solutionID) == typeof (0) && typeof (message) == typeof ("") && typeof (warningPriority) == typeof (0)) {
                if (solutionID == -1)
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery(
                    "UPDATE [Solutions] SET [Message]=@messageInput, [WarningPriority]=@priorityInput WHERE [SolutionID]=@solutionIDInput",
                    [new BCC.QueryValue("messageInput", sql.NVarChar(50), message),
                    new BCC.QueryValue("solutionIDInput", sql.Int, solutionID),
                    new basicCalls.QueryValue("priorityInput", sql.Int, warningPriority)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.UpdateSolution);
        }

        static async adminAddExistingSolution(solutionID, warningID) {
            if (typeof (solutionID) == typeof (0) && typeof (warningID) == typeof (0)) {
                if (solutionID == -1) 
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery(
                    "UPDATE [Solutions] SET [WarningID]=@warningIDInput WHERE [SolutionID]=@solutionIDInput",
                    [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
                    new BCC.QueryValue("solutionIDInput", sql.Int, solutionID)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.AddExistingSolution);
        }

        static async adminRemoveSolution(solutionID) {
            if (typeof (solutionID) == typeof (0)) {
                if (solutionID == -1)
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery("DELETE FROM [Solutions] WHERE [SolutionID]=@solutionIDInput", [new BCC.QueryValue("solutionIDInput", sql.Int, solutionID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.RemoveSolution);
        }

        static async adminGetAllSolutions() {
            let returnItem = new ReturnItem([]);

            let ret = await BCC.MakeQuery("SELECT * FROM [Solutions]", []);
            if (BCC.IsErrorCode(ret))
                return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);

            await BCC.asyncForEach(ret.recordset, async function (v) {
                returnItem.Data.push(v);
            });

            return new BCC.ReturnMessage(200, returnItem);
        }
    }

    // Sensor Edit Class
    static SEC = class {

        // Rooms
        static async adminAddNewRoom(roomName) {
            if (typeof (roomName) == typeof ("")) {
                let ret = await BCC.MakeQuery("INSERT INTO [SensorRooms] (RoomName) values (@roomNameInput)", [new BCC.QueryValue("roomNameInput", sql.NVarChar(50), roomName)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.AddRoom);
        }

        static async adminRemoveRoom(roomID) {
            if (typeof (roomID) == typeof (0)) {
                if (roomID == -1)
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery("DELETE FROM [SensorRooms] WHERE [RoomID]=@roomIDInput", [new BCC.QueryValue("roomIDInput", sql.Int, roomID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.RemoveRoom);;
        }

        static async adminUpdateRoom(roomID, roomName) {
            if (typeof (roomID) == typeof (0) && typeof (roomName) == typeof ("")) {
                if (roomID == -1)
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery(
                    "UPDATE [SensorRooms] SET [RoomName]=@roomNameInput WHERE [RoomID]=@roomIDInput",
                    [new BCC.QueryValue("roomNameInput", sql.NVarChar(50), roomName),
                    new BCC.QueryValue("roomIDInput", sql.Int, roomID)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.UpdateRoom);;
        }

        // Sensors
        static async adminGetAllSensors() {
            let returnItem = new ReturnItem([]);

            let ret = await BCC.MakeQuery("SELECT * FROM [SensorInfo]", []);
            if (BCC.IsErrorCode(ret))
                return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            await BCC.asyncForEach(ret.recordset, async function (v) {
                returnItem.Data.push(v);
            })

            return RC.ParseToReturnMessage(-1, returnItem);
        }

        static async adminUpdateSensor(sensorID, roomID) {
            if (typeof (sensorID) == typeof (0) && typeof (roomID) == typeof (0)) {
                let ret = await BCC.MakeQuery(
                    "UPDATE [SensorInfo] SET [RoomID]=@roomIDInput WHERE [SensorID]=@sensorIDInput",
                    [new BCC.QueryValue("roomIDInput", sql.Int, roomID),
                    new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.UpdateSensor);
        }

        static async adminAddNewSensor(roomID) {
            if (typeof (roomID) == typeof (0)) {
                let ret = await BCC.MakeQuery(
                    "INSERT INTO [SensorInfo] (RoomID) values (@roomIDInput)",
                    [new BCC.QueryValue("roomIDInput", sql.Int, roomID)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.AddSensor);
        }

        static async adminRemoveSensorReference(sensorID) {
            if (typeof (sensorID) == typeof (0)) {
                let ret = await BCC.MakeQuery("UPDATE [SensorInfo] SET [RoomID]=-1 WHERE [SensorID]=@sensorIDInput", [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.RemoveSensorRef);
        }

        static async adminRemoveSensor(sensorID) {
            if (typeof (sensorID) == typeof (0)) {
                await removeSensorsFromValueTables(sensorID);
                let ret = await BCC.MakeQuery("DELETE [SensorThresholds] WHERE [SensorID]=@sensorIDInput", [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
                ret = await BCC.MakeQuery("DELETE FROM [SensorInfo] WHERE [SensorID]=@sensorIDInput", [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else 
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.RemoveSensor);
        }

        // Sensor Types
        static async adminGetAllSensorTypes() {
            let returnItem = new ReturnItem([]);

            let ret = await BCC.MakeQuery("SELECT * FROM [SensorTypes]", []);
            if (BCC.IsErrorCode(ret))
                return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            await BCC.asyncForEach(ret.recordset, async function (v) {
                returnItem.Data.push(v);
            })

            return new BCC.ReturnMessage(200, returnItem);
        }

        static async adminAddNewSensorType(typeName) {
            if (typeof (typeName) == typeof ("")) {
                let ret = await BCC.MakeQuery("INSERT INTO [SensorTypes] (TypeName) values (@typeNameInput)", [new BCC.QueryValue("typeNameInput", sql.NVarChar(50), typeName)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.AddSensorType);
        }

        static async adminAddExistingSensorType(sensorType, sensorID, threshold) {
            if (typeof (sensorType) == typeof (0) && typeof (sensorID) == typeof (0) && typeof (threshold) == typeof (0)) {
                let ret = await BCC.MakeQuery(
                    "INSERT INTO [SensorThresholds] (SensorID, SensorType, ThresholdValue) values (@sensorIDInput, @sensorTypeInput, @thresholdInput)",
                    [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
                    new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType),
                    new BCC.QueryValue("thresholdInput", sql.Int, threshold)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.AddExistingSensorType);
        }

        static async adminRemoveSensorType(sensorType) {
            if (typeof (sensorType) == typeof (0)) {
                if (sensorType == -1)
                    return RC.ParseToReturnMessage(RC.failCodes.TargetIsDefaultID);

                let ret = await BCC.MakeQuery("DELETE FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.RemoveSensorType);
        }

        static async adminRemoveSensorTypeReference(sensorType) {
            if (typeof (sensorType) == typeof (0)) {
                let ret = await BCC.MakeQuery("DELETE FROM [SensorThresholds] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else 
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.RemoveSensorTypeRef);
        }

        static async adminUpdateSensorTypeThreshold(sensorID, sensorType, threshold) {
            if (typeof (sensorID) == typeof (0) && typeof (sensorType) == typeof (0) && typeof (threshold) == typeof (0)) {
                let ret = await BCC.MakeQuery(
                    "UPDATE [SensorThresholds] SET [ThresholdValue]=@thresholdInput WHERE [SensorID]=@sensorIDInput AND [SensorType]=@sensorTypeInput",
                    [new BCC.QueryValue("thresholdInput", sql.Int, threshold),
                    new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
                    new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]
                );
                if (BCC.IsErrorCode(ret))
                    return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            }
            else 
                return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

            return RC.ParseToReturnMessage(RC.successCodes.UpdateSensorTypeThreshold);
        }
    }

    static async adminInsertSensorValue(sensorID, sensorType, sensorValue) {
        if (typeof (sensorID) == typeof (0) && typeof (sensorType) == typeof (0) && typeof (sensorValue) == typeof (0)) {
            let ret = await BCC.MakeQuery("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
            if (BCC.IsErrorCode(ret))
                return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
            ret = await BCC.MakeQuery(
                "INSERT INTO [SensorValue_" + ret + "] (SensorID, SensorValue) values (@sensorIDInput, @sensorValueInput)",
                [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
                new BCC.QueryValue("sensorValueInput", sql.Int, sensorValue)]
            );
            if (BCC.IsErrorCode(ret))
                return RC.ParseToReturnMessage(RC.failCodes.DatabaseError);
        }
        else 
            return RC.ParseToReturnMessage(RC.failCodes.NoParameters);

        return RC.ParseToReturnMessage(RC.successCodes.InsertSensorValue);
    }
}

//#endregion

//#region Private

async function getAllWarningsQuery() {
    let result = [];

    let queryTable = await BCC.MakeQuery("SELECT * FROM [Warnings]", []);
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItems = await getAllSolutionsForAWarning(v.WarningID);
        let warningItem = new WarningItem(v.WarningID, v.SensorType, v.Message, solutionItems);
        result.push(warningItem);
    });

    return result;
}

async function getAllSolutionsForAWarning(warningID) {
    let result = [];

    let queryTable = await BCC.MakeQuery("SELECT * FROM [Solutions] WHERE [WarningID]=@warningIDInput", [new BCC.QueryValue("warningIDInput", sql.Int, warningID)]);
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItem = new SolutionItem(v.SolutionID, v.WarningPriority, v.Message);
        result.push(solutionItem);
    });

    return result;
}

async function removeSensorsFromValueTables(sensorID) {
    let sensorTypes = await BCC.MakeQuery("SELECT * FROM [SensorTypes]", []);
    await BCC.asyncForEach(sensorTypes, async function (v) {
        if (v.SensorType != -1) {
            await BCC.MakeQuery("DELETE FROM [SensorValue_" + v.TypeName + "] WHERE [SensorID]=@sensorIDInput", [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]);
        }
    });
}

//#endregion
