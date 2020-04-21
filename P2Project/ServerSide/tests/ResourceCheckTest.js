//#region Header

var path = require('path');
var expect = require('chai').expect;

var ResourceCheck = require(path.join(__dirname, '..', './ResourceCheck.js'));
var failCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).failCodes;
var successCodes = require(path.join(__dirname, '..', './ReturnCodes.js')).successCodes;
var generalTests = require("./GeneralTests.js").GTC;
var BCC = require(path.join(__dirname, '..', './BasicCalls.js')).BCC;

var Response = new BCC.ReturnMessage(-1, "");
var Req = {};
Req.headers = {};
Req.headers.host = "UnitTest";
Req.url = "/admin/addnewroom";
var WrongReq = {};
WrongReq.headers = {};
WrongReq.headers.host = "UnitTest";
WrongReq.url = "/unittest";
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
    generalTests.ExpectErrorCodeFromInput("Should fail with wrong credentials", ResourceCheck.RCC.CheckAllResource(Response, Req, credentialsURL), 404);
    generalTests.ExpectErrorCodeFromInput("Should fail with wrong parameters", ResourceCheck.RCC.CheckAllResource(Response, Req, parametersURL), -1);
    generalTests.ExpectErrorCodeFromInput("Should fail with wrong request path", ResourceCheck.RCC.CheckAllResource(Response, WrongReq, parametersURL), -1);
});

//#endregion