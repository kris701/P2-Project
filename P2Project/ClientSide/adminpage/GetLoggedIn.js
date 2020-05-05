import { LC } from './LoginUtils.js'

async function pageLoadCheck() {
    let credentials = await LC.getLoggedIn();
    if (credentials != true)
        window.location.href = "/adminloginpage/login.html";
}

pageLoadCheck();