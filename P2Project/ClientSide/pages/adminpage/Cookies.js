// Retrived from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
//#region Public
// Cookies Class
export default class CC {
    static getLogin() {
        return {
            username: getCookie("username"),
            password: getCookie("password")
        }
    }

    static setLogin(user, pass) {
        setCookie("username", user, 7);
        setCookie("password", pass, 7);
    }
}
//#endregion

//#region Private
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

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
//#endregion