async function jsonFetch(url) {

    let response = await fetch(url);
    let myJson = await response.json();
    console.log(myJson);
}

jsonFetch("http://localhost:5000/results?datatype=CO2&starttime=2020-03-09T00:00:00&endtime=2020-03-10T23:00:00&sensorid=1").catch(e => console.log(e));