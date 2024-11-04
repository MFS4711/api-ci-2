const API_KEY = "R8aumRoNREx88_2W2p84eO-vU5w";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));

// async functions can be used as opposed to .then - wrap promises in this
// use fetch for the api url - used queryString because of variable used
// use await before this as variable won't be assigned until fetch task is completed - use await for promises
// similar reason for the data - we want it in a object format
// final thing is to add error checking - can do this with if statement
// response.ok means success
// in this example we want to display the data in the button modal with id resultsModal - so we would create and call that function if response is ok

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}