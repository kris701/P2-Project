// This document contains functions regarding basic functions such as communication with the server

export class UC {
    static FetchArg = class {
        constructor(name, value) {
            this.name = name;
            this.value = value;
        }
    }

    static async jsonFetch(targetUrl, fetchArgArray) {
        if (fetchArgArray != null) {
            if (fetchArgArray.length != 0) {
                targetUrl += "?";
                for (let i = 0; i < fetchArgArray.length; i++) {
                    targetUrl += fetchArgArray[i].name + "=" + fetchArgArray[i].value;
                    if (i + 1 != fetchArgArray.length)
                        targetUrl += "&";
                }
            }
        }
        let response = await fetch(targetUrl);
        let returnData = await response.json();

        return returnData;
    }

    static dateToISOString(date) {
        let out = "";
        out += date.getFullYear() + "-";
        out += addZeroIfTooSmall(date.getMonth() + 1, "-");
        out += addZeroIfTooSmall(date.getDate(), "T");
        out += addZeroIfTooSmall(date.getHours(), ":");
        out += addZeroIfTooSmall(date.getMinutes(), ":");
        out += addZeroIfTooSmall(date.getSeconds(), "");
        return out;
    }

    static fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1) {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 15);
    }

    static unfade(element, toStyle) {
        element.style.opacity = 0;
        var op = 0.01;  // initial opacity
        if (toStyle == null)
            element.style.display = 'block';
        else
            element.style.display = toStyle;
        var timer = setInterval(function () {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 15);
    }

    static clearSelect(select) {
        for (let i = select.options.length - 1; i >= 0; i--) {
            select.options.remove(1)
        }
    }
}

function addZeroIfTooSmall(value, endCharacter) {
    if (value < 10)
        return "0" + value + endCharacter;
    else
        return value + endCharacter;
}