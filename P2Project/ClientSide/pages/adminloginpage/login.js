import { CC } from './../adminpage/Cookies.js'
import { UC } from './../clientpage/js/utils.js'

async function login() {
    let cookie = CC.getLogin();
    let credentials = await CheckCredentials(cookie.username, cookie.password);
    if (credentials) {
        CC.setLogin(cookie.username, cookie.password);
        let nextPage = "/pages/adminpage/admin.html"
        window.location.href = nextPage;
    }
    else {
        let username = document.getElementById("input_username").value;
        let password = document.getElementById("input_password").value;
        credentials = await CheckCredentials(username, password);
        if (credentials) {
            setLogin(username, password);
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
    if (code == 225)
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
