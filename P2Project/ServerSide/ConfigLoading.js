//#region Header

let BCC = require(__dirname + "/BasicCalls.js").BCC;
const millisecondsPerMinute = 60000;
module.exports.configuration = { cfgUpdateInterval: -1};

//#endregion

//#region Public
// Config Loading Class

module.exports.CLC = class {

    static async getServerConfiguration() {
        let result = {};

        let ret = await BCC.makeQuery("SELECT * FROM SettingsTable", []);
        if (BCC.isErrorCode(ret))
            return result;

        await BCC.asyncForEach(ret.recordset, async function (v) {
            result[v.settingName] = v.settingValue;
        });

        return result;
    }

    static async checkForConfigUpdate(timeSinceLastCFGUpdate) {
        let reqTime = new Date();
        if (((reqTime.getTime() - timeSinceLastCFGUpdate.getTime()) / millisecondsPerMinute) >= module.exports.configuration.cfgUpdateInterval) {
            timeSinceLastCFGUpdate = reqTime;
            await module.exports.CLC.loadConfiguration();
        }
        return timeSinceLastCFGUpdate;
    }

    static async loadConfiguration() {
        console.log("Loading server config...");
        module.exports.configuration = await module.exports.CLC.getServerConfiguration();
        console.log("Server config loaded!");
    }
}

//#endregion

//#region Private

//#endregion