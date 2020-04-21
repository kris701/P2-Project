//#region Header

const mySQL = require('mysql');
const util = require('util');

const serverConfig = {
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

    static retMSG = class {
        constructor(returnCode, message) {
            this.returnCode = returnCode;
            this.message = message;
        }
    }

    static async makeQuery(queryText, parameterArray) {
        try {
            if (queryText != null && parameterArray != null) {
                if (typeof queryText !== "string")
                    return failCodes.InputNotAString;
                if (queryText == "")
                    return failCodes.EmptyString;

                if (!Array.isArray(parameterArray))
                    return failCodes.InputNotAnArray;

                const db = makeDb(serverConfig);
                try {
                    let returnvalue = { recordset: [] };
                    returnvalue.recordset = await db.query(queryText, parameterArray);
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

    static isErrorCode(value) {
        if (typeof value == typeof 0)
            return true;
        return false;
    }
}

//#endregion

//#region Private

function makeDb(config) {
    const connection = mySQL.createConnection(config);
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