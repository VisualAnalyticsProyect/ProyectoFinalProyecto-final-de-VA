var express = require('express');
var router = express.Router();
var consultas = require('../modules/consultas.js');

/* GET home page. */
router.get('/', function (req, res) {        
    res.render('index', { title: 'ESAT' });
});

router.get('/paralel', function (req, res) {
    res.render('paralel', { title: 'ESAT' });
});

router.get('/barchar', function (req, res) {
    res.render('barchar', { title: 'ESAT' });
});

router.get('/resumen', function (req, res) {
    consultas.getResumen(req, res);  
});

router.get('/tree', function (req, res) {
    consultas.getTree(req, res);
});

router.get('/paralelinfo', function (req, res) {
    consultas.getParalelInfo(req, res);
});

router.get('/paralelsi', function (req, res) {
    consultas.getParalelSI(req, res);
});

module.exports = router;
