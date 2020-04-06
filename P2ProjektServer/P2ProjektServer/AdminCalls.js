const sql = require("mssql");
let basicCalls = require(__dirname + "/BasicCalls.js");
let returnCodes = require(__dirname + "/ReturnCodes.js");

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

module.exports.adminClass = class {

    static async adminGetAllWarningsAndSolutions() {
        let returnItem = new ReturnItem([]);

        returnItem.Data = await getAllWarningsQuery();

        return returnItem;
    }

    static async adminGetAllWarningsAndSolutions() {
        let returnItem = new ReturnItem([]);

        returnItem.Data = await getAllWarningsQuery();

        return returnItem;
    }

    static async adminAddNewWarning(sensorType, message) {
        try {
            await basicCalls.MakeQuery(
                "INSERT INTO [Warnings] (SensorType, Message) values (@sensorTypeInput, @messageInput)",
                [new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType),
                new basicCalls.QueryValue("messageInput", sql.NVarChar(50), message)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveWarning(warningID) {
        if (warningID == -1) {
            console.log("Client attempted to remove default warning");
            return 400;
        }

        try {
            await basicCalls.MakeQuery("UPDATE [Solutions] SET [WarningID]=-1 WHERE [WarningID]=@warningIDInput", [new basicCalls.QueryValue("warningIDInput", sql.Int, warningID)]);
            await basicCalls.MakeQuery("DELETE FROM [Warnings] WHERE [WarningID]=@warningIDInput", [new basicCalls.QueryValue("warningIDInput", sql.Int, warningID)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminUpdateWarning(warningID, message) {
        if (warningID == -1) {
            console.log("Client attempted to update default warning");
            return 400;
        }

        try {
            await basicCalls.MakeQuery(
                "UPDATE [Warnings] SET [Message]=@messageInput WHERE [WarningID]=@warningIDInput",
                [new basicCalls.QueryValue("warningIDInput", sql.Int, warningID),
                new basicCalls.QueryValue("messageInput", sql.NVarChar(50), message)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminAddSolution(warningID, warningPriority, message) {
        if (warningPriority < 0 || warningPriority > 3) {
            console.log("Client tried to add solution with priority outside bounds");
            return 400;
        }

        try {
            await basicCalls.MakeQuery(
                "INSERT INTO [Solutions] (WarningID, WarningPriority, Message) values (@warningIDInput, @warningPriorityInput, @messageInput)",
                [new basicCalls.QueryValue("warningIDInput", sql.Int, warningID),
                new basicCalls.QueryValue("warningPriorityInput", sql.Int, warningPriority),
                new basicCalls.QueryValue("messageInput", sql.NVarChar(50), message)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveSolutionReference(solutionID) {
        if (solutionID == -1) {
            console.log("Client attempted to remove reference to default solution");
            return 400;
        }

        try {
            await basicCalls.MakeQuery("UPDATE [Solutions] SET [WarningID]=-1 WHERE [SolutionID]=@solutionIDInput", [new basicCalls.QueryValue("solutionIDInput", sql.Int, solutionID)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminUpdateSolution(solutionID, message, warningPriority) {
        if (solutionID == -1) {
            console.log("Client attempted to update default solution");
            return 400;
        }

        try {
            await basicCalls.MakeQuery(
                "UPDATE [Solutions] SET [Message]=@messageInput, [WarningPriority]=@priorityInput WHERE [SolutionID]=@solutionIDInput",
                [new basicCalls.QueryValue("messageInput", sql.NVarChar(50), message),
                new basicCalls.QueryValue("solutionIDInput", sql.Int, solutionID),
                new basicCalls.QueryValue("priorityInput", sql.Int, warningPriority)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminAddExistingSolution(solutionID, warningID) {
        if (solutionID == -1) {
            console.log("Client attempted to update default solution");
            return 400;
        }

        try {
            await basicCalls.MakeQuery(
                "UPDATE [Solutions] SET [WarningID]=@warningIDInput WHERE [SolutionID]=@solutionIDInput",
                [new basicCalls.QueryValue("warningIDInput", sql.Int, warningID),
                new basicCalls.QueryValue("solutionIDInput", sql.Int, solutionID)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveSolution(solutionID) {
        if (solutionID == -1) {
            console.log("Client attempted to remove default solution");
            return 400;
        }

        try {
            await basicCalls.MakeQuery("DELETE FROM [Solutions] WHERE [SolutionID]=@solutionIDInput", [new basicCalls.QueryValue("solutionIDInput", sql.Int, solutionID)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminGetAllSolutions() {
        let returnItem = new ReturnItem([]);

        let queryTable = await basicCalls.MakeQuery("SELECT * FROM [Solutions]", []);
        await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
            returnItem.Data.push(v);
        });

        return returnItem;
    }

    static async adminAddNewRoom(roomName) {
        try {
            await basicCalls.MakeQuery("INSERT INTO [SensorRooms] (RoomName) values (@roomNameInput)", [new basicCalls.QueryValue("roomNameInput", sql.NVarChar(50), roomName)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveRoom(roomID) {
        try {
            await basicCalls.MakeQuery("DELETE FROM [SensorRooms] WHERE [RoomID]=@roomIDInput", [new basicCalls.QueryValue("roomIDInput", sql.Int, roomID)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminUpdateRoom(roomID, roomName) {
        try {
            await basicCalls.MakeQuery(
                "UPDATE [SensorRooms] SET [RoomName]=@roomNameInput WHERE [RoomID]=@roomIDInput",
                [new basicCalls.QueryValue("roomNameInput", sql.NVarChar(50), roomName),
                new basicCalls.QueryValue("roomIDInput", sql.Int, roomID)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminGetAllSensors() {
        let returnItem = new ReturnItem([]);

        let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorInfo]");
        await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
            returnItem.Data.push(v);
        })

        return returnItem;
    }

    static async adminUpdateSensor(sensorID, roomID) {
        try {
            await basicCalls.MakeQuery(
                "UPDATE [SensorInfo] SET [RoomID]=@roomIDInput WHERE [SensorID]=@sensorIDInput",
                [new basicCalls.QueryValue("roomIDInput", sql.Int, roomID),
                new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminAddNewSensor(sensorID, roomID) {
        try {
            await basicCalls.MakeQuery(
                "INSERT INTO [SensorInfo]  (RoomID, SensorID) values (@roomIDInput, @sensorIDInput)",
                [new basicCalls.QueryValue("roomIDInput", sql.Int, roomID),
                new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveSensorReference(sensorID) {
        try {
            await basicCalls.MakeQuery("UPDATE [SensorInfo] SET [RoomID]=-1 WHERE [SensorID]=@sensorIDInput", [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveSensor(sensorID) {
        try {
            await removeSensorsFromValueTables(sensorID);
            await basicCalls.MakeQuery("DELETE [SensorThresholds] WHERE [SensorID]=@sensorIDInput", [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID)]);
            await basicCalls.MakeQuery("DELETE FROM [SensorInfo] WHERE [SensorID]=@sensorIDInput", [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminGetAllSensorTypes() {
        let returnItem = new ReturnItem([]);

        let queryTable = await basicCalls.MakeQuery("SELECT * FROM [SensorTypes]", []);
        await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
            returnItem.Data.push(v);
        })

        return returnItem;
    }

    static async adminAddNewSensorType(typeName) {
        try {
            await basicCalls.MakeQuery("INSERT INTO [SensorTypes] (TypeName) values (@typeNameInput)", [new basicCalls.QueryValue("typeNameInput", sql.NVarChar(50), typeName)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminAddExistingSensorType(sensorType, sensorID, threshold) {
        try {
            await basicCalls.MakeQuery(
                "INSERT INTO [SensorThresholds] (SensorID, SensorType, ThresholdValue) values (@sensorIDInput, @sensorTypeInput, @thresholdInput",
                [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID),
                new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType),
                new basicCalls.QueryValue("thresholdInput", sql.Int, threshold)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveSensorType(sensorType) {
        try {
            await basicCalls.MakeQuery("DELETE FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput", [new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminRemoveSensorTypeReference(sensorType) {
        try {
            await basicCalls.MakeQuery("DELETE FROM [SensorThresholds] WHERE [SensorType]=@sensorTypeInput", [new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminUpdateSensorTypeThreshold(sensorID, sensorType, threshold) {
        try {
            await basicCalls.MakeQuery(
                "UPDATE [SensorThresholds] SET [ThresholdValue]=@thresholdInput WHERE [SensorID]=@sensorIDInput AND [SensorType]=@sensorTypeInput",
                [new basicCalls.QueryValue("thresholdInput", sql.Int, threshold),
                new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID),
                new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }

    static async adminInsertSensorValue(sensorID, sensorType, sensorValue) {
        try {
            let queryTable = await basicCalls.MakeQuery("SELECT [TypeName] FROM [SensorTypes] WHERE [SensorType]=@sensorTypeInput", [new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
            let typeName = queryTable.recordset[0].TypeName;
            await basicCalls.MakeQuery(
                "INSERT INTO [SensorValue_" + typeName + "] (SensorID, SensorValue) values (@sensorIDInput, @sensorValueInput)",
                [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID),
                new basicCalls.QueryValue("sensorValueInput", sql.Int, sensorValue)]
            );
        } catch (err) {
            console.log(err);
            return err;
        }

        return 200;
    }
}

async function getAllWarningsQuery() {
    let result = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [Warnings]", []);
    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItems = await getAllSolutionsForAWarning(v.WarningID);
        let warningItem = new WarningItem(v.WarningID, v.SensorType, v.Message, solutionItems);
        result.push(warningItem);
    });

    return result;
}

async function getAllWarningsQuery() {
    let result = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [Warnings]", []);
    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItems = await getAllSolutionsForAWarning(v.WarningID);
        let warningItem = new WarningItem(v.WarningID, v.SensorType, v.Message, solutionItems);
        result.push(warningItem);
    });

    return result;
}

async function getAllSolutionsForAWarning(warningID) {
    let result = [];

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [Solutions] WHERE [WarningID]=@warningIDInput", [new basicCalls.QueryValue("warningIDInput", sql.Int, warningID)]);
    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItem = new SolutionItem(v.SolutionID, v.WarningPriority, v.Message);
        result.push(solutionItem);
    });

    return result;
}

async function removeSensorsFromValueTables(sensorID) {
    let sensorTypes = await basicCalls.MakeQuery("SELECT * FROM [SensorTypes]", []);
    await basicCalls.asyncForEach(sensorTypes, async function (v) {
        if (v.SensorType != -1) {
            await basicCalls.MakeQuery("DELETE FROM [SensorValue_" + v.TypeName + "] WHERE [SensorID]=@sensorIDInput", [new basicCalls.QueryValue("sensorIDInput", sql.Int, sensorID)]);
        }
    });
}