

var mysql = require('./mysqlConnection.js');
var crearTablaCuantificacion = "CREATE TABLE IF NOT EXISTS BASE_VAL AS (select b.*, CASE RESPUESTA WHEN 'NS/NC' THEN 0 WHEN 'mUY insatisfecho' THEN 1 WHEN 'Insatisfecho' THEN 2 WHEN 'Ni satisfecho ni insatisfecho' THEN 3 WHEN 'Satisfecho' THEN 4 WHEN 'Muy satisfecho' THEN 5 END AS VALOR_RESPUESTA FROM BASE b)";
var resumen = "SELECT MEDICION,NIVEL,FACULTAD,avg(VALOR_RESPUESTA) AS PROMEDIO FROM BASE_VAL GROUP BY MEDICION,NIVEL,FACULTAD ORDER BY PROMEDIO";
var resumenNivel = "SELECT NIVEL,avg(VALOR_RESPUESTA) AS PROMEDIO FROM BASE_VAL GROUP BY NIVEL ORDER BY PROMEDIO";
var numDatos = "SELECT count(ID) FROM BASE_VAL WHERE VALOR_RESPUESTA = 0";
var tree = "SELECT DISTINCT TEMA, SUBTEMA, PREGUNTA, No_pregunta FROM BASE_VAL ORDER BY No_Pregunta;";
var promedio = function (anio, estudios, facultad, departamento, programa, condicion) {

    return "SELECT PREGUNTAS.No_pregunta ,PREGUNTAS.PREGUNTA, ifnull(buenas.Suma/todas.Suma,0) as PorcentajeStasifaccion FROM " +
        "(SELECT PREGUNTA,No_pregunta,SUM(NUM_RESPUESTA * VALOR_RESPUESTA) as Suma FROM BASE_VAL " +
        "WHERE MEDICION LIKE '%" + anio + "%' AND " +
        "NIVEL LIKE '%" + estudios + "%' AND " +
        "FACULTAD LIKE '%" + facultad + "%' AND " +
        "DEPARTAMENTO LIKE '%" + departamento + "%' AND " +
        "PROGRAMA LIKE '%" + programa + "%' " +
        "GROUP BY PREGUNTA, No_pregunta) as buenas " +
        "INNER JOIN (SELECT No_pregunta,SUM(NUM_RESPUESTA) as Suma FROM BASE_VAL " +
        "WHERE MEDICION LIKE '%" + anio + "%' AND " +
        "NIVEL LIKE '%" + estudios + "%' AND " +
        "FACULTAD LIKE '%" + facultad + "%' AND " +
        "DEPARTAMENTO LIKE '%" + departamento + "%' AND " +
        "PROGRAMA LIKE '%" + programa + "%' " +
        "GROUP BY PREGUNTA, No_pregunta) as todas " +
        "ON buenas.No_pregunta = todas.No_pregunta RIGHT JOIN PREGUNTAS ON buenas.No_pregunta = PREGUNTAS.No_pregunta " + 
        "ORDER BY  No_pregunta";
};
var satisinsatis = function (anio, estudios, facultad, departamento, programa, condicion) {

    return "SELECT PREGUNTAS.No_pregunta ,PREGUNTAS.PREGUNTA, ifnull(100*buenas.Suma/todas.Suma,0) as PorcentajeStasifaccion FROM " +
        "(SELECT PREGUNTA,No_pregunta,SUM(NUM_RESPUESTA) as Suma FROM BASE_VAL " +
        "WHERE MEDICION LIKE '%" + anio + "%' AND " +
        "NIVEL LIKE '%" + estudios + "%' AND " +
        "FACULTAD LIKE '%" + facultad + "%' AND " +
        "DEPARTAMENTO LIKE '%" + departamento + "%' AND " +
        "PROGRAMA LIKE '%" + programa + "%' AND " +
        "VALOR_RESPUESTA IN (4, 5)" +
        "GROUP BY PREGUNTA, No_pregunta) as buenas " +
        "INNER JOIN (SELECT No_pregunta,SUM(NUM_RESPUESTA) as Suma FROM BASE_VAL " +
        "WHERE MEDICION LIKE '%" + anio + "%' AND " +
        "NIVEL LIKE '%" + estudios + "%' AND " +
        "FACULTAD LIKE '%" + facultad + "%' AND " +
        "DEPARTAMENTO LIKE '%" + departamento + "%' AND " +
        "PROGRAMA LIKE '%" + programa + "%' AND " +
        "VALOR_RESPUESTA > 0 " +
        "GROUP BY PREGUNTA, No_pregunta) as todas " +
        "ON buenas.No_pregunta = todas.No_pregunta RIGHT JOIN PREGUNTAS ON buenas.No_pregunta = PREGUNTAS.No_pregunta " + 
        "ORDER BY  No_pregunta";
};

var validar = function (req) {
    var q = req.query;
    q.anio = q.anio == undefined ? "" : q.anio;
    q.facultad = q.facultad == undefined ? "" : q.facultad;
    q.estudios = q.estudios == undefined ? "" : q.estudios;
    q.departamento = q.departamento == undefined ? "" : q.departamento;
    q.programa = q.programa == undefined ? "" : q.programa;
    q.condicion = q.condicion == undefined ? "" : q.condicion;
}

var getResumen = function (req, res) {
    mysql.handle_database(req, res,resumenNivel);
};

var getParalelInfo = function (req, res) {
    validar(req);
    var q = req.query;
    mysql.handle_database(req, res, promedio(q.anio,q.estudios,q.facultad,q.departamento,q.programa,q.condicion));
};

var getParalelSI = function (req, res) {
    validar(req);
    var q = req.query;
    mysql.handle_database(req, res, satisinsatis(q.anio, q.estudios, q.facultad, q.departamento, q.programa, q.condicion));
};

var getTree = function (req, res) {  
    mysql.handle_database(req, res,tree);
};



module.exports.getResumen = getResumen;
module.exports.getTree = getTree;
module.exports.getParalelInfo = getParalelInfo;
module.exports.getParalelSI = getParalelSI;

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