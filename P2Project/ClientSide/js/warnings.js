// This document contains the functions regarding the display of warnings

let warningContainer = document.querySelector(".warningContainer");
import { UC } from './utils.js';

export class WARN {
    static clearWarningArea() {
        // For as long as there are children in container the first child will be removed
        while (warningContainer.firstChild) {
            warningContainer.removeChild(warningContainer.firstChild);
        }
    }

    static displayWarnings(warningDataForRoom) {
        for (let i = 0; i < warningDataForRoom.data.length; i++) {
            createNewWarning(warningDataForRoom.data[i].solutionInfo.warningPriority.priority, warningDataForRoom.data[i], i);
        }
    }
}

function createNewWarning(priority, warningData, warningNum) {
    let removeButton = document.createElement("input");
    let warning = document.createElement("div");
    let topParagraph = document.createElement("p");
    let bottomParagraph = document.createElement("p");
    let message = document.createTextNode(warningData.message);
    let solutionMessage = document.createTextNode(warningData.solutionInfo.message);

    warning.setAttribute("id", "priority" + priority);
    warning.setAttribute("id", "warningNum" + warningNum);
    warning.setAttribute("class", "warningBox");
    removeButton.setAttribute("type", "submit");
    removeButton.setAttribute("value", "X");
    removeButton.setAttribute("id", warningNum);
    topParagraph.setAttribute("style", "text-transform: uppercase;font-weight: bold;");

    warningContainer.appendChild(warning);
    warning.appendChild(removeButton);
    warning.appendChild(topParagraph);
    warning.appendChild(bottomParagraph);

    removeButton.onclick = removeButton_Click;
    topParagraph.appendChild(message);
    bottomParagraph.appendChild(solutionMessage);

    window.setTimeout(fadeOutAndRemove.bind(this, warning), 60000);
}

function fadeOutAndRemove(element) {
    UC.fade(element);
}

function removeButton_Click(element) {
    let toBeDeleted = document.getElementById("warningNum" + element.currentTarget.id);
    fadeOutAndRemove(toBeDeleted);
}