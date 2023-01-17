const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { response } = require('express');
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

    const result = db.newName(); /* Change this back to original this is for testing */

    result
    .then(data => response.json({success: true}))
    .catch(err => console.log(err));
});
// read
// Only actives with URL has /getAll at end
app.get('/getAll', (request, response) => {
    const db = DbService.getDbServiceInstance();

    const result = db.getAllData();

    result.then(data => response.json({data: data}))
    .catch(err => console.log(err));
});
// update

// delete

app.listen(process.env.PORT, () => console.log("App is running"));