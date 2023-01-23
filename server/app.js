const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { response, request } = require('express');
dotenv.config();

const database = require('./database');
const DbService = require('./database');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// create
app.post('/insert', (request,response) => {
    // console.log(request.body);
    const {name}  = request.body // just grabs the name
    const db = DbService.getDbServiceInstance();

    const result = db.insertNewName(name); /* Change this back to original this is for testing */

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/truncate', (request, response) => {
    const db = DbService.getDbServiceInstance();

    const result = db.truncateAllData();

    result
    .then(data => response.json({data:data}))
    .catch(err => console.log(err));
})
// read
// Only actives with URL has /getAll at end
app.get('/getAll', (request, response) => {
    const db = DbService.getDbServiceInstance();

    const result = db.getAllData();

    result.then(data => response.json({data: data}))
    .catch(err => console.log(err));
});
// update
app.patch('/update', (request, response)=> {
    // console.log(request.body)
    const {id, name, date_added} = request.body;
    const db = DbService.getDbServiceInstance();

    const result = db.updateNameById(id, name,date_added);

    result.then(data => response.json({success: data})) // response has name of 'success' filled with data
    .catch(err => console.log(err));

})
// delete has to have an id to work.
app.delete('/delete/:id', (request, response) => {
    // console.log(request.params)
    const {id} = request.params;
    const db = DbService.getDbServiceInstance();

    const result = db.deleteRowById(id);

    result
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));

});
app.listen(process.env.PORT, () => console.log("App is running"));