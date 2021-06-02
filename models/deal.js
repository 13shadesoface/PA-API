const pool = require('./pool');
const {httpError} = require('../errorHandler/errors');

const neccessaryFields = [
  "comment",
  "price",
  "userID",
  "staffID",
  "productID"
]

function findAll(){
    return new Promise((resolve,reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(new httpError('Could not connect to database',500));
            console.log('connected to mysql as id ' + connection.threadId);
            // Use the connection
            connection.query('SELECT * FROM deals', function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
              // Handle error after the release.
              if (error) reject(new httpError('SQL error code :' + err.code,500));
              resolve(results);
            });
          });
    });
}

function findOne(productID){
  return new Promise((resolve,reject) => {
    pool.getConnection((err, connection) => {
        if (err) reject(new httpError('Could not connect to database',500));
        console.log('connected to mysql as id ' + connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM deals WHERE productID=?',productID, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (results.length === 0) reject(new httpError('No product with given id found in the database',400))
          if (error) reject(new httpError('SQL error code :' + err.code,500));
          resolve(results);
        });
      });
});
}

function addOne(newDeal){
  return new Promise(async (resolve,reject) => {
    for (const key of neccessaryFields) {
      if (newDeal[key] == undefined || newDeal[key] == null || newDeal[key] === "") {
        reject(new httpError(`${key} is neccessary`,400));
      }
    }
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new httpError('Could not connect to database',500)) ;
      }
      console.log('connected to mysql as id ' + connection.threadId);
      // Use the connection

      connection.query('INSERT INTO deals SET ?', newDeal, function (err, res, fields) {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (err){
            if(err.code == "ER_NO_REFERENCED_ROW_2") reject(new httpError("one of those : staffID / userID / productID does not match id in database",400))
            reject(new httpError('SQL error code : ' + err.code,500));
        }else resolve(res.insertId);
      });
    });
  });
}

module.exports = {
    findAll,
    findOne,
    addOne
};