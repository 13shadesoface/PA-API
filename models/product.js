const pool = require('./pool');
const {httpError} = require('../errorHandler/errors');

const neccessaryFields = [
  "name",
  "description",
  "price",
  "stockAddressID",
  "userID",
  "brandID",
  "categoryID"
]

function findAll(){
    return new Promise((resolve,reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(new httpError('Could not connect to database',500));
            console.log('connected to mysql as id ' + connection.threadId);
            // Use the connection
            connection.query('SELECT * FROM products', function (error, results, fields) {
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
        connection.query('SELECT * FROM products WHERE productID=?',id, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (results.length === 0) reject(new httpError('No product with given id found in the database',400))
          if (error) reject(new httpError('SQL error code :' + err.code,500));
          resolve(results[0]);
        });
      });
});
}

function addOne(newProduct){
  return new Promise(async (resolve,reject) => {
    for (const key of neccessaryFields) {
      if (newProduct[key] == undefined || newProduct[key] == null || newProduct[key] === "") {
        reject(new httpError(`${key} is neccessary`,400));
      }
    }
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new httpError('Could not connect to database',500)) ;
      }
      console.log('connected to mysql as id ' + connection.threadId);
      // Use the connection

      connection.query('INSERT INTO products SET ?', newProduct, function (err, res, fields) {
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (err)  reject(new httpError('SQL error code : ' + err.code,500));
        else resolve(res.insertId);
      });
    });
  });
}

function updateOne(id,status){
  return new Promise((resolve,reject) => {
    pool.getConnection((err, connection) => {
        if (err) reject(new httpError('Could not connect to database',500));
        console.log('connected to mysql as id ' + connection.threadId);
        // Use the connection
        connection.query('UPDATE products SET status=? WHERE productID=?',[status,id], function (error, result, fields) {
          // When done with the connection, release it.
          connection.release();
          console.log(result);
          // Handle error after the release.
          if (result.affectedRows === 0) reject(new httpError('Could not find product with given id, no changes made',400))
          if (error) reject(new httpError('SQL error code :' + err.code,500));
          resolve();
        });
      });
});
}

module.exports = {
    findAll,
    findOne,
    addOne,
    updateOne
};