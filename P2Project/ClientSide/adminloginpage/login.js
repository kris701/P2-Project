import { UC } from '../js/utils.js';

let usernameInput = document.getElementById("input_username");
let passwordInput = document.getElementById("input_password");

usernameInput.addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault;
        document.getElementById("login_submit").click();
    }
});

passwordInput.addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault;
        document.getElementById("login_submit").click();
    }
});

async function login() {
    if (getLoggedIn()) {
        let nextPage = "/adminpage/admin.html"
        window.location.href = nextPage;
    }
    else {
        let username = document.getElementById("input_username").value;
        let password = document.getElementById("input_password").value;
        let credentials = await CheckCredentials(username, password);
        if (credentials) {
            sessionStorage.setItem("LoggedIn", "True");
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            let nextPage = "/adminpage/admin.html"
            window.location.href = nextPage;
        }
    }
}
document.getElementById("login_submit").onclick = login;

async function CheckCredentials(username, password) {
    let returnValue = false;
    let code = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/login?username=" + username + "&password=" + password).catch(e => console.log(e));
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
document.addEventListener("beforeunload", unloadPage);