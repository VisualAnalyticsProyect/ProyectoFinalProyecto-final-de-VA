var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '104.198.238.71',
    port: '3306',
    user: 'root',    
    password: 'metallica9804',
    database: 'esat'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

connection.end();