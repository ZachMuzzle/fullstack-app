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
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";
                connection.query(query, [name, dateAdded], (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result.insertId); // Just gets id of row
                })
            });

            console.log(insertId);
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            }

        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id,10);
            const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM names WHERE id = ?";
            connection.query(query, [id], (err, result) => {
                if(err) reject(new Error(err.message));
                resolve(result.affectedRows); //resolve sends back value after promise. Result is just an object
            })
        });
        console.log(response); 
        return response === 1 ? true : false;
        } catch (error) {
            console.log("ERROR in DELETE")
            return false; // if breaks return false and then handle in front end
        }
    }

    async truncateAllData(){
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "TRUNCATE TABLE names;";
                connection.query(query, (err, result) => {
                    if(err) reject(new Error(err.message));
                    resolve(result.affectedRows); //resolve sends back value after promise. Result is just an object
                })
            });
            // console.log("RESPONSE TO TRUNCATE: " + JSON.stringify(response))
            return response === 0 ? true : false;
        } catch (error) {
            console.log(error)
        }
    }

    async updateNameById(id,name,date_added) {
        try {
            id = parseInt(id,10);
            const response = await new Promise((resolve, reject) => {
            const query = "UPDATE names set name = ?, date_added = ? WHERE id = ?;"; // helps with sql injection. [values go to ?. instead of typing them out]
            connection.query(query, [name,date_added,id], (err, result) => {
                if(err) reject(new Error(err.message));
                resolve(result.affectedRows); //resolve sends back value after promise. Result is just an object
            })
        });
        console.log(response); 
        return response === 1 ? true : false;
        } catch (error) {
            console.log(error)
            return false; // if breaks return false and then handle in front end
        }
    }
//     async newName(name) {

//         try {
//         console.log(name);
//         const dateAdded = new Date();
//         const response = await new Promise((resolve, reject) => {
//         const query = "INSERT INTO names (name, date_added) VALUES (?, ?);";
//         connection.query(query, [name, dateAdded], (err, results) => {
//             if(err) reject(new Error(err.message));
//             resolve(results.response);
//         })
//     });

//     return response;

// }
// catch (error) {
//     console.log(error);
// }
//     }
}

module.exports = DbService; // can be used in other files