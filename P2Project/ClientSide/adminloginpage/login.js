import { UC } from '../js/utils.js';

//#region eventSetup

//#region loginContainer

let input_Username = document.getElementById("input_Username");
input_Username.addEventListener("keyup", input_Username_keyup);
let input_Password = document.getElementById("input_Password");
input_Password.addEventListener("keyup", input_Password_keyup);
let login_SubmitButton = document.getElementById("login_SubmitButton");
login_SubmitButton.onclick = login_SubmitButton_Click;
let wrongCredentialsLabel = document.getElementById("wrongCredentialsLabel");

document.addEventListener("beforeunload", document_beforeunload);

//#endregion

//#endregion

//#region eventCalls

function input_Username_keyup() {
    if (event.keyCode == 13) {
        event.preventDefault;
        ClickLoginButton();
    }
}

function input_Password_keyup() {
    if (event.keyCode == 13) {
        event.preventDefault;
        ClickLoginButton();
    }
}

async function login_SubmitButton_Click() {
    await login();
}

async function document_beforeunload() {
    unloadPage();
}

//#endregion

//#region backendCode

function ClickLoginButton() {
    login_SubmitButton.click();
}

async function login() {
    if (getLoggedIn()) {
        let nextPage = "/adminpage/admin.html"
        window.location.href = nextPage;
    }
    else {
        let credentials = await CheckCredentials(input_Username.value, input_Password.value);
        if (credentials) {
            sessionStorage.setItem("LoggedIn", "True");
            sessionStorage.setItem("username", input_Username.value);
            sessionStorage.setItem("password", input_Password.value);
            let nextPage = "/adminpage/admin.html"
            window.location.href = nextPage;
        }
        else
            await UC.unfade(wrongCredentialsLabel);
    }
}

async function CheckCredentials(username, password) {
    let returnValue = false;
    let code = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/login", [
        new UC.FetchArg("username", username),
        new UC.FetchArg("password", password)
    ]);
    if (code == "Credentials correct!")
        returnValue = true;

    return returnValue;
}

export function getLoggedIn() {
    if (sessionStorage.getItem("LoggedIn") == "True")
        return true;
    return false;
}

function unloadPage() {
    sessionStorage.clear();
}

//#endregion