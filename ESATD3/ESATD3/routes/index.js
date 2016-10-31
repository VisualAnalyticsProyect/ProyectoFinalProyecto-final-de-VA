var express = require('express');
var router = express.Router();
var consultas = require('../modules/consultas.js');

/* GET home page. */
router.get('/', function (req, res) {        
    res.render('index', { title: 'ESAT',condition:false,anyArray:[1,2,3]});
});

router.get('/consultas', function (req, res) {
    consultas.rows(req, res);  
});


module.exports = router;