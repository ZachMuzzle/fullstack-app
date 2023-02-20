/* On webpage load calls getAll and loads data from sql or displays blank table. */
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHtmlTable(data['data']));
    // .then(data => console.log(data));
    // loadHtmlTable([]);  // not sure why this is added

    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => truncateData(data['data']));
    
});
function truncateData(data) {
    if(data.length === 0) {
        return true;
    }
    const truncateBtn = document.querySelector('#truncate');
    truncateBtn.hidden = false;

    truncateBtn.onclick = function() {
    fetch('http://localhost:5000/truncate')
    .then(response => response.json())
    .then(data => {
        if(data.data) {
            location.reload();
        }
    })
    }
}
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
            name: updateNameInput.value,
            date_added: new Date().toLocaleString()
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            location.reload();
        }
    });
}

const updateNameInput = document.querySelector('#update-name-input');

updateNameInput.addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        event.preventDefault();

        fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                id: document.querySelector('#update-row-btn').dataset.id,
                name: updateNameInput.value,
                date_added: new Date().toLocaleString()
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                location.reload();
            }
        });
}

});

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function() {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    alert("Value: " + name + " was entered into the database.")
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

const nameInputEnter = document.querySelector("#name-input");

nameInputEnter.addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        event.preventDefault();
        console.log("TEST")
        const name = nameInputEnter.value;
        alert("Value: " + name + " was entered into the database.")
        nameInputEnter.value = "";
    
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
        
    }
})

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
        tableHtml += `<td class="name-value">${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`
        tableHtml += "</tr>"
    });

    table.innerHTML = tableHtml;
}
/* Search bar functionality */
const searchBar = document.querySelector('#search-btn');

searchBar.onclick = function() {
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    // console.log(searchValue)
    searchInput.value = "";

    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => checkForNameMatch(data['data'],searchValue));


}

/* Code for using enter button on keyboard instead of button click */
const inputValue = document.querySelector('#search-input');
inputValue.addEventListener("keypress", function(event) {
    
    if(event.key === "Enter") {
        
        event.preventDefault(); // Used for canceling action??

        const inputValueStore = inputValue.value;
        inputValue.value = "";

        fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => checkForNameMatch(data['data'],inputValueStore));
    }
});

/* Checks for name match from database with input name and if so changes background to yellow */
function checkForNameMatch(data, searchValue) {
    const nameYellow = document.querySelectorAll(".name-value");
    const nameYellowValue = document.querySelectorAll(".name-value");

    data.forEach(function({name}) {
        if(name === searchValue) {
        for(i = 0; i < nameYellow.length; i++) {
            // console.log("Value of class: " + nameYellowValue[i].innerHTML);
            if(nameYellowValue[i].innerHTML === searchValue) {
                
            nameYellow[i].style.backgroundColor = "yellow";
            document.querySelector('#clear-btn').hidden = false
            }
        }
        } 
        else {

            console.log('Wrong') /* Prints even with if statement triggered. May need to change from a forEach */
        }
    });
}

/* Clear button for searches that show yellow */
const clearSearchButton = document.querySelector('#clear-btn');

clearSearchButton.onclick = function() {
    const nameYellow = document.querySelectorAll(".name-value");
    const nameYellowValue = document.querySelectorAll(".name-value");

    for(i = 0; i < nameYellow.length; i++) {
        if(nameYellowValue[i].style.backgroundColor === 'yellow') {
            nameYellowValue[i].style.backgroundColor = '';
        }
    }
    document.querySelector('#clear-btn').hidden = true;

}