/*
    =========================
            Header
    =========================
*/
const sql = require("mssql");
let BCC = require(__dirname + "/BasicCalls.js").BCC;
let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;

class SolutionInfo {
    constructor(WarningPriority, Message) {
        this.WarningPriority = WarningPriority;
        this.Message = Message;
    }
}
class WarningInfo {
    constructor(WarningID, SensorType, Message, SolutionInfo) {
        this.WarningID = WarningID;
        this.SensorType = SensorType;
        this.Message = Message;
        this.SolutionInfo = SolutionInfo;
    }
}
class ReturnClass {
    constructor(Data) {
        this.Data = Data;
    }
}
class PriorityInfo {
    constructor(Priority, TimeUntil) {
        this.Priority = Priority;
        this.TimeUntil = TimeUntil;
    }
}
const NoWarnMessasge = new WarningInfo(-2, -2, "No Warnings", new SolutionInfo(0, "No Solution"));

const PriorityEnum = {
    None: 0,
    Low: 1,
    Medium: 2,
    High: 3
};

/*
    =========================
            Code Part
    =========================
*/

// Public Area
// WASC, Warnings And Solutions Class
module.exports.WASC = class {
    static async getWarningsAndSolutions(predictionDataArray) {
        if (predictionDataArray == null)
            return failCodes.NoParameters;
        if (!Array.isArray(predictionDataArray.Data))
            return failCodes.InputNotAnArray;

        let returnItem = new ReturnClass([]);

        await BCC.asyncForEach(predictionDataArray.Data, async function (v) {
            returnItem = await getWASForEachThesholdPass(v, predictionDataArray.Interval, returnItem);
        });
        if (returnItem.Data.length == 0)
            returnItem.Data.push(NoWarnMessasge);

        return returnItem;
    }
}

// Private Area

async function getWASForEachThesholdPass(predictionData, interval, returnItem) {
    await BCC.asyncForEach(predictionData.ThresholdPasses, async function (v) {
        let priority = getPriority(v.TimeUntil, interval);

        if (priority.Priority != PriorityEnum.None) {
            let isThere = await checkIfWarningIsThere(predictionData.SensorType, returnItem.Data, priority.Priority);

            if (!isThere) {
                let warningInfo = await getWarningInfoQuery(predictionData.SensorType, priority);
                if (warningInfo.Message != "" && warningInfo.SolutionInfo.Message != "")
                    returnItem.Data.push(warningInfo);
            }
        }
    });

    return returnItem;
}

async function checkIfWarningIsThere(sensorType, searchArray, priority) {
    let isThere = false;

    await BCC.asyncForEach(searchArray, async function (v) {
        if (v.SensorType == sensorType) {
            if (v.SolutionInfo.WarningPriority < priority) {
                v.SolutionInfo = await getSolutionQuery(v.WarningID, priority);
            }
            isThere = true;
        }
    });

    return isThere;
}

function getPriority(timeUntilBadIAQ, interval) {

    let minutes = timeUntilBadIAQ * interval;

    if (minutes > 60)
        return new PriorityInfo(PriorityEnum.None, minutes);
    else if (minutes > 30)
        return new PriorityInfo(PriorityEnum.Low, minutes);
    else if (minutes > 10)
        return new PriorityInfo(PriorityEnum.Medium, minutes);
    else
        return new PriorityInfo(PriorityEnum.High, minutes);

    return new PriorityInfo(PriorityEnum.None, minutes);
}

async function getWarningInfoQuery(sensorType, priority) {
    let result = new WarningInfo(-1, sensorType, "", new SolutionInfo(priority, ""));

    let queryTable = await BCC.MakeQuery("SELECT * FROM [Warnings] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);

    if (queryTable.recordset.length != 0) {
        result.Message = queryTable.recordset[0].Message;
        result.WarningID = queryTable.recordset[0].WarningID;
        result.SolutionInfo = await getSolutionQuery(queryTable.recordset[0].WarningID, priority);
    }

    return result;
}

async function getSolutionQuery(warningID, priority) {
    let result = new SolutionInfo(priority, "");

    let queryTable = await BCC.MakeQuery(
        "SELECT * FROM [Solutions] WHERE [WarningID]=@warningIDInput AND [WarningPriority]=@priorityInput",
        [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
        new BCC.QueryValue("priorityInput", sql.Int, priority.Priority)]
    );

    if (queryTable.recordset.length != 0) {
        result.Message = queryTable.recordset[0].Message;
    }

    return result;
}