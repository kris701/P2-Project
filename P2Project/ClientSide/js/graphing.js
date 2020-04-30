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
    static createGraph(predictionData, graphNum, xLength, interval, section) {
        createCanvas(graphNum, section);

        // Resets time and dataSet to be empty arrays
        let xAxis = createXAxis(interval, xLength);
        let yAxis = [{
            label: predictionData.name,
            backgroundColor: "rgba(255, 99, 132, 0.2",
            borderColor: "rgb(255, 99, 132)",
            data: generateYValues(predictionData, xLength)
        }];
        let ctx = document.getElementById("graph" + graphNum);
        generateGraph(ctx, xAxis, yAxis);

    }

    // Generate a graph from all the prediction data
    static createTotalGraph(predictionData, graphNum, xLength, section) {
        createCanvas(graphNum, section);

        let xAxis = createXAxis(predictionData.interval, xLength);
        let yAxis = populateYValues(
            predictionData,
            xLength,
            predictionData.interval,
            "rgba(128, 99, 132, 0.2",
            "rgb(128, 99, 132)");

        let ctx = document.getElementById("graph" + graphNum);
        generateGraph(ctx, xAxis, yAxis);

    }

    // Gets the hightes value from all the prediction data, this is so that we know a max on the x axis
    static getHighestTimestamp(predictionData) {
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
        createCanvas(graphNum, section);

        let xAxis = createXAxis(data.interval, xLength);
        let yAxis = populateYValuesLiveData(
            data.data,
            xLength,
            data.interval,
            "rgba(128, 99, 132, 0.2",
            "rgb(128, 99, 132)",
            sensorType);

        let ctx = document.getElementById("graph" + graphNum);
        generateGraphLive(ctx, xAxis, yAxis);
    }
}

// Populates the parent container "container" with divs and canvas within each
function createCanvas(graphNum, section) {
    let container = document.querySelector(section);
    let graphContainer = document.createElement("div");
    let canvas = document.createElement("CANVAS");

    graphContainer.setAttribute("class", "box");
    canvas.setAttribute("id", "graph" + graphNum);

    container.appendChild(graphContainer);
    graphContainer.appendChild(canvas);
}

// Generates a graph object
function generateGraph(container, xAxis, yAxis) {
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
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    }
                }]
            }
        }
    });
}

// Creates the Xaxis, by the interval and the amount of steps it should take
function createXAxis(interval, until) {
    let xAxis = [];
    for (let i = 0; i < until; i++) {
        xAxis.push(i * interval + " min");
    }
    return xAxis;
}

// Makes all the Y values foreach of the datasets from predections
function populateYValues(predictionData, until, interval, backgroundColor, borderColor) {
    let yValues = [];

    for (let i = 0; i < predictionData.data.length; i++) {
        yValues.push({
            label: predictionData.data[i].name,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            data: generateYValues(predictionData.data[i], until, interval)
        });
    }

    return yValues;
}

// Generates the Y values for a single dataset, the output is filled with 0, unless there is a valid datapoint
function generateYValues(predictionData, until) {
    let dataSet = [];
    let fromJ = 0;
    let found = false;
    for (let i = 0; i < until; i++) {
        for (let j = fromJ; j < predictionData.thresholdPasses.length; j++) {
            if (predictionData.thresholdPasses[j].timeUntil == i) {
                dataSet.push(predictionData.thresholdPasses[j].timesExceeded);
                fromJ = j + 1;
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

// Generates a graph object
function generateGraphLive(container, xAxis, yAxis) {
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
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        }
    });
}

function populateYValuesLiveData(data, until, interval, backgroundColor, borderColor, sensorType) {
    let yValues = [];

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].liveDataArray.length; j++) {
            if (data[i].sensorType == sensorType) {
                yValues.push({
                    label: data[i].sensorType + ": Sensor " + data[i].liveDataArray[j].sensorID,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    data: generateYValuesLiveData(data[i].liveDataArray[j], until, interval)
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
    for (let i = 0; i < until; i++) {
        for (let j = fromJ; j < data.sensorLiveData.length; j++) {
            if (data.sensorLiveData[j].timeStamp == i) {
                dataSet.push(data.sensorLiveData[j].sensorValue);
                fromJ = j + 1;
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