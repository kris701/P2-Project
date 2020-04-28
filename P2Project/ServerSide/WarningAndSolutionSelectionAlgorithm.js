//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
let PAC = require(__dirname + "/PredictionAlgorithms.js").PAC;
let RC = require(__dirname + "/ReturnCodes.js");
let cfg = require(__dirname + "/ConfigLoading.js").configuration;

class SolutionInfo {
    constructor(warningPriority, message) {
        this.warningPriority = warningPriority;
        this.message = message;
    }
}
class WarningInfo {
    constructor(warningID, sensorType, message, solutionInfo) {
        this.warningID = warningID;
        this.sensorType = sensorType;
        this.message = message;
        this.solutionInfo = solutionInfo;
    }
}
class ReturnClass {
    constructor(data, interval) {
        this.interval = interval;
        this.data = data;
    }
}
class PriorityInfo {
    constructor(priority, priorityName, timeUntil) {
        this.priority = priority;
        this.priorityName = priorityName;
        this.timeUntil = timeUntil;
    }
}
const noWarnMessasge = new WarningInfo(-2, -2, "No Warnings", new SolutionInfo(0, "No Solution"));

//#endregion

//#region Public

// WASC, Warnings And Solutions Class
module.exports.WASC = class {
    static async getWarningsAndSolutions(room, date) {
        if (room == null || date == null)
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (parseInt(room, 10)) != typeof (0))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);
        if (typeof (date) != typeof (""))
            return RC.parseToRetMSG(RC.failCodes.NoParameters);

        cfg = require(__dirname + "/ConfigLoading.js").configuration;

        let predictionDataArray = await PAC.getPredictionDatetimeQuery(room, date)

        let returnItem = new ReturnClass([], predictionDataArray.message.interval);

        await BCC.asyncForEach(predictionDataArray.message.data, async function (v) {
            returnItem = await getWASForEachThesholdPass(v, predictionDataArray.message.interval, returnItem);
        });
        if (returnItem.data.length == 0)
            returnItem.data.push(noWarnMessasge);

        return new BCC.retMSG(RC.successCodes.GotWarningsAndSoluton, returnItem);
    }
}

//#endregion

//#region Private

async function getWASForEachThesholdPass(predictionData, interval, returnItem) {
    await BCC.asyncForEach(predictionData.thresholdPasses, async function (passedValueInfo) {
        if (passedValueInfo.timesExceeded > 0) {
            let priority = getPriority(passedValueInfo.timeUntil, interval);

            if (priority.priority != cfg.priorityEnum.None) {
                let isThere = await checkIfWarningIsThere(predictionData.sensorType, returnItem.data, priority.priority);

                if (!isThere) {
                    let warningInfo = await getWarningInfoQuery(predictionData.sensorType, priority);
                    if (warningInfo.message != "" && warningInfo.solutionInfo.message != "")
                        returnItem.data.push(warningInfo);
                }
            }
        }
    });

    return returnItem;
}

async function checkIfWarningIsThere(sensorType, searchArray, priority) {
    let isThere = false;

    await BCC.asyncForEach(searchArray, async function (v) {
        if (v.sensorType == sensorType) {
            if (v.solutionInfo.warningPriority < priority) {
                v.solutionInfo = await getSolutionQuery(v.warningID, priority);
            }
            isThere = true;
        }
    });

    return isThere;
}

function getPriority(timeUntilBadIAQ, interval) {

    let minutes = timeUntilBadIAQ * interval;

    let selectedP = cfg.priorityEnum.None;
    for (let key in cfg.priorityEnum) {
        if (minutes < parseInt(cfg.priorityTime[cfg.priorityEnum[key]], 10))
            selectedP = cfg.priorityEnum[key];
    }
    return new PriorityInfo(selectedP, Object.keys(cfg.priorityEnum)[selectedP] , minutes);
}

async function getWarningInfoQuery(sensorType, priority) {
    let result = new WarningInfo(-1, sensorType, "", new SolutionInfo(priority, ""));

    let ret = await BCC.makeQuery("SELECT * FROM Warnings WHERE sensorType=?", [sensorType]);
    if (BCC.isErrorCode(ret))
        return result;

    if (ret.recordset.length != 0) {
        if (ret.recordset[0].warningID != -1) {
            result.message = ret.recordset[0].message;
            result.warningID = ret.recordset[0].warningID;
            result.solutionInfo = await getSolutionQuery(ret.recordset[0].warningID, priority);
        }
    }

    return result;
}

async function getSolutionQuery(warningID, priority) {
    let result = new SolutionInfo(priority, "");

    let ret = await BCC.makeQuery(
        "SELECT * FROM Solutions WHERE warningID=? AND warningPriority=?", [warningID, priority.priority]
    );
    if (BCC.isErrorCode(ret))
        return result;

    if (ret.recordset.length != 0) {
        result.message = ret.recordset[0].message;
    }

    return result;
}

//#endregion
