

function login () {
    let username = document.getElementById("input_username").value;
    let password = document.getElementById("input_password").value;
    setLogin(username, password);
    let nextPage = "/"
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
// Retrived from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
// Retrived from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function setLogin(username, password) {
    setCookie("username", username, 7);
    setCookie("password", password, 7);
}

function getlogin() {
    return {
        username: getCookie("username"),
        password: getCookie("password")
    }
}

function appendProperties(url, properties) {
    for (let key in properties) {
        if (!url.contains("?")) url += "?";
        else url += "&";

        url += `${encodeURIComponent(key)}=${encodeURIComponent(properties[key])}`;
    }
    return url;
}
