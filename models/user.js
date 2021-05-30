var mysql = require('mysql');
const utils = require('../utils');
const {internalError,badRequestError} = require('../errorHandler/errors');

var pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    user     : 'Test',
    password : 'testroot',
    database: 'PA'
});
pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

pool.on('error',(error)=> {console.log(error);})

const neccessaryFields = [
  "name",
  "firstName",
  "title",
  "email",
  "phone"
]

function findAll(){
    return new Promise((resolve,reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(new internalError('Could not connect to database'));
            console.log('connected to mysql as id ' + connection.threadId);
            // Use the connection
            connection.query('SELECT * FROM users', function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
              // Handle error after the release.
              if (error) reject(new badRequestError(11,'SQL error code :' + err.code));
              resolve(results);
            });
          });
    });
}

function addOne(newUser){
  return new Promise(async (resolve,reject) => {
    for (const key of neccessaryFields) {
      if (newUser[key] == undefined || newUser[key] == null || newUser[key] === "") {
        reject(new badRequestError(030,`${key} is neccessary`));
      }
    }
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new internalError('Could not connect to database')) ;
      }
      console.log('connected to mysql as id ' + connection.threadId);
      // Use the connection

      connection.query('INSERT INTO USERS SET ?', newUser, function (err, res, fields) {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (err){
          if (err.code == "ER_DUP_ENTRY") {
            reject(new badRequestError(11,'a user with the same email already exists'));
          }else{
            reject(new internalError('SQL error code : ' + err.code));
          }
        } 
        else resolve(res.insertId);
      });
    });
  });
}


module.exports = {
    findAll,
    addOne
};