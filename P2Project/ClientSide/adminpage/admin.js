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

function unloadPage() {
    let iframe = document.getElementById("iframe");
    iframe.parentNode.removeChild(iframe);
}
document.addEventListener("beforeunload", unloadPage);