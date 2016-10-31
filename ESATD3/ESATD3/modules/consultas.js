

var mysql = require('./mysqlConnection.js');
var SQL1 = "CREATE TABLE IF NOT EXISTS BASE_VAL AS (select b.*, CASE RESPUESTA WHEN 'NS/NC' THEN 0 WHEN 'mUY insatisfecho' THEN 1 WHEN 'Insatisfecho' THEN 2 WHEN 'Ni satisfecho ni insatisfecho' THEN 3 WHEN 'Satisfecho' THEN 4 WHEN 'Muy satisfecho' THEN 5 END AS VALOR_RESPUESTA FROM BASE b)";
var SQL2 = "SELECT MEDICION,NIVEL,FACULTAD,avg(VALOR_RESPUESTA) AS PROMEDIO FROM BASE_VAL GROUP BY MEDICION,NIVEL,FACULTAD ORDER BY PROMEDIO";
var sql3 = "select count(ID) from BASE_VAL WHERE VALOR_RESPUESTA = 0";


var rows = function (req, res) {
    mysql.handle_database(req, res);
};


module.exports.rows = rows;