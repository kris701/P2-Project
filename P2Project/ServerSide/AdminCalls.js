/*
    =========================
            Header
    =========================
*/

const sql = require("mssql");
let BCC = require(__dirname + "/BasicCalls.js").BCC;
let successCodes = require(__dirname + "/ReturnCodes.js").successCodes;
let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;

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






/*
    =========================
            Code Part
    =========================
*/


// Public Area
// Admin Call Class

module.exports.ACC = class {
    // Warning And Solutions Class
    static WASC = class {

        // Warnings
        static async adminGetAllWarningsAndSolutions() {
            let returnItem = new ReturnItem([]);

            returnItem.Data = await getAllWarningsQuery();

            return returnItem;
        }

        static async adminAddNewWarning(sensorType, message) {
            if (sensorType != null && message != null) {
                try {
                    await BCC.MakeQuery(
                        "INSERT INTO [Warnings] (SensorType, Message) values (@sensorTypeInput, @messageInput)",
                        [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType),
                        new BCC.QueryValue("messageInput", sql.NVarChar(50), message)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminAddNewWarning");
                return failCodes.NoParameters;
            }

            return successCodes.AddWarning;
        }

        static async adminRemoveWarning(warningID) {
            if (warningID != null) {
                if (warningID == -1) {
                    console.error("Client attempted to remove default warning");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery("UPDATE [Solutions] SET [WarningID]=-1 WHERE [WarningID]=@warningIDInput", [new BCC.QueryValue("warningIDInput", sql.Int, warningID)]);
                    await BCC.MakeQuery("DELETE FROM [Warnings] WHERE [WarningID]=@warningIDInput", [new BCC.QueryValue("warningIDInput", sql.Int, warningID)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveWarning");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveWarning;
        }

        static async adminUpdateWarning(warningID, message) {
            if (warningID != null && message != null) {
                if (warningID == -1) {
                    console.error("Client attempted to update default warning");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery(
                        "UPDATE [Warnings] SET [Message]=@messageInput WHERE [WarningID]=@warningIDInput",
                        [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
                        new BCC.QueryValue("messageInput", sql.NVarChar(50), message)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminUpdateWarning");
                return failCodes.NoParameters;
            }


            return successCodes.UpdateWarning;
        }

        // Solutions
        static async adminAddSolution(warningID, warningPriority, message) {
            if (warningID != null && warningPriority != null && message != null) {
                if (warningPriority < 0 || warningPriority > 3) {
                    console.error("Client tried to add solution with priority outside bounds");
                    return failCodes.PriorityOutsideRange;
                }

                try {
                    await BCC.MakeQuery(
                        "INSERT INTO [Solutions] (WarningID, WarningPriority, Message) values (@warningIDInput, @warningPriorityInput, @messageInput)",
                        [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
                        new BCC.QueryValue("warningPriorityInput", sql.Int, warningPriority),
                        new BCC.QueryValue("messageInput", sql.NVarChar(50), message)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminAddSolution");
                return failCodes.NoParameters;
            }


            return successCodes.AddSolution;
        }

        static async adminRemoveSolutionReference(solutionID) {
            if (solutionID != null) {
                if (solutionID == -1) {
                    console.error("Client attempted to remove reference to default solution");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery("UPDATE [Solutions] SET [WarningID]=-1 WHERE [SolutionID]=@solutionIDInput", [new BCC.QueryValue("solutionIDInput", sql.Int, solutionID)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveSolutionReference");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveSolutionRef;
        }

        static async adminUpdateSolution(solutionID, message, warningPriority) {
            if (solutionID != null && message != null && warningPriority != null) {
                if (solutionID == -1) {
                    console.error("Client attempted to update default solution");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery(
                        "UPDATE [Solutions] SET [Message]=@messageInput, [WarningPriority]=@priorityInput WHERE [SolutionID]=@solutionIDInput",
                        [new BCC.QueryValue("messageInput", sql.NVarChar(50), message),
                        new BCC.QueryValue("solutionIDInput", sql.Int, solutionID),
                        new basicCalls.QueryValue("priorityInput", sql.Int, warningPriority)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminUpdateSolution");
                return failCodes.NoParameters;
            }


            return successCodes.UpdateSolution;
        }

        static async adminAddExistingSolution(solutionID, warningID) {
            if (solutionID != null && warningID != null) {
                if (solutionID == -1) {
                    console.error("Client attempted to update default solution");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery(
                        "UPDATE [Solutions] SET [WarningID]=@warningIDInput WHERE [SolutionID]=@solutionIDInput",
                        [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
                        new BCC.QueryValue("solutionIDInput", sql.Int, solutionID)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminAddExistingSolution");
                return failCodes.NoParameters;
            }


            return successCodes.AddExistingSolution;
        }

        static async adminRemoveSolution(solutionID) {
            if (solutionID != null) {
                if (solutionID == -1) {
                    console.error("Client attempted to remove default solution");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery("DELETE FROM [Solutions] WHERE [SolutionID]=@solutionIDInput", [new BCC.QueryValue("solutionIDInput", sql.Int, solutionID)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveSolution");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveSolution;
        }

        static async adminGetAllSolutions() {
            let returnItem = new ReturnItem([]);

            let queryTable = await BCC.MakeQuery("SELECT * FROM [Solutions]", []);
            await BCC.asyncForEach(queryTable.recordset, async function (v) {
                returnItem.Data.push(v);
            });

            return returnItem;
        }
    }

    // Sensor Edit Class
    static SEC = class {

        // Rooms
        static async adminAddNewRoom(roomName) {
            if (roomName != null) {
                try {
                    await BCC.MakeQuery("INSERT INTO [SensorRooms] (RoomName) values (@roomNameInput)", [new BCC.QueryValue("roomNameInput", sql.NVarChar(50), roomName)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminAddNewRoom");
                return failCodes.NoParameters;
            }


            return successCodes.AddRoom;
        }

        static async adminRemoveRoom(roomID) {
            if (roomID != null) {
                if (roomID == -1) {
                    console.error("Client attempted to remove default room");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery("DELETE FROM [SensorRooms] WHERE [RoomID]=@roomIDInput", [new BCC.QueryValue("roomIDInput", sql.Int, roomID)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveRoom");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveRoom;
        }

        static async adminUpdateRoom(roomID, roomName) {
            if (roomID != null && roomName != null) {
                if (roomID == -1) {
                    console.error("Client attempted to edit default room");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery(
                        "UPDATE [SensorRooms] SET [RoomName]=@roomNameInput WHERE [RoomID]=@roomIDInput",
                        [new BCC.QueryValue("roomNameInput", sql.NVarChar(50), roomName),
                        new BCC.QueryValue("roomIDInput", sql.Int, roomID)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminUpdateRoom");
                return failCodes.NoParameters;
            }


            return successCodes.UpdateRoom;
        }

        // Sensors
        static async adminGetAllSensors() {
            let returnItem = new ReturnItem([]);

            let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorInfo]", []);
            await BCC.asyncForEach(queryTable.recordset, async function (v) {
                returnItem.Data.push(v);
            })

            return returnItem;
        }

        static async adminUpdateSensor(sensorID, roomID) {
            if (sensorID != null && roomID != null) {
                try {
                    await BCC.MakeQuery(
                        "UPDATE [SensorInfo] SET [RoomID]=@roomIDInput WHERE [SensorID]=@sensorIDInput",
                        [new BCC.QueryValue("roomIDInput", sql.Int, roomID),
                        new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminUpdateSensor");
                return failCodes.NoParameters;
            }


            return successCodes.UpdateSensor;
        }

        static async adminAddNewSensor(roomID) {
            if (roomID != null) {
                try {
                    await BCC.MakeQuery(
                        "INSERT INTO [SensorInfo] (RoomID) values (@roomIDInput)",
                        [new BCC.QueryValue("roomIDInput", sql.Int, roomID)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminAddNewSensor");
                return failCodes.NoParameters;
            }


            return successCodes.AddSensor;
        }

        static async adminRemoveSensorReference(sensorID) {
            if (sensorID != null) {
                try {
                    await BCC.MakeQuery("UPDATE [SensorInfo] SET [RoomID]=-1 WHERE [SensorID]=@sensorIDInput", [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveSensorReference");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveSensorRef;
        }

        static async adminRemoveSensor(sensorID) {
            if (sensorID != null) {
                try {
                    await removeSensorsFromValueTables(sensorID);
                    await BCC.MakeQuery("DELETE [SensorThresholds] WHERE [SensorID]=@sensorIDInput", [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]);
                    await BCC.MakeQuery("DELETE FROM [SensorInfo] WHERE [SensorID]=@sensorIDInput", [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveSensor");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveSensor;
        }

        // Sensor Types
        static async adminGetAllSensorTypes() {
            let returnItem = new ReturnItem([]);

            let queryTable = await BCC.MakeQuery("SELECT * FROM [SensorTypes]", []);
            await BCC.asyncForEach(queryTable.recordset, async function (v) {
                returnItem.Data.push(v);
            })

            return returnItem;
        }

        static async adminAddNewSensorType(typeName) {
            if (typeName != null) {
                try {
                    await BCC.MakeQuery("INSERT INTO [SensorTypes] (TypeName) values (@typeNameInput)", [new BCC.QueryValue("typeNameInput", sql.NVarChar(50), typeName)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminAddNewSensorType");
                return failCodes.NoParameters;
            }


            return successCodes.AddSensorType;
        }

        static async adminAddExistingSensorType(sensorType, sensorID, threshold) {
            if (sensorType != null && sensorID != null && threshold != null) {
                try {
                    await BCC.MakeQuery(
                        "INSERT INTO [SensorThresholds] (SensorID, SensorType, ThresholdValue) values (@sensorIDInput, @sensorTypeInput, @thresholdInput)",
                        [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
                        new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType),
                        new BCC.QueryValue("thresholdInput", sql.Int, threshold)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminAddExistingSensorType");
                return failCodes.NoParameters;
            }


            return successCodes.AddExistingSensorType;
        }

        static async adminRemoveSensorType(sensorType) {
            if (sensorType != null) {
                if (sensorType == -1) {
                    console.error("Client attempted to remove default sensortype");
                    return failCodes.TargetIsDefaultID;
                }

                try {
                    await BCC.MakeQuery("DELETE FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveSensorType");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveSensorType;
        }

        static async adminRemoveSensorTypeReference(sensorType) {
            if (sensorType != null) {
                try {
                    await BCC.MakeQuery("DELETE FROM [SensorThresholds] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminRemoveSensorTypeReference");
                return failCodes.NoParameters;
            }


            return successCodes.RemoveSensorTypeRef;
        }

        static async adminUpdateSensorTypeThreshold(sensorID, sensorType, threshold) {
            if (sensorID != null && sensorType != null && threshold != null) {
                try {
                    await BCC.MakeQuery(
                        "UPDATE [SensorThresholds] SET [ThresholdValue]=@thresholdInput WHERE [SensorID]=@sensorIDInput AND [SensorType]=@sensorTypeInput",
                        [new BCC.QueryValue("thresholdInput", sql.Int, threshold),
                        new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
                        new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]
                    );
                } catch (err) {
                    console.error(err);
                    return failCodes.DatabaseError;
                }
            }
            else {
                console.error("Client failed to send appropriate parameters for function adminUpdateSensorTypeThreshold");
                return failCodes.NoParameters;
            }


            return successCodes.UpdateSensorTypeThreshold;
        }
    }

    static async adminInsertSensorValue(sensorID, sensorType, sensorValue) {
        if (sensorID != null && sensorType != null && sensorValue != null) {
            try {
                let queryTable = await BCC.MakeQuery("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
                let typeName = queryTable.recordset[0].TypeName;
                await BCC.MakeQuery(
                    "INSERT INTO [SensorValue_" + typeName + "] (SensorID, SensorValue) values (@sensorIDInput, @sensorValueInput)",
                    [new BCC.QueryValue("sensorIDInput", sql.Int, sensorID),
                    new BCC.QueryValue("sensorValueInput", sql.Int, sensorValue)]
                );
            } catch (err) {
                console.error(err);
                return failCodes.DatabaseError;
            }
        }
        else {
            console.error("Client failed to send appropriate parameters for function adminInsertSensorValue");
            return failCodes.NoParameters;
        }


        return successCodes.InsertSensorValue;
    }
}

// Private Area

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