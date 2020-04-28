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

let RC = require(__dirname + "/ReturnCodes.js");

//#endregion

//#region Public

module.exports.BCC = class {
    static async asyncForEach(array, callback) {
        if (!Array.isArray(array))
            return RC.failCodes.InputNotAnArray;

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
                    return RC.failCodes.InputNotAString;
                if (queryText == "")
                    return RC.failCodes.EmptyString;

                if (!Array.isArray(parameterArray))
                    return RC.failCodes.InputNotAnArray;

                const db = makeDb(serverConfig);
                try {
                    let returnvalue = { recordset: [] };
                    returnvalue.recordset = await db.query(queryText, parameterArray);
                    return returnvalue;
                } catch (err) {
                    return RC.failCodes.DatabaseError;
                } finally {
                    await db.close();
                }
            }
            else {
                return RC.failCodes.NoParameters;
            }
        }
        catch (err) {
            console.error(err);
            return RC.failCodes.DatabaseError;
        }
    }

    static isErrorCode(value) {
        if (typeof value == typeof 0)
            return true;
        return false;
    }

    static async getSensorTypeName(sensorTypeID) {
        let result;

        let ret = await module.exports.BCC.makeQuery("SELECT * FROM SensorTypes WHERE sensorType=?", [sensorTypeID]);
        if (module.exports.BCC.isErrorCode(ret))
            return result;
        result = ret.recordset[0].typeName;

        return result;
    }

    static async pushItem(recordset, result) {
        if (result == null)
            result = [];
        await module.exports.BCC.asyncForEach(recordset, async function (v) {
            result.push(v);
        });
        return result;
    }

    static roundToDigit(num) {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    static logWithTimestamp(message) {
        let date = new Date();
        console.log(
            addZeroIfLessThanTen(date.getDate()) + "-" +
            addZeroIfLessThanTen(date.getMonth()) + " " +
            addZeroIfLessThanTen(date.getHours()) + ":" +
            addZeroIfLessThanTen(date.getMinutes()) + ":" +
            addZeroIfLessThanTen(date.getSeconds()) + " : " +
            message);
    }

    static errorWithTimestamp(message) {
        let date = new Date();
        console.log(
            addZeroIfLessThanTen(date.getDate()) + "-" +
            addZeroIfLessThanTen(date.getMonth()) + " " +
            addZeroIfLessThanTen(date.getHours()) + ":" +
            addZeroIfLessThanTen(date.getMinutes()) + ":" +
            addZeroIfLessThanTen(date.getSeconds()) + " : " +
            "(ERR) " +
            message);
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

function addZeroIfLessThanTen(number) {
    if (number < 10)
        number = "0" + number;
    return number;
}

//#endregion
