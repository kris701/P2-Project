try {
    class Credentials {
        constructor(Username, Password) {
            this.Username = Username;
            this.Password = Password;
        }
    }

    let AdminCredentials = [new Credentials("Admin", "Password"), new Credentials("Admin2", "Password2")]

    let prediction = require(__dirname + "/PredictionAlgorithms.js");
    let sensorInfo = require(__dirname + "/SimpleSensorInfo.js");
    let warningAndSolution = require(__dirname + "/WarningAndSolutionSelectionAlgorithm");

    let http = require("http");
    const querystring = require("querystring");

    let server = http.createServer(async function (req, res) {
        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });

        try {
            if (CheckForResource(req, "/getsensorinfo")) {
                let response = await sensorInfo.getSensorInfoQuery();
                res.write(JSON.stringify(response));
            }
            else if (CheckForResource(req, "/getpredictiondata")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (queryUrl.room != null) {
                    let response = await prediction.getPredictionDatetimeQuery(queryUrl.room);
                    res.write(JSON.stringify(response));
                }
            }
            else if (CheckForResource(req, "/getwarningsandsolutions")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (queryUrl.room != null) {
                    let predictionData = await prediction.getPredictionDatetimeQuery(queryUrl.room);
                    let response = await warningAndSolution.getWarningsAndSolutions(predictionData);
                    res.write(JSON.stringify(response));
                }
            } 
            else if (CheckForResource(req, "/admin")) {
                var queryUrl = queryStringParse(req.url); // This splits the url at the ? sign and returns the last part, so abc?def becomes def

                if (CheckCredentials(new Credentials(queryUrl.Username, queryUrl.Password))) {
                    if (CheckForResource(req, "/getallwarningsandsolutions")) {

                    }
                    else if (CheckForResource(req, "/addnewwarning")) {

                    }
                    else if (CheckForResource(req, "/removewarning")) {

                    }
                    else if (CheckForResource(req, "/updatewarning")) {

                    }
                    else if (CheckForResource(req, "/addnewsolution")) {

                    }
                    else if (CheckForResource(req, "/removesolutionreference")) {

                    }
                    else if (CheckForResource(req, "/updatesolution")) {

                    }
                    else if (CheckForResource(req, "/addexistingsolution")) {

                    }
                    else if (CheckForResource(req, "/removesolution")) {

                    }
                    else if (CheckForResource(req, "/getallsolutions")) {

                    }
                    else if (CheckForResource(req, "/getsensorinfo")) {
                        
                    }
                    else if (CheckForResource(req, "/addnewroom")) {
                        
                    }
                    else if (CheckForResource(req, "/removeroom")) {
                        
                    }
                    else if (CheckForResource(req, "/updateroom")) {
                        
                    }
                    else if (CheckForResource(req, "/getallsensors")) {
                        
                    }
                    else if (CheckForResource(req, "/addexistingsensor")) {
                        
                    }
                    else if (CheckForResource(req, "/addnewsensor")) {
                        
                    }
                    else if (CheckForResource(req, "/removesensorreference")) {
                        
                    }
                    else if (CheckForResource(req, "/removesensor")) {
                        
                    }
                    else if (CheckForResource(req, "/getallsensortypes")) {
                        
                    }
                    else if (CheckForResource(req, "/addexistingsensortype")) {
                        
                    }
                    else if (CheckForResource(req, "/addnewsensortypereference")) {
                        
                    }
                    else if (CheckForResource(req, "/removesensortype")) {
                        
                    }
                    else if (CheckForResource(req, "/removesensortypereference")) {
                        
                    }
                    else if (CheckForResource(req, "/updatesensortypethreshold")) {
                        
                    }      
                }
                else
                    CredentialsWrong(req, res);
            }
            else {
                console.log("Client (" + req.headers.host + ") Attempted to request resource: " + req.url + ". However the resource was not found.");
                res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
                res.write(JSON.stringify("Resource not found!"));
            }

        } catch (err) {
            console.log(err);
            res.write(JSON.stringify("An error occured on the server!"));
        }

        res.end();
    });

    function queryStringParse(url) {
        return querystring.parse(url.split("?")[1], "&", "="); // This splits the url at the ? sign and returns the last part, so abc?def becomes def
    }

    function CheckForResource(Request, TargetResource) {
        if (Request.url.includes(TargetResource)) {
            console.log("Client (" + Request.headers.host + ") requested resource: " + TargetResource);
            return true;
        }
        else return false;
    }

    function CheckCredentials(CredentialsInfo) {
        let credentialsCheck = false;

        AdminCredentials.forEach(function (v) {
            if (v.Username == CredentialsInfo.Username && v.Password == CredentialsInfo.Password)
                credentialsCheck = true;
        });

        return credentialsCheck;
    }

    function CredentialsWrong(req, res) {
        console.log("Client (" + req.headers.host + ") Attempted to request resource: " + req.url + " with wrong credentials");
        res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify("Wrong username or password"));
    }

    server.listen(5000);
    console.log("Node.js server is running and listening at port 5000.");

} catch (err) {
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