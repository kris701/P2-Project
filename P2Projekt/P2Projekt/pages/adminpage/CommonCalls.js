// Retrived from https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
module.export.getCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

module.export.getlogin() {
    return {
        username: getCookie("username"),
        password: getCookie("password")
    }
}