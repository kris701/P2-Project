﻿import { UC } from '../js/utils.js';

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
    let credentials = await CheckCredentials(sessionStorage.getItem("username"), sessionStorage.getItem("password"));
    if (credentials) {
        let nextPage = "/pages/adminpage/admin.html"
        window.location.href = nextPage;
    }
    else {
        let username = document.getElementById("input_username").value;
        let password = document.getElementById("input_password").value;
        credentials = await CheckCredentials(username, password);
        if (credentials) {
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            let nextPage = "/pages/adminpage/admin.html"
            window.location.href = nextPage;
        }
    }
    //window.location.href = appendProperties(nextPage, getlogin())
}
document.getElementById("login_submit").onclick = login;

async function CheckCredentials(username, password) {
    let returnValue = false;
    let code = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/login?username=" + username + "&password=" + password).catch(e => console.log(e));
    if (code == "Credentials correct!")
        returnValue = true;

    return returnValue;
}

function unloadPage() {
    sessionStorage.clear();
}
document.addEventListener("beforeunload", unloadPage);

//function appendProperties(url, properties) {
//    for (let key in properties) {
//        if (!url.contains("?")) url += "?";
//        else url += "&";

//        url += `${encodeURIComponent(key)}=${encodeURIComponent(properties[key])}`;
//    }
//    return url;
//}