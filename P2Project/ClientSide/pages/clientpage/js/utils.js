function UtilsClass() {
    this.jsonFetch = async function (url) {
        let response = await fetch(url);
        let returnData = await response.json();

        console.log(returnData);
        return returnData;
    }
}