var express = require('express');
var router = express.Router();
var consultas = require('../modules/consultas.js');

/* GET home page. */
router.get('/', function (req, res) {        
    res.render('index', { title: 'ESAT' });
});

router.get('/resumen', function (req, res) {
    consultas.getResumen(req, res);  
});


module.exports = router;