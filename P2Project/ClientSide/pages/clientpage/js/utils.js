//This document contains functions regarding basic functions such as communication with the server

export class UtilsClass {
    static async jsonFetch(url) {
        let response = await fetch(url);
        let returnData = await response.json();

        console.log(returnData);
        return returnData;
    }
}