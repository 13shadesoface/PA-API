var mysql = require('mysql');

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

module.exports = pool