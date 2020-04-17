//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let prediction = require(__dirname + "/PredictionAlgorithms.js");
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

//#endregion

//#region Public

// WASC, Warnings And Solutions Class
module.exports.WASC = class {
    static async getWarningsAndSolutions(room, date) {
        if (room == null || date == null)
            return new BCC.ReturnMessage(failCodes.NoParameters, "");

        let predictionDataArray = await prediction.PAC.getPredictionDatetimeQuery(room, date)

        let returnItem = new ReturnClass([]);

        await BCC.asyncForEach(predictionDataArray.Data, async function (v) {
            returnItem = await getWASForEachThesholdPass(v, predictionDataArray.Interval, returnItem);
        });
        if (returnItem.Data.length == 0)
            returnItem.Data.push(NoWarnMessasge);

        return new BCC.ReturnMessage(200, returnItem);
    }
}

//#endregion

//#region Private

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

    let ret = await BCC.MakeQuery("SELECT * FROM Warnings WHERE SensorType=?", [sensorType]);
    if (BCC.IsErrorCode(ret))
        return result;

    if (queryTable.recordset.length != 0) {
        result.Message = queryTable.recordset[0].Message;
        result.WarningID = queryTable.recordset[0].WarningID;
        result.SolutionInfo = await getSolutionQuery(queryTable.recordset[0].WarningID, priority);
    }

    return result;
}

async function getSolutionQuery(warningID, priority) {
    let result = new SolutionInfo(priority, "");

    let ret = await BCC.MakeQuery(
        "SELECT * FROM Solutions WHERE WarningID=? AND WarningPriority=?", [warningID, priority.Priority]
    );
    if (BCC.IsErrorCode(ret))
        return result;

    if (ret.recordset.length != 0) {
        result.Message = ret.recordset[0].Message;
    }

    return result;
}

//#endregion