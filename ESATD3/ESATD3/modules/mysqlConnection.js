var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: '104.198.238.71',
    user: 'root',
    password: 'metallica9804',
    database: 'esat',
    debug: false
});


handle_database = function (req, res, queryCommand) {

    pool.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(queryCommand, function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });
}


module.exports.handle_database = handle_database;