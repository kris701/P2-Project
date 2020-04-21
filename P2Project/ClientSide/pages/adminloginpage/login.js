async function login() {
    let CC = new CookieClass;
    CC.deleteCookie("username");
    CC.deleteCookie("password");
    let cookie = CC.getLogin();
    let credentials = await CheckCredentials(cookie.username, cookie.password);
    console.log(credentials);
    if (credentials) {
        CC.setLogin(cookie.username, cookie.password);
        let nextPage = "/pages/adminpage/admin.html"
        window.location.href = nextPage;
    }
    else {
        let username = document.getElementById("input_username").value;
        let password = document.getElementById("input_password").value;
        console.log(username);
        console.log(password);
        credentials = await CheckCredentials(username, password);
        console.log(credentials)
        if (credentials) {
            CC.setLogin(username, password);
            let nextPage = "/pages/adminpage/admin.html"
            window.location.href = nextPage;
        }
    }
    //window.location.href = appendProperties(nextPage, getlogin())
}
document.getElementById("login_submit").onclick = login;

async function CheckCredentials(username, password) {
    let returnValue = false;
    let UC = new UtilsClass;
    //let code = await UC.jsonFetch("https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/login?username=" + username + "&password=" + password).catch(e => console.log(e));
    //if (code == "Credentials correct!")
    //    returnValue = true;
    if (username == "Admin" && password == "Password")
        returnValue = true;

    return returnValue;
}

//function appendProperties(url, properties) {
//    for (let key in properties) {
//        if (!url.contains("?")) url += "?";
//        else url += "&";

//        url += `${encodeURIComponent(key)}=${encodeURIComponent(properties[key])}`;
//    }
//    return url;
//}
