try {
    /*
        =========================
                Header
        =========================
    */

    let BCC = require(__dirname + "/BasicCalls.js").BCC;
    let RCC = require(__dirname + "/ResourceCheck.js").RCC;

    // Include modules
    let http = require("http");
    const querystring = require("querystring");

    /*
        =========================
                Code Part
        =========================
    */

    // Main Server Code
    let server = http.createServer(async function (req, res) {
        let response = new BCC.ReturnMessage(-1,"");
        try {
            let queryUrl = queryStringParse(req.url);
            response = await RCC.CheckAllResource(response, req, queryUrl);

            if (response.ReturnCode == -1) {
                console.error("Resource not found!");
                response = new BCC.ReturnMessage(404, "Resource not found!");
            }

        } catch (err) {
            console.error(err);
            response = new BCC.ReturnMessage(404, "An error occured on the server!");
        }

        res.writeHead(response.ReturnCode, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify(response.Message));
        res.end();
    });

    function queryStringParse(url) {
        return querystring.parse(url.split("?")[1], "&", "=");
    }

    server.listen(3910);
    console.log("Node.js server is running and listening at port 3910.");

} catch (err) {
    /*
        =========================
            Main Error catch
        =========================
    */



    // Simplified error for missing modules
    if (err.code == "MODULE_NOT_FOUND")
        console.log("Use 'NPM INSTALL " + err.message.substring(err.message.indexOf("'"), err.message.lastIndexOf("'")) + "' to get the module");
    else
        console.log(err)

    console.log("\n Press any key to exit")
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0))
}