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
/* Update name section for button and key press */
updateBtn.onclick = async function() {
    const updateNameInput = document.querySelector('#update-name-input');
    const nameValue = updateNameInput.value;
    if(nameValue === "") {
        var text = "Please don't leave blank and try again"
        modalDisplayAlert(text);
    }
    else {

    
    var testName = false;
    updateNameInput.value = "";

    try {
        await passData().then(test => {
            console.log(test[0].name)
            var i = 0;
            for(i = 0; i < test.length; i++) {
                if(test[i].name.toLowerCase() === nameValue.toLowerCase()) {
                    /* Abort */
                    testName = true;
                    console.log(testName);
                }
            }
        });
    }
    catch(err) {
        console.log(err)
    }
    updateCheckName(testName,nameValue) 
}
}

const updateNameInput = document.querySelector('#update-name-input');

updateNameInput.addEventListener("keypress", async function(event) {
    if(event.key === "Enter" && updateNameInput.value !== "") {
        event.preventDefault();
        const nameValue = updateNameInput.value;
        var testName = false;
        updateNameInput.value = "";

        try {
            await passData().then(test => {
                console.log(test[0].name)
                var i = 0;
                for(i = 0; i < test.length; i++) {
                    if(test[i].name.toLowerCase() === nameValue.toLowerCase()) {
                        /* Abort */
                        testName = true;
                        console.log(testName);
                    }
                }
            });
        }
        catch(err) {
            console.log(err)
        }
        
    updateCheckName(testName,nameValue)
}
else if (event.key === "Enter" && updateNameInput.value === "")
{
    var text = "Please don't leave blank and try again"
    modalDisplayAlert(text)
}

});

async function updateCheckName(testName,nameValue) {
    if(testName === false) {

        var text = "Value: " + nameValue + " was updated into the database."
        var funValue = await modalDisplayAlert(text);
        nameValue.value = "";

        if(funValue === true) {
        fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                id: document.querySelector('#update-row-btn').dataset.id,
                name: nameValue,
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
    }
    else {
        var text = "This name is not accepted because it already exists in the database. \
        please try again"
        modalDisplayAlert(text)
    }
}

/* Add name section button and enter key press */
const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = async function() {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    if (name === "") {
        var text = "Please don't leave blank and try again";
        modalDisplayAlert(text)
    }

    else {

    
    var testName = false; 
    nameInput.value = "";

    try {
        await passData().then(test => {
            console.log(test[0].name)
            var i = 0;
            for(i = 0; i < test.length; i++) {
                if(test[i].name.toLowerCase() === name.toLowerCase()) {
                    /* Abort */
                    testName = true;
                    // console.log(testName);
                }
            }
        });
    }
    catch(err) {
        console.log(err)
    }
    checkName(testName, name, nameInput)
}
    /* Below is what I used before I used async/await */
    // .then(checkName(testName,name,nameInput));
}

async function passData() {
    try {
    const response = await fetch('http://localhost:5000/getAll')
    const test = await response.json();
    return test['data']
    }
    catch(err) {
        console.log(err)
    }
}

async function checkName(testName,name,nameInput) {

    if(testName === false) {

        var text = "Value: " + name + " was entered into the database."
        var funValue = await modalDisplayAlert(text);
        nameInput.value = "";
        /* Might need to cut into two parts so return value will be received */
        // sends to backend
        if(funValue === true) {
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


}
    else {
        var text = "This name is not accepted because it already exists in the database. \
        Please try again."
        await modalDisplayAlert(text);
    }
}

/* Modal pop up for alert */
function modalDisplayAlert(text) {
    var modal = document.querySelector("#my_modal");
    var span = document.querySelectorAll(".close")[0]
    document.querySelectorAll(".modal_text")[0].innerHTML = text;
    modal.style.display = "block";
    /* We wait for one of these to be clicked before continuing :)  */
    return new Promise((resolve) => {

    span.onclick = function() {
        modal.style.display = "none";
        resolve(true)
    }

    window.onclick = function(event) {
        if(event.target == modal) {
            modal.style.display = "none";
        }
        resolve(true)
    }
})

    // return true
}

/* ENTER KEY PRESS FOR ADDING NAME */
const nameInputEnter = document.querySelector("#name-input");

nameInputEnter.addEventListener("keypress", async function(event) {
    if(event.key === "Enter" && nameInputEnter.value !== "") {
        event.preventDefault();
        const name = nameInputEnter.value;
        var testName = false; 
        nameInputEnter.value = "";

        try {
            await passData().then(test => {
                console.log(test[0].name)
                var i = 0;
                for(i = 0; i < test.length; i++) {
                    if(test[i].name.toLowerCase() === name.toLowerCase()) {
                        /* Abort */
                        testName = true;
                        console.log(testName);
                    }
                }
            });
        }
        catch(err) {
            console.log(err)
        }

    checkName(testName, name, nameInputEnter);

    }
    else if (event.key === "Enter" && nameInputEnter.value === "")
    {
        var text = "Please don't leave blank and try again"
        modalDisplayAlert(text)
    }
});

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
        // else {

        //     console.log('Wrong') /* Prints even with if statement triggered. May need to change from a forEach */
        // }
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