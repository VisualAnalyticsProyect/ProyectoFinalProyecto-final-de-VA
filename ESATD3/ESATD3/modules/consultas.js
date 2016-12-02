

var mysql = require('./mysqlConnection.js');
var crearTablaCuantificacion = "CREATE TABLE IF NOT EXISTS BASE_VAL AS (select b.*, CASE RESPUESTA WHEN 'NS/NC' THEN 0 WHEN 'mUY insatisfecho' THEN 1 WHEN 'Insatisfecho' THEN 2 WHEN 'Ni satisfecho ni insatisfecho' THEN 3 WHEN 'Satisfecho' THEN 4 WHEN 'Muy satisfecho' THEN 5 END AS VALOR_RESPUESTA FROM BASE b)";
var resumen = "SELECT MEDICION,NIVEL,FACULTAD,avg(VALOR_RESPUESTA) AS PROMEDIO FROM BASE_VAL GROUP BY MEDICION,NIVEL,FACULTAD ORDER BY PROMEDIO";
var resumenNivel = "SELECT NIVEL,avg(VALOR_RESPUESTA) AS PROMEDIO FROM BASE_VAL GROUP BY NIVEL ORDER BY PROMEDIO";
var numDatos = "SELECT count(ID) FROM BASE_VAL WHERE VALOR_RESPUESTA = 0";
var tree = "SELECT DISTINCT NIVEL,FACULTAD,DEPARTAMENTO,PROGRAMA FROM BASE_VAL"
var paralel = function (anio, estudios, facultad, departamento, programa, condicion) {
    anio = anio == undefined ? "" : anio;
    facultad = facultad == undefined ? "" : facultad;
    estudios = estudios == undefined ? "" : estudios;
    departamento = departamento == undefined ? "" : departamento;
    programa = programa == undefined ? "" : programa;
    condicion = condicion == undefined ? "" : condicion;

    return "SELECT AVG(b.VALOR_RESPUESTA) AS PROMEDIO,COUNT(b.PREGUNTA)AS CANTIDAD,b.PREGUNTA FROM BASE_VAL b " +
        "WHERE b.MEDICION LIKE '" + anio + "%' AND " +
        "b.NIVEL LIKE '" + estudios + "%' AND " +
        "b.FACULTAD LIKE '" + facultad + "%' AND " +
        "b.DEPARTAMENTO LIKE '" + departamento + "%' AND " +
        "PROGRAMA LIKE '" + programa + "%' " +
        "GROUP BY b.PREGUNTA ORDER BY b.PREGUNTA";
}

var getResumen = function (req, res) {
    mysql.handle_database(req, res,resumenNivel);
};

var getParalelInfo = function (req, res) {
    var q = req.query;
    mysql.handle_database(req, res, paralel(q.anio,q.estudios,q.facultad,q.departamento,q.programa,q.condicion));
};

var getTree = function (req, res) {  
    mysql.handle_database(req, res,tree);
};



module.exports.getResumen = getResumen;
module.exports.getTree = getTree;
module.exports.getParalelInfo = getParalelInfo;

/*
AÑO
NIVEL ESTUDIOS
FACULTAD
DEPARTAMENTO
PROGRAMA
ENTERO PARA LA CANTIDAD 0 NO SABE NO RESPONDE 1 CANTIDAD SATISFECHOS

JSON PROMEDIO, CANTIDAD, PREGUNTA

JSON SELECT DISTINCT TEMA SUBTEMA PREGUNTA 

JSON SELECT DISCTINCT 

SELECT * FROM BASE_VAL b WHERE b.MEDICION = '2014' AND b.NIVEL LIKE '%' AND b.FACULTAD LIKE '%' AND b.DEPARTAMENTO LIKE '%' AND PROGRAMA LIKE '%' */