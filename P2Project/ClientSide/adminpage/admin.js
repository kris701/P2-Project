function setIframe(path) {
    let iframe = document.getElementById("iframe");
    if (iframe != null)
        iframe.parentNode.removeChild(iframe);

    iframe = document.createElement("IFRAME");
    let container = document.getElementsByClassName("middleContainer")[0];

    iframe.src = path;
    iframe.height = 900;
    iframe.width = 1600;
    iframe.id = "iframe";
    container.insertAdjacentElement("afterbegin", iframe);
}

document.getElementById("roomButton").onclick = function () { setIframe("./sensormanagement/roommanagement/room.html") };
document.getElementById("sensortypeButton").onclick = function () { setIframe("./sensormanagement/sensortypemanagement/sensortype.html") };
document.getElementById("sensorButton").onclick = function () { setIframe("./sensormanagement/sensormanagement/sensor.html") };
document.getElementById("warningsButton").onclick = function () { setIframe("./warningsandsolutionsmanagement/warningsmanagement/warnings.html") };
document.getElementById("solutionsButton").onclick = function () { setIframe("./warningsandsolutionsmanagement/solutionsmanagement/solutions.html") };

function unloadPage() {
    let iframe = document.getElementById("iframe");
    iframe.parentNode.removeChild(iframe);
}
document.addEventListener("beforeunload", unloadPage);