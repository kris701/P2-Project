/*
    =========================
            Header
    =========================
*/

const fs = require("fs");
const sql = require("mssql");
const ServerConfig = {
    "server": "sql6009.site4now.net",
    "user": "DB_A4BDCF_p2projekt_admin",
    "password": "a12345678",
    "database": "DB_A4BDCF_p2projekt"
};

let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;

/*
    =========================
            Code Part
    =========================
*/
// Public Area
// BCC, Basic Calls Class

module.exports.BCC = class {
    static async asyncForEach(array, callback) {
        if (!Array.isArray(array))
            return failCodes.InputNotAnArray;

        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    static QueryValue = class {
        constructor(Name, Type, Value) {
            this.Name = Name;
            this.Type = Type;
            this.Value = Value;
        }
    }

    static async MakeQuery(QueryText, Inputs) {
        if (typeof QueryText !== "string")
            return failCodes.InputNotAString;
        if (QueryText == "")
            return failCodes.EmptyString;

        if (!Array.isArray(Inputs))
            return failCodes.InputNotAnArray;

        await sql.connect(ServerConfig);

        var request = new sql.Request();

        await this.asyncForEach(Inputs, async function (Value) {
            request.input(Value.Name, Value.Type, Value.Value);
        });

        return await request.query(QueryText);
    }
}

// Private Area