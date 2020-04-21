module.exports.UC = class {
    static async jsonFetch(url) {
        let response = await fetch(url);
        let returnData = await response.json();

        console.log(returnData);
        return returnData;
    }
}