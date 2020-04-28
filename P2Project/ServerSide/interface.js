try {
    let enableDebuging = true;
    let timeSinceLastCFGUpdate = new Date();

    //#region Header

    let BCC = require(__dirname + "/BasicCalls.js").BCC;
    let RCC = require(__dirname + "/ResourceCheck.js").RCC;
    let RC = require(__dirname + "/ReturnCodes.js");
    let CLC = require(__dirname + "/ConfigLoading.js").CLC;

    // Include modules
    let http = require("http");
    const queryString = require("querystring");

    //#endregion

    //#region Main server code

    // Main Server Code
    let server = http.createServer(async function (req, res) {

        timeSinceLastCFGUpdate = await CLC.checkForConfigUpdate(timeSinceLastCFGUpdate);

        let response = new BCC.retMSG(-1,"");
        try {
            let queryUrl = queryStringParse(req.url);
            response = await RCC.checkAllResource(response, req, queryUrl, enableDebuging);

            if (response.returnCode == -1) {
                BCC.errorWithTimestamp("Resource not found!");
                response = new RC.parseToRetMSG(RC.failCodes.ResourceNotFound);
            }

        } catch (err) {
            BCC.errorWithTimestamp(err);
            response = new BCC.retMSG(499, "An error occured on the server!");
        }

        res.writeHead(response.returnCode, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify(response.message));
        res.end();
    });

    function queryStringParse(url) {
        return queryString.parse(url.split("?")[1], "&", "=");
    }

    server.listen(3910);
    BCC.logWithTimestamp("Node.js server is running and listening at port 3910.");

    //#endregion

} catch (err) {
    //#region Error Catching

    // Simplified error for missing modules
    if (err.code == "MODULE_NOT_FOUND")
        BCC.logWithTimestamp("Use 'NPM INSTALL " + err.message.substring(err.message.indexOf("'"), err.message.lastIndexOf("'")) + "' to get the module");
    else
        BCC.logWithTimestamp(err)

    BCC.logWithTimestamp("\n Press any key to exit")
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0))

    //#endregion
}