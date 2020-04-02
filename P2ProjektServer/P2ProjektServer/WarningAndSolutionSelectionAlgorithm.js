const sql = require("mssql");
let basicCalls = require(__dirname + "/BasicCalls.js");

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

module.exports.getWarningsAndSolutions = async function (predictionDataArray) {
    let returnItem = new ReturnClass([]);

    await basicCalls.asyncForEach(predictionDataArray.Data, async function (v) {
        returnItem = await getWASForEachThesholdPass(v, predictionDataArray.Interval, returnItem);
    });

    return returnItem;
}

async function getWASForEachThesholdPass(predictionData, interval, returnItem) {
    await basicCalls.asyncForEach(predictionData.ThresholdPasses, async function (v) {
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

    let queryTable = await basicCalls.MakeQuery("SELECT * FROM [Warnings] WHERE [SensorType]=@sensorTypeInput", [new basicCalls.QueryValue("sensorTypeInput", sql.Int, sensorType)]);
    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        let solutionInfo = await getSolutionQuery(v.WarningID, priority);
        let warningItem = new WarningItem(v.Message, solutionInfo);
        result.WarningItems.push(warningItem);
    });

    return result;
}

async function getSolutionQuery(warningID, priority) {
    let result = [];

    let queryTable = await basicCalls.MakeQuery(
        "SELECT * FROM [Solutions] WHERE [WarningID]=@warningIDInput AND [WarningPriority]=@priorityInput",
        [new basicCalls.QueryValue("warningIDInput", sql.Int, warningID),
         new basicCalls.QueryValue("priorityInput", sql.Int, priority)]
    );
    await basicCalls.asyncForEach(queryTable.recordset, async function (v) {
        let solutionItem = new SolutionInfo(priority, v.Message);
        result.push(solutionItem);
    });

    return result;
}