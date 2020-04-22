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
        out += date.getMonth() + "-";
        out += date.getDate() + "T";
        out += date.getHours() + ":";
        out += date.getMinutes() + ":";
        out += date.getSeconds();
        return out;
    }
}