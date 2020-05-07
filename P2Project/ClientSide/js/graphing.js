// This document contains the functions regarding the creation of graphs

export class GRPH {

    // Clears all current children in the parent container "container"
    static clearData(sectionToClear) {
        let container = document.querySelector(sectionToClear);

        // For as long as there are children in container the first child will be removed
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    // Sensor data is an array
    static createPredictionsGraph(predictionData, graphNum, xLength, interval, section) {
        createCanvas("graph" + graphNum, section);

        // Resets time and dataSet to be empty arrays
        let newColorR = randomValue(0, 255);
        let newColorG = randomValue(0, 255);
        let newColorB = randomValue(0, 255);
        let xAxis = createXAxis(interval, xLength);
        let yAxis = [{
            label: predictionData.name,
            backgroundColor: generate_rgba(newColorR, newColorG, newColorB, 0.2),
            borderColor: generate_rgba(newColorR, newColorG, newColorB, 1),
            data: generateYValuesPredictions(predictionData, xLength)
        }];
        let ctx = document.getElementById("graph" + graphNum);
        generateGraph(ctx, xAxis, yAxis, null, "Time until", "Pass threshold again (%)");

    }

    // Generate a graph from all the prediction data
    static createTotalGraphOfPredictions(predictionData, graphNum, xLength, section) {
        createCanvas("graph" + graphNum, section);

        let xAxis = createXAxis(predictionData.interval, xLength);
        let yAxis = populateYValuesPredictions(
            predictionData,
            xLength,
            predictionData.interval);

        let ctx = document.getElementById("graph" + graphNum);
        generateGraph(ctx, xAxis, yAxis, null, "Time until", "Pass threshold again (%)");

    }

    // Gets the hightes value from all the prediction data, this is so that we know a max on the x axis
    static getHighestTimestampPredictions(predictionData) {
        let highest = 0;
        for (let i = 0; i < predictionData.data.length; i++) {
            for (let j = 0; j < predictionData.data[i].thresholdPasses.length; j++) {
                if (predictionData.data[i].thresholdPasses[j].timeUntil > highest)
                    highest = predictionData.data[i].thresholdPasses[j].timeUntil;
            }
        }
        return highest;
    }

    static getHighestTimestampLiveData(data) {
        let highest = 0;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].liveDataArray.length; j++) {
                for (let l = 0; l < data[i].liveDataArray[j].sensorLiveData.length; l++) {
                    if (data[i].liveDataArray[j].sensorLiveData[l].timeStamp > highest)
                        highest = data[i].liveDataArray[j].sensorLiveData[l].timeStamp;
                }
            }
        }
        return highest;
    }

    static createLiveDataGraph(data, graphNum, xLength, sensorType, section) {
        createCanvas("livegraph" + graphNum, section);

        let xAxis = createBackwardsXAxis(data.interval, xLength);
        let yAxis = populateYValuesLiveData(
            data.data,
            xLength,
            sensorType);

        let ctx = document.getElementById("livegraph" + graphNum);
        generateGraph(ctx, xAxis, yAxis, { beginAtZero: true }, "Time ago", "Sensor value");
    }
}

// Populates the parent container "container" with divs and canvas within each
function createCanvas(graphNum, section) {
    let container = document.querySelector(section);
    let graphContainer = document.createElement("div");
    let canvas = document.createElement("CANVAS");

    graphContainer.setAttribute("class", "box");
    canvas.setAttribute("id", graphNum);

    graphContainer.style.cursor = 'pointer';
    graphContainer.onclick = resizeGraph;

    container.appendChild(graphContainer);
    graphContainer.appendChild(canvas);
}

function resizeGraph(element) {
    let zoonIn = true;
    if (element.currentTarget.style.width == "775px")
        zoonIn = false;
    for (let i = 0; i < element.currentTarget.parentElement.childElementCount; i++) {
        element.currentTarget.parentElement.children[i].setAttribute("style", "");
    }

    if (zoonIn)
        element.currentTarget.setAttribute("style", "height: 460px; width: 775px");
}

// Generates a graph object
function generateGraph(container, xAxis, yAxis, altTicks, xLabelText, yLabelText) {

    if (altTicks == null)
        altTicks = { beginAtZero: true, max: 100 };

    new Chart(container, {
        // The type of chart
        type: "line",

        // The data for our dataset
        data: {
            labels: xAxis,
            datasets: yAxis
        },

        // Configuration options to start the Y values from 0 and up
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                yAxes: [{
                    display: true,
                    ticks: altTicks,
                    scaleLabel: {
                        display: true,
                        labelString: yLabelText,
                        fontFamily: "Montserrat"
                    },
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: xLabelText,
                        fontFamily: "Montserrat"
                    },
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontFamily: "Montserrat"
                }
            }
        }
    });
}

