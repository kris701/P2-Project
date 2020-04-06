/*
    =========================
            Header
    =========================
*/

// Empty

/*
    =========================
            Code Part
    =========================
*/
// Public Area
// BCC, Basic Calls Class

module.exports.BCC = class {
    static async asyncForEach(array, callback) {
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
        const fs = require("fs");
        const sql = require("mssql");
        let file = fs.readFileSync(__dirname + "/Config.json");
        await sql.connect(JSON.parse(file));

        var request = new sql.Request();

        await this.asyncForEach(Inputs, async function (Value) {
            request.input(Value.Name, Value.Type, Value.Value);
        });

        return await request.query(QueryText);
    }
}

// Private Area