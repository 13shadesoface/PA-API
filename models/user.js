const pool = require('./pool');
const {httpError} = require('../errorHandler/errors');

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
            if (err) reject(new httpError('Could not connect to database',500));
            console.log('connected to mysql as id ' + connection.threadId);
            // Use the connection
            connection.query('SELECT * FROM users', function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
              // Handle error after the release.
              if (error) reject(new httpError('SQL error code :' + err.code,500));
              resolve(results);
            });
          });
    });
}

function findOne(id){
  return new Promise((resolve,reject) => {
    pool.getConnection((err, connection) => {
        if (err) reject(new httpError('Could not connect to database',500));
        console.log('connected to mysql as id ' + connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM users WHERE userID=?',id, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (results.length === 0) reject(new httpError('No user with given id found in the database',400))
          if (error) reject(new httpError('SQL error code :' + err.code,500));
          resolve(results[0]);
        });
      });
});
}

function addOne(newUser){
  return new Promise(async (resolve,reject) => {
    for (const key of neccessaryFields) {
      if (newUser[key] == undefined || newUser[key] == null || newUser[key] === "") {
        reject(new httpError(`${key} is neccessary`,400));
      }
    }
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new httpError('Could not connect to database',500)) ;
      }
      console.log('connected to mysql as id ' + connection.threadId);
      // Use the connection

      connection.query('INSERT INTO USERS SET ?', newUser, function (err, res, fields) {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (err){
          if (err.code == "ER_DUP_ENTRY") {
            reject(new httpError('a user with the same email already exists',400));
          }else{
            reject(new httpError('SQL error code : ' + err.code),500);
          }
        } 
        else resolve(res.insertId);
      });
    });
  });
}


module.exports = {
    findAll,
    findOne,
    addOne
};