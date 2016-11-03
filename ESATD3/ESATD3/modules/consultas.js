

var mysql = require('./mysqlConnection.js');
var crearTablaCuantificacion = "CREATE TABLE IF NOT EXISTS BASE_VAL AS (select b.*, CASE RESPUESTA WHEN 'NS/NC' THEN 0 WHEN 'mUY insatisfecho' THEN 1 WHEN 'Insatisfecho' THEN 2 WHEN 'Ni satisfecho ni insatisfecho' THEN 3 WHEN 'Satisfecho' THEN 4 WHEN 'Muy satisfecho' THEN 5 END AS VALOR_RESPUESTA FROM BASE b)";
var resumen = "SELECT MEDICION,NIVEL,FACULTAD,avg(VALOR_RESPUESTA) AS PROMEDIO FROM BASE_VAL GROUP BY MEDICION,NIVEL,FACULTAD ORDER BY PROMEDIO";
var resumenNivel = "SELECT NIVEL,avg(VALOR_RESPUESTA) AS PROMEDIO FROM BASE_VAL GROUP BY NIVEL ORDER BY PROMEDIO";
var numDatos = "SELECT count(ID) FROM BASE_VAL WHERE VALOR_RESPUESTA = 0";


var getResumen = function (req, res) {
    mysql.handle_database(req, res,resumenNivel);
};


module.exports.getResumen = getResumen;