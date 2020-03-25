async function jsonFetch(url) {

    let response = await fetch(url);
    let myJson = await response.json();
    console.log(myJson);
}

jsonFetch("http://localhost:5000/getallsensors").catch(e => console.log(e));