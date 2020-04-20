//#region Header

const mysql = require('mysql');
const util = require('util');

const ServerConfig = {
    "host": "localhost",
    "user": "dat2c1-3@student.aau.dk",
    "password": "acYy96fYfbpcE76N",
    "database": "dat2c1_03",
    port: 3306
};

let failCodes = require(__dirname + "/ReturnCodes.js").failCodes;

//#endregion

//#region Public

module.exports.BCC = class {
    static async asyncForEach(array, callback) {
        if (!Array.isArray(array))
            return failCodes.InputNotAnArray;

        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    static ReturnMessage = class {
        constructor(ReturnCode, Message) {
            this.ReturnCode = ReturnCode;
            this.Message = Message;
        }
    }

    static async MakeQuery(QueryText, Inputs) {
        try {
            if (QueryText != null && Inputs != null) {
                if (typeof QueryText !== "string")
                    return failCodes.InputNotAString;
                if (QueryText == "")
                    return failCodes.EmptyString;

                if (!Array.isArray(Inputs))
                    return failCodes.InputNotAnArray;

                const db = makeDb(ServerConfig);
                try {
                    let returnvalue = { recordset: [] };
                    returnvalue.recordset = await db.query(QueryText, Inputs);
                    return returnvalue;
                } catch (err) {
                    return failCodes.DatabaseError;
                } finally {
                    await db.close();
                }
            }
            else {
                return failCodes.NoParameters;
            }
        }
        catch (err) {
            console.error(err);
            return failCodes.DatabaseError;
        }
    }

    static IsErrorCode(value) {
        if (typeof value == typeof 0)
            return true;
        return false;
    }
}

//#endregion

//#region Private

function makeDb(config) {
    const connection = mysql.createConnection(config);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        }
    };
}

//#endregion