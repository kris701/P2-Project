/*
    =========================
            Header
    =========================
*/
const sql = require("mssql");
let BCC = require(__dirname + "/BasicCalls.js").BCC;

class SolutionInfo {
    constructor(WarningPriority, Message) {
        this.WarningPriority = WarningPriority;
        this.Message = Message;
    }
}
class WarningItem {
    constructor(Message, SolutionInfo) {
        this.Message = Message;
        this.SolutionInfo = SolutionInfo;
    }
}
class WarningInfo {
    constructor(SensorType, WarningItems) {
        this.SensorType = SensorType;
        this.WarningItems = WarningItems;
    }
}
class ReturnClass {
    constructor(Data) {
        this.Data = Data;
    }
}

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
            return "err";
        if (!Array.isArray(predictionDataArray.Data))
            return "err";

        let returnItem = new ReturnClass([]);

        await BCC.asyncForEach(predictionDataArray.Data, async function (v) {
            returnItem = await getWASForEachThesholdPass(v, predictionDataArray.Interval, returnItem);
        });

        return returnItem;
    }
}

// Private Area

async function getWASForEachThesholdPass(predictionData, interval, returnItem) {
    await BCC.asyncForEach(predictionData.ThresholdPasses, async function (v) {
        let priority = getPriority(v.TimeUntil, interval);

        if (priority != PriorityEnum.None) {
            let warningInfo = await getWarningInfoQuery(predictionData.SensorType, priority);
            returnItem.Data.push(warningInfo);
        }
    });

    return returnItem;
}

function getPriority(timeUntilBadIAQ, interval) {
    let minutes = timeUntilBadIAQ * interval;

    if (minutes > 60)
        return PriorityEnum.None;
    else if (minutes > 30)
        return PriorityEnum.Low;
    else if (minutes > 10)
        return PriorityEnum.Medium;
    else
        return PriorityEnum.High;

    return PriorityEnum.None;
}

async function getWarningInfoQuery(sensorType, priority) {
    let result = new WarningInfo(sensorType, []);

    let queryTable = await BCC.MakeQuery("SELECT * FROM [Warnings] WHERE [SensorType]=@sensorTypeInput", [new BCC.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let solutionInfo = await getSolutionQuery(v.WarningID, priority);
        let warningItem = new WarningItem(v.Message, solutionInfo);
        result.WarningItems.push(warningItem);
    });

    return result;
}

async function getSolutionQuery(warningID, priority) {
    let result = [];

    let queryTable = await BCC.MakeQuery(
        "SELECT * FROM [Solutions] WHERE [WarningID]=@warningIDInput AND [WarningPriority]=@priorityInput",
        [new BCC.QueryValue("warningIDInput", sql.Int, warningID),
         new BCC.QueryValue("priorityInput", sql.Int, priority)]
    );
    await BCC.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItem = new SolutionInfo(priority, v.Message);
        result.push(solutionItem);
    });

    return result;
}