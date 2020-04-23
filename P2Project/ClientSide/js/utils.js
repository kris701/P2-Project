// This document contains functions regarding basic functions such as communication with the server

export class UC {
    static async jsonFetch(url) {
        let response = await fetch(url);
        let returnData = await response.json();

        return returnData;
    }

    static dateToISOString(date) {
        let out = "";
        out += date.getFullYear() + "-";
        out += AddZeroIfTooSmall(date.getMonth() + 1, "-");
        out += AddZeroIfTooSmall(date.getDate(), "T");
        out += AddZeroIfTooSmall(date.getHours(), ":");
        out += AddZeroIfTooSmall(date.getMinutes(), ":");
        out += AddZeroIfTooSmall(date.getSeconds(), "");
        return out;
    }
}

function AddZeroIfTooSmall(value, endCharacter) {
    if (value < 10)
        return "0" + value + endCharacter;
    else
        return value + endCharacter;
}