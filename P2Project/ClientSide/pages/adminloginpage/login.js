let CommonCalls = requrie("CommonCalls.js")

function login () {
    let username = document.getElementById("input_username").value;
    let password = document.getElementById("input_password").value;
    setLogin(username, password);
    let nextPage = "/pages/adminpage/admin.html"
    window.location.href = appendProperties(nextPage, getlogin())
}

document.getElementById("login_submit").onclick = login

// Retrived from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

CommonCalls.getlogin();

// Retrived from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function setLogin(username, password) {
    setCookie("username", username, 7);
    setCookie("password", password, 7);
}

function appendProperties(url, properties) {
    for (let key in properties) {
        if (!url.contains("?")) url += "?";
        else url += "&";

        url += `${encodeURIComponent(key)}=${encodeURIComponent(properties[key])}`;
    }
    return url;
}

// For debugging
function Cookie() {
    console.log(CommonCalls.getCookie);
}
