//This document contains the functions regarding the creation of graphs

export class GRPH {
    //Sensor data is an array
    static createGraph(predictionData, graphNum) {
        createCanvas(graphNum);
        
    }
}

function createCanvas(graphNum) {
    let container = document.querySelector(".container");
    let graphContainer = document.createElement("div");
    let canvas = document.createElement("CANVAS");

    graphContainer.setAttribute("class", "box");
    canvas.setAttribute("id", "graph" + graphNum);

    container.appendChild(graphContainer);
    graphContainer.appendChild(canvas);
}