var express = require('express');
var router = express.Router();
var fs = require('fs');
var zodiacData = JSON.parse(fs.readFileSync('zodiac.json', 'utf8'));

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/sign/:slug', function (req, res) {
  res.render('sign', {
    sign: zodiacData.signs[req.params.slug]
  });
});

module.exports = router;