//#region Header

var path = require('path');

var RCC = require(path.join(__dirname, '..', './ResourceCheck.js')).RCC;
var GTC = require("./GeneralTests.js").GTC;
var BCC = require(path.join(__dirname, '..', './BasicCalls.js')).BCC;
let failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;

var response = new BCC.retMSG(-1, "");
var req = {};
req.headers = {};
req.headers.host = "UnitTest";
req.url = "/admin/addnewroom";
var wrongReq = {};
wrongReq.headers = {};
wrongReq.headers.host = "UnitTest";
wrongReq.url = "/unittest";
var credentialsURL = {};
credentialsURL.Username = "User";
credentialsURL.Password = "UserPassword";
credentialsURL.roomName = "UnitTest";
var parametersURL = {};
parametersURL.Username = "Admin";
parametersURL.Password = "Password";

//#endregion

//#region Tests

describe('Check all resources test', function () {
    GTC.expectErrorCodeFromInput("Should fail with wrong credentials", RCC.checkAllResource(response, req, credentialsURL), failCodes.WrongInputCredentials);
    GTC.expectErrorCodeFromInput("Should fail with wrong parameters", RCC.checkAllResource(response, req, parametersURL), -1);
    GTC.expectErrorCodeFromInput("Should fail with wrong request path", RCC.checkAllResource(response, wrongReq, parametersURL), -1);
});

//#endregion