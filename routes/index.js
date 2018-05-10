var express = require('express');
var path = require('path')
var router = express.Router();


router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/compress', function(req, res, next) {
  res.render('compress', { title: 'Express' });
});

router.get('/decompress', function(req, res, next) {
  res.render('decompress', { title: 'Express' });
});

router.get('/aboutme', function(req, res, next) {
  res.render('aboutme', { title: 'Express' });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
