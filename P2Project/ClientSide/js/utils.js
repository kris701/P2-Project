// This document contains functions regarding basic functions such as communication with the server

export class UC {
    static async jsonFetch(url) {
        let response = await fetch(url);
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

    static fadeAndRemove(element, from) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1) {
                clearInterval(timer);
                element.style.display = 'none';
                from.removeChild(element.firstChild);
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
}

function addZeroIfTooSmall(value, endCharacter) {
    if (value < 10)
        return "0" + value + endCharacter;
    else
        return value + endCharacter;
}