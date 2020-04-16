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

    function CheckForResource(Request, TargetResource, QueryStringArray, QueryURL) {
        if (Request.url.includes(TargetResource)) {
            if (DoesQueryContainAllNeededKeys(QueryStringArray, QueryURL)) {
                console.error("Client (" + Request.headers.host + ") Attempted to request resource: " + Request.url + ". However input was wrong!");
                return false;
            }

            console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
            return true;
        }
        return false;
    }

    function DoesQueryContainAllNeededKeys(QueryStringArray, QueryURL) {
        let WrongInput = false;
        for (let i = 0; i < QueryStringArray.length; i++) {
            WrongInput = true;
            for (let j = 0; j < Object.keys(QueryURL).length; j++) {
                if (QueryStringArray[i] == Object.keys(QueryURL)[j]) {
                    WrongInput = false;
                    break;
                }
            }
            if (WrongInput)
                break;
        }
        return WrongInput;
    }

    async function ExecuteResource(FunctionCall, QueryStringArray, QueryURL) {
        if (QueryStringArray.length == 0)
            return await FunctionCall();
        else {
            let AccArr = TranslateQueryToResourceParameters(QueryStringArray, QueryURL);

            if (QueryStringArray.length == 1)
                return await FunctionCall(AccArr[0]);
            if (QueryStringArray.length == 2)
                return await FunctionCall(AccArr[0], AccArr[1]);
            if (QueryStringArray.length == 3)
                return await FunctionCall(AccArr[0], AccArr[1], AccArr[2]);
            if (QueryStringArray.length == 4)
                return await FunctionCall(AccArr[0], AccArr[1], AccArr[2], AccArr[3]);
            if (QueryStringArray.length == 5)
                return await FunctionCall(AccArr[0], AccArr[1], AccArr[2], AccArr[3], AccArr[4]);
        }
    }

    function TranslateQueryToResourceParameters(QueryStringArray, QueryURL) {
        let ReturnArray = new Array(QueryStringArray.length);
        for (let i = 0; i < QueryStringArray.length; i++) {
            for (let j = 0; j < Object.keys(QueryURL).length; j++) {
                if (QueryStringArray[i] == Object.keys(QueryURL)[j]) {
                    ReturnArray.splice(i, 0, QueryURL[Object.keys(QueryURL)[j]]);
                    break;
                }
            }
        }
        return ReturnArray;
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