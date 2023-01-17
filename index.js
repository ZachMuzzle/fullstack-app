document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHtmlTable(data['data']));
    // .then(data => console.log(data));
    loadHtmlTable([]);
});

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function() {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    // sends to backend
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));

}

function insertRowIntoTable(data) {

}

function loadHtmlTable(data) {
    const table = document.querySelector('table tbody');

    console.log(data);
    // let tableHtml = "";
    if(data.length == 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    }
}