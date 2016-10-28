var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'ESAT',condition:false,anyArray:[1,2,3]});
});

module.exports = router;