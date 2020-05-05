import { UC } from '../js/utils.js';

export class LC {
    static async getLoggedIn() {
        let credentials = await CheckCredentials(sessionStorage.getItem("username"), sessionStorage.getItem("password"));
        return credentials;
    }

    static async checkLogin(username, password) {
        let credentials = await CheckCredentials(username, password)
        return credentials;
    }
}

async function CheckCredentials(username, password) {
    if (username == null || password == null)
        return false;

    console.log(username);
    console.log(password);

    let returnValue = false;
    let code = await UC.jsonFetch(
        "https://dat2c1-3.p2datsw.cs.aau.dk/node0/admin/login", [
        new UC.FetchArg("username", username),
        new UC.FetchArg("password", password)
    ]);
    if (code.returnCode == 225)
        returnValue = true;

    return returnValue;
}