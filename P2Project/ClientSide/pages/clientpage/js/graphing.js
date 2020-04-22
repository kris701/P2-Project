// This document contains the functions regarding the creation of graphs

let time = [];
let dataSet = [];
let interval = 15;

export class GRPH {

    // Clears all current children in the parent container "container"
    static clearGraphArea() {
        let container = document.querySelector(".container");

        // For as long as there are children in container the first child will be removed
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    // Sensor data is an array
    static createGraph(predictionData, graphNum) {
        createCanvas(graphNum);

        // Resets time and dataSet to be empty arrays
        time = [];
        dataSet = [];

        disectData(predictionData, time, dataSet);

        let ctx = document.getElementById("graph" + graphNum);
        let chart = new Chart(ctx, {
            // The type of chart
            type: "line",

            // The data for our dataset
            data: {
                labels: time,
                datasets: [{
                    label: predictionData.name,
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: dataSet
                }]
            },

            // Configuration options go here
            options: {}
        });

    }
}

// Populates the parent container "container" with divs and canvas within each
function createCanvas(graphNum) {
    let container = document.querySelector(".container");
    let graphContainer = document.createElement("div");
    let canvas = document.createElement("CANVAS");

    graphContainer.setAttribute("class", "box");
    canvas.setAttribute("id", "graph" + graphNum);

    container.appendChild(graphContainer);
    graphContainer.appendChild(canvas);
}

// Disects the data into smaller more easy to understand bits
function disectData(predictionData, time, dataSet) {
    for (let i = 0; i < predictionData.thresholdPasses.length; i++) {
        time.push(predictionData.thresholdPasses[i].timeUntil * interval);
        dataSet.push(predictionData.thresholdPasses[i].timesExceeded);
    }
}
