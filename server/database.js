const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
})

class DbService {
    static getDbServiceInstance() { // only creates once
        return instance ? instance : new DbService(); // if instance not null return it otherwise create new instance.
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * from names";

                connection.query(query, (err, results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            // console.log(response);
            return response;
        } catch(error) {
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            console.log("After date: " + name)
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, data_added) VALUES (?, ?);"; //? ? is used to avoid sql injection
                console.log("AFTER QUERY!!!!")
                connection.query(query, [name, dateAdded] ,(err, result) => {
                    if(err) reject(new Error(err.message) + "\n Error Happened!!!!!!!");
                    resolve(result.insertId);
                })
            });

            console.log(insertId);
            return insertId;
            
        } catch (error) {
            console.log(error + "HELLO I WAS CALLED");
        }
    }

    // Test to see if database connects with code
    async newName() {

        try {
        const response = await new Promise((resolve, reject) => {
        const query = "INSERT INTO names (name, date_added) VALUES ('Jim', '09/10/1996');";
        connection.query(query, (err, results) => {
            if(err) reject(new Error(err.message));
            resolve(results);
        })
    });

    return response;

}
catch (error) {
    console.log(error);
}
    }
}

module.exports = DbService; // can be used in other files