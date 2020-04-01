module.exports.asyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports.QueryValue = class {
    constructor(Name, Type, Value) {
        this.Name = Name;
        this.Type = Type;
        this.Value = Value;
    }
}

module.exports.MakeQuery = async function (QueryText, Inputs) {
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