// Constants for API and modal
const API_KEY = "R8aumRoNREx88_2W2p84eO-vU5w";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// get data
document.getElementById("status").addEventListener("click", e => getStatus(e));
// post data
document.getElementById("submit").addEventListener("click", e => postForm(e));

// currently the form data received does not match criteria of API
// data shows multiple option arrays when it should just be one to be a key and the values
// function below creates an empty array, takes each entry of the option array and puts that into the new array
// it then deletes all mention of "options" from the form data and creates a new key/value with the "options"/new array
// returns from to be used in post form
function processOptions(form) {
    
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0]=== "options") {
            optArray.push(entry[1]);
        }
    }

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    // // test code to check if data is sent in the required form - see procesOptions function for more info
    // for (let entry of form.entries()) {
    //     console.log(entry);
    // }

    // below may be specific to API but follow instructions on the API
    // use body: form, attaches the form
    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                        "Authorization": API_KEY,
                                },
                                body: form,
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();

}

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
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

