// This document contains the functions regarding the display of warnings

let warningContainer = document.querySelector(".warningContainer");

export class WARN {
    static clearWarningArea() {
        // For as long as there are children in container the first child will be removed
        while (warningContainer.firstChild) {
            warningContainer.removeChild(warningContainer.firstChild);
        }
    }

    static displayWarnings(warningDataForRoom) {
        for (let i = 0; i < warningDataForRoom.data.length; i++) {
            createNewWarning(warningDataForRoom.data[i].solutionInfo.warningPriority.priority, warningDataForRoom.data[i]);
        }
    }

    static removeWarning() {

    }
}

function createNewWarning(priority, warningData) {
    let warning = document.createElement("div");
    let topParagraph = document.createElement("p");
    let bottomParagraph = document.createElement("p");
    let message = document.createTextNode(warningData.message);
    let solutionMessage = document.createTextNode(warningData.solutionInfo.message);

    warning.setAttribute("id", "priority" + priority);
    warning.setAttribute("class", "warningBox");

    warningContainer.appendChild(warning);
    warning.appendChild(topParagraph);
    warning.appendChild(bottomParagraph);

    topParagraph.appendChild(message);
    bottomParagraph.appendChild(solutionMessage);
}