// Creates the Xaxis, by the interval and the amount of steps it should take
function createXAxis(interval, until) {
    let xAxis = [];
    for (let i = 0; i < until; i++) {
        if (i * interval >= 60)
            xAxis.push(Math.floor((i * interval) / 60) + "H " + ((i * interval) % 60) + "M");
        else
            xAxis.push(i * interval + " min");
    }
    return xAxis;
}

function createBackwardsXAxis(interval, until) {
    let xAxis = [];
    for (let i = until - 1; i >= 0; i--) {
        if (i * interval >= 60)
            xAxis.push(Math.floor((i * interval) / 60) + "H " + ((i * interval) % 60) + "M ago");
        else
            xAxis.push(i * interval + " min ago");
    }
    return xAxis;
}

// Makes all the Y values foreach of the datasets from predections
function populateYValuesPredictions(predictionData, until, interval) {
    let yValues = [];

    for (let i = 0; i < predictionData.data.length; i++) {

        let newColorR = randomValue(0, 255);
        let newColorG = randomValue(0, 255);
        let newColorB = randomValue(0, 255);
        yValues.push({
            label: predictionData.data[i].name,
            backgroundColor: generate_rgba(newColorR, newColorG, newColorB, 0.2),
            borderColor: generate_rgba(newColorR, newColorG, newColorB, 1),
            data: generateYValuesPredictions(predictionData.data[i], until, interval)
        });
    }

    return yValues;
}

// Generates the Y values for a single dataset, the output is filled with 0, unless there is a valid datapoint
function generateYValuesPredictions(predictionData, until) {
    let dataSet = [];
    let fromJ = 0;
    let found = false;
    for (let x = 0; x < until; x++) {
        for (let i = fromJ; i < predictionData.thresholdPasses.length; i++) {
            if (predictionData.thresholdPasses[i].timeUntil == x) {
                dataSet.push(predictionData.thresholdPasses[i].timesExceeded);
                fromJ = i + 1;
                found = true;
                break;
            }
        }
        if (!found)
            dataSet.push(0);
        found = false;
    }
    return dataSet;
}

function populateYValuesLiveData(data, until, sensorType) {
    let yValues = [];

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].liveDataArray.length; j++) {
            if (data[i].sensorType == sensorType) {
                let newColorR = randomValue(0, 255);
                let newColorG = randomValue(0, 255);
                let newColorB = randomValue(0, 255);

                yValues.push({
                    label: data[i].sensorType + ": Sensor " + data[i].liveDataArray[j].sensorID,
                    backgroundColor: generate_rgba(newColorR, newColorG, newColorB, 0.2),
                    borderColor: generate_rgba(newColorR, newColorG, newColorB, 1),
                    data: generateYValuesLiveData(data[i].liveDataArray[j], until)
                });
                yValues.push({
                    label: data[i].sensorType + ": Sensor " + data[i].liveDataArray[j].sensorID + " Threshold",
                    backgroundColor: "rgba(0,0,0,0)",
                    borderColor: "rgba(0,0,0,1)",
                    data: generateThresholdValues(data[i].liveDataArray[j].sensorThreshold, until)
                });
            }
        }
    }

    return yValues;
}

function generateYValuesLiveData(data, until) {
    let dataSet = [];
    let fromJ = 0;
    let found = false;
    for (let x = until - 1; x >= 0; x--) {
        for (let i = fromJ; i < data.sensorLiveData.length; i++) {
            if (data.sensorLiveData[i].timeStamp == x) {
                dataSet.push(data.sensorLiveData[i].sensorValue);
                fromJ += 1;
                found = true;
                break;
            }
        }
        if (!found)
            dataSet.push(0);
        found = false;
    }
    return dataSet;
}

function generateThresholdValues(threshold, until) {
    let dataSet = [];

    for (let x = 0; x < until; x++) {
        dataSet.push(threshold);
    }
    return dataSet;
}

function generate_rgba(r, g, b, alpha) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function randomValue(min, max) {
    let o = Math.round, r = Math.random, s = 255;
    return o(r() * s);
}