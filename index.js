/* On webpage load calls getAll and loads data from sql or displays blank table. */
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHtmlTable(data['data']));
    // .then(data => console.log(data));
    loadHtmlTable([]);
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    console.log(event.target);
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id)
    }
});

const updateBtn = document.querySelector('#update-row-btn');

// Two ways to reload data. 1. Refresh page. 2. Real world app. Call another function grabs data in table,
// fetch table and load table with new data.
function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            location.reload();
        }
    });
}

function handleEditRow(id) {
    console.log("UPDATE ID: " + id)
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id;

}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');
    // console.log(updateNameInput);
    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: document.querySelector('#update-row-btn').dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            location.reload();
        }
    });
}

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function() {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    alert("Value: " + name + " was entered into database.")
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
    .then(data => insertRowIntoTable(data['data']))
    // .then(location.reload());

}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";
    // object is returns so we need to loop through an object. Not an array
    /* Loop through object until we hit date added. Then we can change the date format. */
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`
        }
    }
    // data.forEach(function({id, name, date_added}) {
        // tableHtml += `<td>${id}</td>`;
        // tableHtml += `<td>${name}</td>`;
        // tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`
        tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`
        tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`
    // });

    tableHtml += "<tr/>";

    if(isTableData) { // if no data exists
        table.tableHtml = tableHtml;
        location.reload();
    }

    else { // create new row
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
        location.reload();
    }
}

function loadHtmlTable(data) {
    const table = document.querySelector('table tbody');

    // console.log(data);
    // let tableHtml = "";
    if(data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";

    data.forEach(function({id, name, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`
        tableHtml += "</tr>"
    });

    table.innerHTML = tableHtml;
}